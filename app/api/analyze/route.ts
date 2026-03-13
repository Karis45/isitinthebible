import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Admin — initialise once across hot reloads
// ─────────────────────────────────────────────────────────────────────────────
function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Next.js env vars can't contain real newlines — replace escaped ones
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache helpers
// ─────────────────────────────────────────────────────────────────────────────

// Normalise a query to a stable Firestore document ID:
//   "The Rapture" → "the-rapture"
//   "God helps those who help themselves" → "god-helps-those-who-help-themselves"
function cacheKey(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")   // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "")        // strip leading/trailing hyphens
    .slice(0, 200);                  // Firestore doc ID limit
}

const CACHE_COLLECTION = "query_cache";
// Re-check cached results after 30 days so scholarship stays fresh
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function getCached(key: string): Promise<BibleResult | null> {
  try {
    const db  = getDb();
    const doc = await db.collection(CACHE_COLLECTION).doc(key).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    // Honour TTL
    const cachedAt: Timestamp = data.cachedAt;
    if (Date.now() - cachedAt.toMillis() > CACHE_TTL_MS) {
      // Stale — delete in the background, don't block the response
      doc.ref.delete().catch(() => {});
      return null;
    }

    return data.result as BibleResult;
  } catch (err) {
    // Never let a cache read failure block the real request
    console.warn("[cache] Read error:", err);
    return null;
  }
}

async function setCached(key: string, result: BibleResult): Promise<void> {
  try {
    const db = getDb();
    await db.collection(CACHE_COLLECTION).doc(key).set({
      result,
      cachedAt:    Timestamp.now(),
      queryRaw:    result.query,   // handy for browsing in Firebase console
      hitCount:    0,
    });
  } catch (err) {
    // Cache write failures are non-fatal
    console.warn("[cache] Write error:", err);
  }
}

// Increment hit counter in the background — useful for knowing which queries
// are most popular (feeds future "Trending" section if you want real data)
async function incrementHits(key: string): Promise<void> {
  try {
    const db = getDb();
    await db.collection(CACHE_COLLECTION).doc(key).update({
      hitCount: require("firebase-admin/firestore").FieldValue.increment(1),
      lastHitAt: Timestamp.now(),
    });
  } catch {
    // Silently ignore — this is just analytics
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Extract JSON utility (handles thinking blocks, markdown fences, stray text)
// ─────────────────────────────────────────────────────────────────────────────
function extractJSON(text: string): string {
  let cleaned = text.replace(/^```[\w]*\n?|\n?```$/g, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return cleaned;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiter — 10 requests per minute per IP
// ─────────────────────────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap.entries()) {
    if (now > entry.reset) rateMap.delete(key);
  }
}, 5 * 60_000);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Classification =
  | "Directly Stated"
  | "Concept Present"
  | "Inferred"
  | "Cultural"
  | "Church Tradition";

interface BibleResult {
  query:                string;
  classification:       Classification;
  explicitnessScore:    number;
  oneLiner:             string;
  originEra:            string;
  closestBiblicalTheme: string;
  searchPopularity:     string;
  theologicalConsensus: string;
  timeline:             { year: string; label: string; detail: string }[];
  verses:               { ref: string; text: string; context: string }[];
  misquoteWhat:         string;
  misquoteReality:      string;
  analysis:             string;
  confidenceNote:       string;
  relatedTopics:        { query: string; classification: Classification }[];
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
    const body      = await req.json();
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

    // ── Cache check ─────────────────────────────────────────────────────────
    const key    = cacheKey(statement);
    const cached = await getCached(key);

    if (cached) {
      // Fire-and-forget hit counter — don't await
      incrementHits(key);
      // Return with a header so you can verify caching is working in DevTools
      return NextResponse.json(
        { result: cached },
        { headers: { "X-Cache": "HIT" } }
      );
    }

    // ── Call Gemini ──────────────────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature:      0.4,
        topP:             0.95,
        maxOutputTokens:  4096,
        responseMimeType: "application/json",
      },
    });

    const prompt      = `${SYSTEM_PROMPT}\n\nAnalyze this for biblical accuracy: "${statement}"`;
    const geminiResult = await model.generateContent(prompt);
    const responseText = geminiResult.response.text();

    const parsed: BibleResult = JSON.parse(extractJSON(responseText));

    // Validate required fields
    const required: (keyof BibleResult)[] = [
      "query", "classification", "explicitnessScore", "oneLiner",
      "verses", "timeline", "relatedTopics",
    ];
    for (const field of required) {
      if (parsed[field] === undefined) throw new Error(`Missing field: ${field}`);
    }

    // Clamp score
    parsed.explicitnessScore = Math.max(1, Math.min(5, Math.round(parsed.explicitnessScore)));

    // ── Write to cache (non-blocking) ────────────────────────────────────────
    setCached(key, parsed).catch(() => {});

    return NextResponse.json(
      { result: parsed },
      { headers: { "X-Cache": "MISS" } }
    );

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