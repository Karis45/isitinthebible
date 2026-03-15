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

// ── EXPANDED TOPICS ───────────────────────────────────────────────────────────
// Organised by category so you can comment out sections if needed.
// All existing 40 topics are included — the script skips already-cached ones.

const TOPICS = [

  // ── CATEGORY 1: Famous misattributed sayings (very high search volume) ──────
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
  "The devil is in the details",
  "Everything happens for a reason",
  "Footprints in the sand",
  "Fear is the opposite of faith",
  "God is love",
  "Love the sinner hate the sin",
  "The truth shall set you free",
  "Judge not lest ye be judged",
  "An eye for an eye",
  "Do unto others as you would have them do unto you",
  "Blessed are the peacemakers",
  "Thou shalt not kill",
  "The lion shall lie down with the lamb",
  "Cleanliness is next to godliness",
  "When God closes a door he opens a window",
  "God won't give you more than you can bear",
  "The road to hell is paved with good intentions",
  "Moderation in all things",
  "To the victor go the spoils",
  "There but for the grace of God go I",
  "The writing is on the wall",
  "A leopard cannot change its spots",
  "Baptism by fire",
  "By the skin of your teeth",
  "Drop in the bucket",
  "Fall from grace",
  "The forbidden fruit",
  "Going the extra mile",
  "A good Samaritan",
  "The blind leading the blind",
  "Cast the first stone",
  "Scapegoat",
  "Two-edged sword",
  "Washing your hands of something",
  "Wolf in sheep's clothing",

  // ── CATEGORY 2: Theology and doctrine ────────────────────────────────────────
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
  "Satan was once an angel",
  "Heaven is a real place",
  "The eye of a needle",
  "Predestination",
  "Eternal security",
  "The Second Coming",
  "The Antichrist",
  "The Mark of the Beast",
  "666 the number of the beast",
  "The Four Horsemen of the Apocalypse",
  "Limbo",
  "Infant baptism",
  "Speaking in tongues",
  "The gifts of the Holy Spirit",
  "Tithing",
  "Sunday as the Sabbath",
  "Confession to a priest",
  "The Pope",
  "Celibacy for priests",
  "Indulgences",
  "The Immaculate Conception",
  "Mary as Queen of Heaven",
  "Praying to saints",
  "The Assumption of Mary",
  "Faith alone saves",
  "Works-based salvation",
  "Total depravity",
  "Unconditional election",
  "Limited atonement",
  "Irresistible grace",
  "The prosperity gospel",
  "Word of Faith movement",
  "Cessationism",
  "Complementarianism",
  "Egalitarianism in the church",

  // ── CATEGORY 3: Modern concepts people ask about ─────────────────────────────
  "Manifesting",
  "Karma",
  "Reincarnation",
  "Speaking things into existence",
  "Soulmates",
  "The law of attraction",
  "Astrology",
  "Horoscopes",
  "Meditation",
  "Yoga",
  "Halloween",
  "Christmas trees",
  "Easter eggs",
  "Tattoos",
  "Eating pork",
  "Drinking alcohol",
  "Divorce",
  "Remarriage after divorce",
  "Women in leadership",
  "Homosexuality",
  "Same-sex marriage",
  "Abortion",
  "Capital punishment",
  "Slavery",
  "Interracial marriage",
  "Gambling",
  "Masturbation",
  "Premarital sex",
  "Contraception",
  "Dinosaurs",
  "Aliens and extraterrestrial life",
  "Evolution",
  "The age of the earth",
  "Near death experiences",
  "Ghosts",
  "Demons",
  "Exorcism",
  "Witchcraft",
  "Tarot cards",
  "Ouija boards",
  "Dream interpretation",
  "Tithing ten percent",
  "Cremation",
  "Suicide",
  "Depression",
  "Anxiety",
  "Mental illness",

  // ── CATEGORY 4: Bible characters and stories people misremember ──────────────
  "Adam and Eve ate an apple",
  "Noah's ark held two of every animal",
  "Jonah was swallowed by a whale",
  "Three wise men visited Jesus",
  "The wise men brought gold frankincense and myrrh",
  "Mary Magdalene was a prostitute",
  "Lucifer is Satan",
  "The serpent in Eden was Satan",
  "Samson's strength came from his hair",
  "David and Goliath",
  "Solomon had 700 wives",
  "Moses parted the Red Sea",
  "Jesus was born on December 25",
  "Jesus had long hair",
  "Jesus was an only child",
  "The Last Supper was on a Thursday",
  "Judas Iscariot betrayed Jesus for thirty pieces of silver",
  "Peter denied Jesus three times",
  "Thomas doubted the resurrection",
  "Paul never met Jesus",
  "John the Baptist was related to Jesus",
  "Methuselah was the oldest person in the Bible",

  // ── CATEGORY 5: Moral and ethical questions people Google ────────────────────
  "Is it a sin to be rich",
  "Is it a sin to be poor",
  "Is it a sin to eat meat",
  "Is it a sin to work on Sunday",
  "Is it a sin to celebrate birthdays",
  "Is it a sin to watch horror movies",
  "Is it a sin to swear",
  "Is it a sin to lie",
  "Is it a sin to be angry",
  "Is it a sin to be depressed",
  "Does God forgive all sins",
  "Is there an unforgivable sin",
  "Does God punish sin",
  "Can Christians drink alcohol",
  "Can Christians celebrate Halloween",
  "Can Christians practice yoga",
  "Can Christians read Harry Potter",
  "Do Christians have to tithe",
  "Do Christians have to go to church",
  "Do Christians have to be baptised to be saved",

  // ── CATEGORY 6: Afterlife and end times ──────────────────────────────────────
  "What happens when you die",
  "Do pets go to heaven",
  "Do babies go to heaven",
  "Do all religions go to heaven",
  "Can you lose your salvation",
  "Is hell eternal",
  "Is hell a real place",
  "Is heaven a physical place",
  "Will we recognise each other in heaven",
  "Will we have bodies in heaven",
  "Is there a second chance after death",
  "What is the Great Tribulation",
  "What is the Millennium",
  "What is Armageddon",
  "What is the Lake of Fire",
  "What is the New Jerusalem",
  "What is the Day of Judgement",
  "The Book of Life",
  "The resurrection of the dead",
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

  // Deduplicate topics in case of any accidental repeats
  const uniqueTopics = [...new Set(TOPICS)];

  console.log(`\n🚀 Seeding ${uniqueTopics.length} topics into Firebase...`);
  console.log(`   (Already-cached topics will be skipped automatically)\n`);

  let seeded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < uniqueTopics.length; i++) {
    const topic = uniqueTopics[i];
    const key = cacheKey(topic);

    process.stdout.write(`[${i + 1}/${uniqueTopics.length}] "${topic}"... `);

    // Skip if already cached
    try {
      const existing = await db.collection("query_cache").doc(key).get();
      if (existing.exists) {
        console.log("⏭️  already cached");
        skipped++;
        continue;
      }
    } catch (e) {
      console.log(`⚠️  Firebase read error: ${e.message}`);
    }

    // Call Gemini
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

      // Respectful delay to avoid Gemini rate limits
      // ~600ms = ~100 topics/minute, well within free tier limits
      await sleep(600);

    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
      failed++;
      await sleep(1500); // longer pause after failures
    }
  }

  const totalMinutes = Math.ceil((uniqueTopics.length * 0.6) / 60);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seeded:  ${seeded} new topics
⏭️  Skipped: ${skipped} (already cached)
❌ Failed:  ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What this means:
  → ${seeded} new pages ready to be indexed by Google
  → ${skipped + seeded} total topics now in your Firebase cache

Next steps:
  1. git add . && git commit -m "chore: expand seed topics to ${uniqueTopics.length}" && git push
  2. Vercel rebuilds and all topics become crawlable pages
  3. Go to Google Search Console → Sitemaps → resubmit your sitemap
  4. Request indexing for your highest-value pages manually in Search Console
`);

  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});