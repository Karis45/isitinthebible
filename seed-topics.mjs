import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local ───────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envPath = resolve(__dirname, ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = val;
  }
  console.log("✅ Loaded .env.local");
} catch {
  console.log("⚠️  No .env.local found — using existing env vars");
}

// ── Firebase ──────────────────────────────────────────────────────────────────
function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

function cacheKey(query) {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// ── Topics to seed ────────────────────────────────────────────────────────────
const TOPICS = [
  "God helps those who help themselves",
  "This too shall pass",
  "The Lord works in mysterious ways",
  "Cleanliness is next to godliness",
  "Money is the root of all evil",
  "Spare the rod spoil the child",
  "Pride comes before a fall",
  "To thine own self be true",
  "Hate the sin love the sinner",
  "God will not give you more than you can handle",
  "The Rapture",
  "Purgatory",
  "Guardian Angels",
  "The Trinity",
  "Original Sin",
  "Hell",
  "Free Will",
  "Soul Sleep",
  "Prosperity Gospel",
  "Once saved always saved",
  "Manifesting",
  "Karma",
  "Reincarnation",
  "Speaking things into existence",
  "Soulmates",
  "Everything happens for a reason",
  "Heaven is a real place",
  "Satan was once an angel",
  "The eye of a needle",
  "Footprints in the sand",
  "An eye for an eye",
  "Blessed are the peacemakers",
  "Do unto others as you would have them do unto you",
  "Thou shalt not kill",
  "Judge not lest ye be judged",
  "The truth shall set you free",
  "Love the sinner hate the sin",
  "God is love",
  "Fear is the opposite of faith",
  "The devil is in the details",
];

// ── Gemini prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a biblical scholar and AI fact-checker for a website called "Is it in the Bible?".

Your job is to analyze whether phrases, beliefs, doctrines, or concepts appear in the Bible (specifically the World English Bible, a public-domain translation).

Respond ONLY with a valid JSON object — no markdown fences, no preamble, no trailing text.

Use this exact JSON structure:
{
  "query": "<the user's exact query>",
  "classification": "<one of: Directly Stated | Concept Present | Inferred | Cultural | Church Tradition>",
  "explicitnessScore": <integer 1-5>,
  "oneLiner": "<one crisp sentence summarizing the verdict>",
  "originEra": "<e.g. 1st Century AD, Ancient Greece, 18th Century>",
  "closestBiblicalTheme": "<brief theme label>",
  "searchPopularity": "<one of: Very High | High | Moderate | Low>",
  "theologicalConsensus": "<e.g. Broadly Accepted, Debated, Minority View, Rejected by most scholars>",
  "timeline": [
    { "year": "<era or year>", "label": "<short event label>", "detail": "<1-2 sentences>" }
  ],
  "verses": [
    { "ref": "<Book Chapter:Verse>", "text": "<accurate WEB verse text>", "context": "<1-2 sentence explanation>" }
  ],
  "misquoteWhat": "<the common misunderstanding or popular phrase people attribute to the Bible>",
  "misquoteReality": "<what Scripture actually says, if anything>",
  "analysis": "<2-3 short paragraphs of nuanced scholarly analysis>",
  "confidenceNote": "<single sentence on scholarly confidence>",
  "relatedTopics": [
    { "query": "<related topic>", "classification": "<classification>" }
  ]
}

Classification: Directly Stated | Concept Present | Inferred | Cultural | Church Tradition
Score: 1=Cultural, 2=Church Tradition, 3=Inferred, 4=Concept Present, 5=Directly Stated
Include 2-4 verses, 3-5 timeline nodes, 3-5 related topics.
Be academically rigorous, non-denominational, non-partisan.`;

function extractJSON(text) {
  const cleaned = text.replace(/^```[\w]*\n?|\n?```$/g, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const db = getDb();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  console.log(`\n🚀 Seeding ${TOPICS.length} topics into Firebase...\n`);

  let seeded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    const key = cacheKey(topic);

    process.stdout.write(`[${i + 1}/${TOPICS.length}] "${topic}"... `);

    try {
      const existing = await db.collection("query_cache").doc(key).get();
      if (existing.exists) {
        console.log("⏭️  already cached, skipping");
        skipped++;
        continue;
      }
    } catch (e) {
      console.log(`⚠️  Firebase read error: ${e.message}`);
    }

    try {
      const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this for biblical accuracy: "${topic}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(extractJSON(text));

      const required = ["query", "classification", "explicitnessScore", "oneLiner", "verses", "timeline", "relatedTopics"];
      for (const field of required) {
        if (parsed[field] === undefined) throw new Error(`Missing field: ${field}`);
      }
      parsed.explicitnessScore = Math.max(1, Math.min(5, Math.round(parsed.explicitnessScore)));

      await db.collection("query_cache").doc(key).set({
        result:   parsed,
        cachedAt: Timestamp.now(),
        queryRaw: topic,
        hitCount: 0,
        seeded:   true,
      });

      console.log(`✅ ${parsed.classification} (score: ${parsed.explicitnessScore})`);
      seeded++;
      await sleep(600);

    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
      failed++;
      await sleep(1000);
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seeded:  ${seeded}
⏭️  Skipped: ${skipped} (already in cache)
❌ Failed:  ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
  1. git add . && git commit -m "chore: seed topic pages" && git push
  2. Vercel rebuilds — all topics become static pages
  3. Submit sitemap at Google Search Console
`);

  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});