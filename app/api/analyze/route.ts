import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiter — 10 requests per minute per IP
// ─────────────────────────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

// Prevent the map from growing indefinitely on long-running instances
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap.entries()) {
    if (now > entry.reset) rateMap.delete(key);
  }
}, 5 * 60_000);

// ─────────────────────────────────────────────────────────────────────────────
// Types (must match page.tsx)
// ─────────────────────────────────────────────────────────────────────────────
type Classification =
  | "Directly Stated"
  | "Concept Present"
  | "Inferred"
  | "Cultural"
  | "Church Tradition";

interface BibleResult {
  query: string;
  classification: Classification;
  explicitnessScore: number;
  oneLiner: string;
  originEra: string;
  closestBiblicalTheme: string;
  searchPopularity: string;
  theologicalConsensus: string;
  timeline: { year: string; label: string; detail: string }[];
  verses: { ref: string; text: string; context: string }[];
  misquoteWhat: string;
  misquoteReality: string;
  analysis: string;
  confidenceNote: string;
  relatedTopics: { query: string; classification: Classification }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini client
// ─────────────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const SYSTEM_PROMPT = `You are a biblical scholar and AI fact-checker for a website called "Is it in the Bible?".

Your job is to analyze whether phrases, beliefs, doctrines, or concepts appear in the Bible (specifically the World English Bible, a public-domain translation).

Respond ONLY with a valid JSON object — no markdown fences, no preamble, no trailing text.

Use this exact JSON structure:
{
  "query": "<the user's exact query>",
  "classification": "<one of: Directly Stated | Concept Present | Inferred | Cultural | Church Tradition>",
  "explicitnessScore": <integer 1–5>,
  "oneLiner": "<one crisp sentence summarizing the verdict>",
  "originEra": "<e.g. '1st Century AD', 'Ancient Greece', '18th Century'>",
  "closestBiblicalTheme": "<brief theme label, e.g. 'Divine Providence', 'Eschatology'>",
  "searchPopularity": "<one of: Very High | High | Moderate | Low>",
  "theologicalConsensus": "<e.g. 'Broadly Accepted', 'Debated', 'Minority View', 'Rejected by most scholars'>",
  "timeline": [
    { "year": "<era or year>", "label": "<short event label>", "detail": "<1–2 sentences>" }
  ],
  "verses": [
    { "ref": "<Book Chapter:Verse>", "text": "<accurate WEB verse text>", "context": "<1–2 sentence explanation>" }
  ],
  "misquoteWhat": "<the common misunderstanding or popular phrase people attribute to the Bible>",
  "misquoteReality": "<what Scripture actually says, if anything>",
  "analysis": "<2–3 short paragraphs of nuanced scholarly analysis>",
  "confidenceNote": "<single sentence on what can be stated with scholarly confidence>",
  "relatedTopics": [
    { "query": "<related topic>", "classification": "<classification>" }
  ]
}

Classification guide:
- "Directly Stated": The exact phrase or concept appears verbatim or nearly verbatim in Scripture.
- "Concept Present": The idea is clearly present in Scripture, even if the exact phrase isn't.
- "Inferred": Can be logically derived or theologically deduced from Scripture.
- "Cultural": A common belief or phrase NOT found in the Bible at all — often attributed to it falsely.
- "Church Tradition": Developed in church history or tradition, not directly in Scripture.

Explicitness score guide (1–5):
1 = Cultural / Not in Bible at all
2 = Church tradition only
3 = Inferred from passages
4 = Concept clearly present
5 = Directly stated verbatim

Include 2–4 relevant Bible verses with accurate WEB text.
Include 3–5 timeline nodes (historical origin, development, modern usage).
Include 3–5 related topics.

Important: Be academically rigorous, non-denominational, and non-partisan. Report what the text says, not what any denomination prefers.`;

// ─────────────────────────────────────────────────────────────────────────────
// Robust JSON extractor — handles thinking models, markdown fences, stray text
// ─────────────────────────────────────────────────────────────────────────────
function extractJSON(raw: string): string {
  // 1. Strip thinking/reasoning blocks that some models prepend
  let text = raw.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();

  // 2. Strip markdown fences: ```json ... ``` or ``` ... ```
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // 3. Find the outermost { } to isolate just the JSON object
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new SyntaxError("No JSON object found in model response");
  }

  return text.slice(start, end + 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const statement: string = (body?.statement ?? "").trim();

    if (!statement) {
      return NextResponse.json(
        { error: "Please provide a statement or phrase to analyze." },
        { status: 400 }
      );
    }

    if (statement.length > 500) {
      return NextResponse.json(
        { error: "Query is too long. Please keep it under 500 characters." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // gemini-2.5-flash — current stable free-tier model (2.0-flash deprecated Feb 2026)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this for biblical accuracy: "${statement}"`;

    const geminiResult = await model.generateContent(prompt);
    const responseText = geminiResult.response.text();

    const cleaned = extractJSON(responseText);
    const parsed: BibleResult = JSON.parse(cleaned);

    // Validate required fields
    const required: (keyof BibleResult)[] = [
      "query", "classification", "explicitnessScore", "oneLiner",
      "verses", "timeline", "relatedTopics",
    ];
    for (const field of required) {
      if (parsed[field] === undefined) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    // Clamp score
    parsed.explicitnessScore = Math.max(1, Math.min(5, Math.round(parsed.explicitnessScore)));

    return NextResponse.json({ result: parsed });
  } catch (err: unknown) {
    console.error("[/api/analyze] Error:", err);

    const message =
      err instanceof SyntaxError
        ? "The AI returned an unexpected format. Please try again."
        : err instanceof Error
        ? err.message
        : "An unknown error occurred.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}