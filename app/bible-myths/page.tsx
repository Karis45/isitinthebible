"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Classification =
  | "Directly Stated"
  | "Concept Present"
  | "Inferred"
  | "Cultural"
  | "Church Tradition";

type Category =
  | "All"
  | "Famous Sayings"
  | "Doctrines"
  | "Concepts"
  | "Misquotes";

interface Myth {
  id: string;
  claim: string;
  verdict: Classification;
  shortAnswer: string;
  realOrigin: string;
  closestVerse?: string;
  closestVerseRef?: string;
  category: Exclude<Category, "All">;
  shock: "high" | "medium"; // how surprising it is
}

// ─── Design tokens (matches your existing site) ───────────────────────────────
const T = {
  parchment: "#F5F1E8",
  parchmentDark: "#EDE8DA",
  white: "#FFFFFF",
  ink: "#1A1612",
  inkMid: "#4A3F35",
  inkLt: "#8A7D72",
  inkFt: "#D8D0C4",
  blue: "#1A3A6A",
  blueMid: "#2A5298",
  blueLt: "#EEF2FA",
  green: "#1A5C38",
  greenLt: "#EBF5EF",
  red: "#7A1A1A",
  redLt: "#FEF0F0",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
  shadowSm: "0 1px 3px rgba(26,22,18,.05), 0 4px 12px rgba(26,22,18,.04)",
  shadowMd: "0 4px 16px rgba(26,22,18,.08), 0 12px 40px rgba(26,22,18,.06)",
};

const BADGE_CONFIG: Record<Classification, { bg: string; text: string; border: string; dot: string; label: string; icon: string }> = {
  "Directly Stated":  { bg: "#EBF5EF", text: "#1A5C38", border: "#A8D4B8", dot: "#1A5C38", label: "Directly Stated",  icon: "📖" },
  "Concept Present":  { bg: "#F5ECD2", text: "#7A5A00", border: "#D4B870", dot: "#B8860B", label: "Concept Present",  icon: "💡" },
  "Inferred":         { bg: "#FEF0E6", text: "#8A3A00", border: "#E8C4A0", dot: "#8A3A00", label: "Inferred",         icon: "🔍" },
  "Cultural":         { bg: "#FEF0F0", text: "#7A1A1A", border: "#E8BEBE", dot: "#7A1A1A", label: "Not in the Bible", icon: "❌" },
  "Church Tradition": { bg: "#F3EEF8", text: "#4A1A7A", border: "#C8A8E8", dot: "#4A1A7A", label: "Church Tradition", icon: "⛪" },
};

// ─── The myths data ───────────────────────────────────────────────────────────
const MYTHS: Myth[] = [
  {
    id: "god-helps-those",
    claim: "God helps those who help themselves",
    verdict: "Cultural",
    shortAnswer: "Not in the Bible. Benjamin Franklin wrote this in Poor Richard's Almanack (1736). It actually contradicts Scripture's core theme of dependence on God.",
    realOrigin: "Benjamin Franklin, Poor Richard's Almanack, 1736",
    closestVerse: "Trust in Yahweh with all your heart, and don't lean on your own understanding.",
    closestVerseRef: "Proverbs 3:5",
    category: "Famous Sayings",
    shock: "high",
  },
  {
    id: "this-too-shall-pass",
    claim: "This too shall pass",
    verdict: "Cultural",
    shortAnswer: "Never written in any Bible. Often attributed to King Solomon or the Psalms — it originates with 13th-century Persian Sufi poets.",
    realOrigin: "Persian Sufi poets, c. 1200s. Later popularised in English by Edward FitzGerald (1852).",
    category: "Famous Sayings",
    shock: "high",
  },
  {
    id: "cleanliness-godliness",
    claim: "Cleanliness is next to godliness",
    verdict: "Cultural",
    shortAnswer: "Not in Scripture. The phrase was coined by John Wesley in a 1778 sermon — though he himself noted he couldn't find it in the Bible.",
    realOrigin: "John Wesley, sermon 'On Dress', 1778.",
    category: "Famous Sayings",
    shock: "medium",
  },
  {
    id: "lord-works-mysterious-ways",
    claim: "The Lord works in mysterious ways",
    verdict: "Cultural",
    shortAnswer: "Not a Bible verse. It comes from an 18th-century hymn by the poet William Cowper — yet it's among the most confidently cited 'Scripture.'",
    realOrigin: "William Cowper, hymn 'God Moves in a Mysterious Way', 1773.",
    closestVerse: "For my thoughts are not your thoughts, and your ways are not my ways.",
    closestVerseRef: "Isaiah 55:8",
    category: "Famous Sayings",
    shock: "high",
  },
  {
    id: "money-root-of-evil",
    claim: "Money is the root of all evil",
    verdict: "Cultural",
    shortAnswer: "This is a misquote. The Bible says 'the love of money' — a meaningful distinction. Wealth itself is not condemned; the obsession with it is.",
    realOrigin: "Misquotation of 1 Timothy 6:10, which specifies 'the love of money.'",
    closestVerse: "For the love of money is a root of all kinds of evil.",
    closestVerseRef: "1 Timothy 6:10",
    category: "Misquotes",
    shock: "medium",
  },
  {
    id: "hate-sin-love-sinner",
    claim: "Hate the sin, love the sinner",
    verdict: "Cultural",
    shortAnswer: "Not found in the Bible. The phrase is most commonly attributed to Mahatma Gandhi, who used a version of it in his 1927 autobiography.",
    realOrigin: "Attributed to Mahatma Gandhi, 'An Autobiography', 1927.",
    closestVerse: "Yahweh is merciful and gracious, slow to anger, and abundant in loving kindness.",
    closestVerseRef: "Psalm 103:8",
    category: "Famous Sayings",
    shock: "high",
  },
  {
    id: "god-wont-give-more",
    claim: "God won't give you more than you can handle",
    verdict: "Cultural",
    shortAnswer: "A popular misreading of 1 Corinthians 10:13. That verse is specifically about temptation, not hardship — and is about God's provision, not a cap on suffering.",
    realOrigin: "Misapplication of 1 Corinthians 10:13, which addresses temptation specifically.",
    closestVerse: "No temptation has taken you except what is common to man.",
    closestVerseRef: "1 Corinthians 10:13",
    category: "Misquotes",
    shock: "high",
  },
  {
    id: "footprints-in-sand",
    claim: "Footprints in the Sand",
    verdict: "Cultural",
    shortAnswer: "The famous 'Footprints in the Sand' poem does not appear anywhere in the Bible. It was written in the 20th century and is frequently mistaken for Scripture.",
    realOrigin: "Poem attributed to multiple authors including Mary Stevenson and Carolyn Carty, c. 1936–1964.",
    category: "Famous Sayings",
    shock: "medium",
  },
  {
    id: "spare-rod-spoil-child",
    claim: "Spare the rod, spoil the child",
    verdict: "Inferred",
    shortAnswer: "This exact phrasing isn't in the Bible — it's a paraphrase of Proverbs 13:24. The original Hebrew is more nuanced than the popular version suggests.",
    realOrigin: "Loose paraphrase of Proverbs 13:24. The exact phrasing was popularised by Samuel Butler's poem 'Hudibras' (1663).",
    closestVerse: "He who spares the rod hates his son, but he who loves him is careful to discipline him.",
    closestVerseRef: "Proverbs 13:24",
    category: "Misquotes",
    shock: "medium",
  },
  {
    id: "lion-lie-lamb",
    claim: "The lion shall lie down with the lamb",
    verdict: "Cultural",
    shortAnswer: "The Bible says 'wolf' not 'lion.' Isaiah 11:6 reads 'the wolf will live with the lamb.' The lion version has no biblical source.",
    realOrigin: "Misremembering of Isaiah 11:6, which pairs the wolf with the lamb, not a lion.",
    closestVerse: "The wolf will live with the lamb, and the leopard will lie down with the young goat.",
    closestVerseRef: "Isaiah 11:6",
    category: "Misquotes",
    shock: "high",
  },
  {
    id: "everything-happens-reason",
    claim: "Everything happens for a reason",
    verdict: "Cultural",
    shortAnswer: "Not in the Bible. While Scripture affirms God's sovereignty (Romans 8:28), the popular phrase 'everything happens for a reason' as commonly used is not a biblical teaching.",
    realOrigin: "A modern folk saying. Sometimes confused with Romans 8:28, which has a different and more specific meaning.",
    closestVerse: "We know that all things work together for good for those who love God.",
    closestVerseRef: "Romans 8:28",
    category: "Famous Sayings",
    shock: "medium",
  },
  {
    id: "to-thine-own-self",
    claim: "To thine own self be true",
    verdict: "Cultural",
    shortAnswer: "Shakespeare, not Scripture. This line is spoken by the character Polonius in Hamlet (1603). It has no biblical source whatsoever.",
    realOrigin: "William Shakespeare, Hamlet, Act 1 Scene 3 (c. 1600–1601).",
    category: "Famous Sayings",
    shock: "high",
  },
  {
    id: "judge-not",
    claim: "Judge not lest ye be judged",
    verdict: "Directly Stated",
    shortAnswer: "This one IS in the Bible — Matthew 7:1. However, it is frequently misquoted and misapplied. The full passage teaches against hypocrisy, not all forms of moral discernment.",
    realOrigin: "Matthew 7:1 — correctly attributed, but widely misunderstood in context.",
    closestVerse: "Don't judge, so that you won't be judged.",
    closestVerseRef: "Matthew 7:1",
    category: "Misquotes",
    shock: "medium",
  },
  {
    id: "rapture",
    claim: "The Rapture",
    verdict: "Church Tradition",
    shortAnswer: "The word 'rapture' never appears in the Bible. The concept is derived from 1 Thessalonians 4:17 and is a theological framework developed primarily in the 19th century.",
    realOrigin: "Theological doctrine developed by John Nelson Darby, c. 1830s, from a reading of 1 Thessalonians 4:17.",
    closestVerse: "Then we who are alive, who are left, will be caught up together with them in the clouds.",
    closestVerseRef: "1 Thessalonians 4:17",
    category: "Doctrines",
    shock: "high",
  },
  {
    id: "purgatory",
    claim: "Purgatory",
    verdict: "Church Tradition",
    shortAnswer: "The word 'purgatory' is not in the Bible. The doctrine was formally defined by the Catholic Church at the Council of Trent (1545–1563) and is not held by most Protestants.",
    realOrigin: "Developed in Catholic theology. Referenced in the Catechism. Not directly stated in canonical Scripture.",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "trinity",
    claim: "The Trinity",
    verdict: "Inferred",
    shortAnswer: "The word 'Trinity' never appears in the Bible. The doctrine is inferred from passages like Matthew 28:19 and developed by church councils — most notably Nicaea in AD 325.",
    realOrigin: "Theological term coined by Tertullian, c. 200 AD. Formally defined at the Council of Nicaea, 325 AD.",
    closestVerse: "Baptizing them in the name of the Father, the Son, and the Holy Spirit.",
    closestVerseRef: "Matthew 28:19",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "guardian-angels",
    claim: "Guardian Angels (one per person)",
    verdict: "Concept Present",
    shortAnswer: "The concept of angels protecting people IS in Scripture, but the idea of a single personal guardian angel assigned to each individual is not explicitly stated — it's a doctrinal development.",
    realOrigin: "Based on Matthew 18:10 and Psalm 91:11. The specific 'one guardian per person' framework developed in church tradition.",
    closestVerse: "See that you don't despise one of these little ones, for I tell you that in heaven their angels always see the face of my Father.",
    closestVerseRef: "Matthew 18:10",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "satan-fallen-angel",
    claim: "Satan was once a beautiful angel named Lucifer",
    verdict: "Inferred",
    shortAnswer: "The popular narrative — Lucifer as a glorious angel who fell — is an inference, primarily from Isaiah 14 and Ezekiel 28. Those passages were originally addressed to human kings, not Satan directly.",
    realOrigin: "Inference from Isaiah 14:12 and Ezekiel 28:12–17. The identification with Satan developed through early church interpretation.",
    closestVerse: "How you have fallen from heaven, morning star, son of the dawn!",
    closestVerseRef: "Isaiah 14:12",
    category: "Doctrines",
    shock: "high",
  },
  {
    id: "heaven-pearly-gates",
    claim: "Heaven has pearly gates and streets of gold",
    verdict: "Directly Stated",
    shortAnswer: "Actually yes — but only in the Book of Revelation, describing the New Jerusalem specifically, not heaven in general. The popular image oversimplifies a complex apocalyptic vision.",
    realOrigin: "Revelation 21:21 — correctly in the Bible, but often stripped of its apocalyptic literary context.",
    closestVerse: "The twelve gates were twelve pearls. Each one of the gates was made of one pearl.",
    closestVerseRef: "Revelation 21:21",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "original-sin",
    claim: "Original Sin",
    verdict: "Inferred",
    shortAnswer: "The phrase 'original sin' is not in the Bible. The theological concept is inferred from Romans 5:12 and Genesis 3, and was formulated by Augustine of Hippo in the 4th century.",
    realOrigin: "Theological doctrine articulated by Augustine of Hippo, c. 397 AD, from Genesis 3 and Romans 5.",
    closestVerse: "Therefore, as sin entered into the world through one man, and death through sin…",
    closestVerseRef: "Romans 5:12",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "manifesting",
    claim: "Manifesting / Speaking things into existence",
    verdict: "Cultural",
    shortAnswer: "The modern 'manifestation' framework — that humans can speak desires into reality — is not a biblical teaching. Confusing it with faith teaching distorts what passages like Mark 11:24 actually say.",
    realOrigin: "Rooted in New Thought philosophy of the 19th century. Popularised in modern culture by 'The Secret' (2006).",
    closestVerse: "Therefore I tell you, all things whatever you pray and ask for, believe that you have received them…",
    closestVerseRef: "Mark 11:24",
    category: "Concepts",
    shock: "medium",
  },
  {
    id: "karma",
    claim: "Karma",
    verdict: "Cultural",
    shortAnswer: "Karma is a Hindu and Buddhist concept — it does not appear in the Bible. Scripture teaches forgiveness and grace, which explicitly break the cause-and-effect logic of karma.",
    realOrigin: "Sanskrit: karma. Core concept in Hinduism, Buddhism, and Jainism. No biblical equivalent.",
    closestVerse: "Don't be deceived. God is not mocked, for whatever a man sows, that will he also reap.",
    closestVerseRef: "Galatians 6:7",
    category: "Concepts",
    shock: "medium",
  },
  {
    id: "soulmates",
    claim: "Soulmates",
    verdict: "Cultural",
    shortAnswer: "The idea of a divinely preordained romantic soulmate is not a biblical concept. Scripture values covenant love and commitment, but does not teach that one perfect person exists for each individual.",
    realOrigin: "Ancient Greek philosophy (Plato's Symposium). Not present in Hebrew or Christian Scripture.",
    category: "Concepts",
    shock: "medium",
  },
  {
    id: "reincarnation",
    claim: "Reincarnation",
    verdict: "Cultural",
    shortAnswer: "Reincarnation is explicitly contradicted in Hebrews 9:27 ('it is appointed for men to die once'). It is a concept from Eastern religions with no biblical foundation.",
    realOrigin: "Hindu and Buddhist philosophy. Explicitly contradicted by Hebrews 9:27.",
    closestVerse: "It is appointed for men to die once, and after this, judgment.",
    closestVerseRef: "Hebrews 9:27",
    category: "Concepts",
    shock: "high",
  },
  {
    id: "prosperity-gospel",
    claim: "God wants you to be wealthy and healthy",
    verdict: "Inferred",
    shortAnswer: "The Prosperity Gospel as a system misreads isolated passages. Scripture contains both promises of blessing and teachings that suffering is expected and even purposeful for believers.",
    realOrigin: "Prosperity Gospel movement, mid-20th century USA. Often associated with preachers like Kenneth Hagin.",
    closestVerse: "In the world you have oppression; but cheer up! I have overcome the world.",
    closestVerseRef: "John 16:33",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "once-saved-always-saved",
    claim: "Once saved, always saved",
    verdict: "Inferred",
    shortAnswer: "This doctrine (eternal security) is held by many Calvinists but genuinely debated across denominations. The Bible contains passages supporting both security (John 10:28) and warning (Hebrews 6:4–6).",
    realOrigin: "Calvinist doctrine of the Perseverance of the Saints. Formally articulated at the Synod of Dort (1618–1619).",
    closestVerse: "I give eternal life to them. They will never perish, and no one will snatch them out of my hand.",
    closestVerseRef: "John 10:28",
    category: "Doctrines",
    shock: "medium",
  },
  {
    id: "eye-of-needle",
    claim: "It is easier for a camel to go through the eye of a needle",
    verdict: "Directly Stated",
    shortAnswer: "Yes — Jesus said this in Matthew 19:24. However, a popular myth claims 'the eye of a needle' was a small Jerusalem gate. No historical evidence supports that claim; Jesus likely meant it literally.",
    realOrigin: "Matthew 19:24 — correctly in the Bible. The 'narrow gate' interpretation is a later rationalisation with no archaeological basis.",
    closestVerse: "It is easier for a camel to go through a needle's eye than for a rich man to enter into God's Kingdom.",
    closestVerseRef: "Matthew 19:24",
    category: "Misquotes",
    shock: "medium",
  },
  {
    id: "god-is-love",
    claim: "God is love",
    verdict: "Directly Stated",
    shortAnswer: "This one is genuinely in the Bible — 1 John 4:8 and 4:16. It is one of the most accurate and frequently cited biblical statements.",
    realOrigin: "1 John 4:8 — accurately attributed.",
    closestVerse: "He who doesn't love doesn't know God, for God is love.",
    closestVerseRef: "1 John 4:8",
    category: "Famous Sayings",
    shock: "medium",
  },
  {
    id: "devil-in-details",
    claim: "The devil is in the details",
    verdict: "Cultural",
    shortAnswer: "Not in the Bible. The saying is a secular idiom — possibly a corruption of 'God is in the detail,' attributed to various European thinkers of the 19th century.",
    realOrigin: "Secular proverb. Likely a reversal of 'Le bon Dieu est dans le détail' (God is in the detail), attributed to Gustave Flaubert or Aby Warburg.",
    category: "Famous Sayings",
    shock: "medium",
  },
  {
    id: "free-will",
    claim: "Free Will",
    verdict: "Inferred",
    shortAnswer: "The phrase 'free will' does not appear in the Bible. The concept is deeply debated theologically — Scripture affirms human choice but also divine sovereignty, creating one of Christianity's longest-running tensions.",
    realOrigin: "Philosophical concept debated since the early church. Origen (c. 184 AD) was among the first to articulate it theologically. Contested by Augustine, Aquinas, Luther, Calvin, and Arminius.",
    category: "Concepts",
    shock: "medium",
  },
];

const CATEGORIES: Category[] = ["All", "Famous Sayings", "Doctrines", "Concepts", "Misquotes"];

function queryToSlug(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, background: T.blue, borderRadius: Math.round(size * 0.25), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(26,58,106,.28)" }}>
      <svg width={size - 8} height={size - 8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        <circle cx="17.5" cy="17.5" r="4.5" fill="#1A3A6A" stroke="white" strokeWidth="1.5" />
        <path d="m15.5 17.5 1.5 1.5 3-3" stroke="white" strokeWidth="1.6" fill="none" />
      </svg>
    </div>
  );
}

function ClassChip({ classification, small }: { classification: Classification; small?: boolean }) {
  const b = BADGE_CONFIG[classification];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: small ? 4 : 5,
      padding: small ? "3px 8px" : "4px 10px",
      borderRadius: 100, background: b.bg, color: b.text,
      border: `1px solid ${b.border}`,
      fontFamily: T.mono, fontSize: small ? 9 : 10, fontWeight: 600,
      letterSpacing: ".05em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%", background: b.dot, display: "inline-block", flexShrink: 0 }} />
      {b.label}
    </span>
  );
}

function MythCard({ myth, index, onCheck }: { myth: Myth; index: number; onCheck: (query: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const b = BADGE_CONFIG[myth.verdict];
  const isPositive = myth.verdict === "Directly Stated" || myth.verdict === "Concept Present";

  return (
    <article
      style={{
        background: T.white,
        borderRadius: 16,
        border: `1px solid ${T.inkFt}`,
        overflow: "hidden",
        boxShadow: T.shadowSm,
        transition: "box-shadow .18s, transform .18s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = T.shadowMd;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = T.shadowSm;
        (e.currentTarget as HTMLElement).style.transform = "none";
      }}
    >
      {/* Card header */}
      <div style={{
        padding: "18px 20px 14px",
        borderLeft: `4px solid ${b.dot}`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: T.mono, fontSize: 9.5, fontWeight: 600,
              color: T.inkLt, letterSpacing: ".08em",
              background: T.parchment, padding: "2px 7px", borderRadius: 4,
            }}>#{index + 1}</span>
            <ClassChip classification={myth.verdict} small />
            {myth.shock === "high" && (
              <span style={{
                fontFamily: T.mono, fontSize: 9, fontWeight: 600,
                color: "#8A3A00", letterSpacing: ".06em",
                background: "#FEF0E6", border: "1px solid #E8C4A0",
                padding: "2px 7px", borderRadius: 4,
              }}>😲 Surprising</span>
            )}
          </div>
          <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkLt, flexShrink: 0, letterSpacing: ".06em", textTransform: "uppercase" }}>{myth.category}</span>
        </div>

        <h2 style={{
          fontFamily: T.serif, fontSize: "clamp(17px, 2.5vw, 20px)",
          fontWeight: 500, color: T.ink, lineHeight: 1.3,
          margin: 0, letterSpacing: "-.2px",
        }}>
          {myth.verdict === "Directly Stated"
            ? <span style={{ color: T.green }}>✓</span>
            : myth.verdict === "Cultural"
            ? <span style={{ color: T.red }}>✗</span>
            : <span style={{ color: "#8A3A00" }}>~</span>
          }{" "}
          <em style={{ fontStyle: "italic" }}>&ldquo;{myth.claim}&rdquo;</em>
        </h2>
      </div>

      {/* Short answer always visible */}
      <div style={{ padding: "0 20px 14px" }}>
        <p style={{
          fontFamily: T.sans, fontSize: 13.5, color: T.inkMid,
          lineHeight: 1.7, margin: 0,
        }}>
          {myth.shortAnswer}
        </p>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: T.parchment, border: `1px solid ${T.inkFt}`,
            marginBottom: myth.closestVerse ? 10 : 0,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.inkLt, marginBottom: 4 }}>
              Real Origin
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 13, color: T.inkMid, lineHeight: 1.6, margin: 0 }}>
              {myth.realOrigin}
            </p>
          </div>

          {myth.closestVerse && (
            <div style={{
              padding: "12px 14px", borderRadius: 10,
              background: isPositive ? T.greenLt : T.blueLt,
              border: `1px solid ${isPositive ? "#A8D4B8" : "#C0D4F0"}`,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: isPositive ? T.green : T.blue, marginBottom: 4 }}>
                {isPositive ? "✓ The Verse" : "Closest Verse"}
              </div>
              <p style={{ fontFamily: T.serif, fontSize: 14, fontStyle: "italic", color: T.ink, lineHeight: 1.6, margin: "0 0 4px" }}>
                &ldquo;{myth.closestVerse}&rdquo;
              </p>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.blue, fontWeight: 600 }}>
                — {myth.closestVerseRef}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div style={{
        padding: "10px 20px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 10, flexWrap: "wrap",
        borderTop: `1px solid ${T.inkFt}`,
        background: T.parchment,
      }}>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            padding: "6px 12px", borderRadius: 8,
            border: `1px solid ${T.inkFt}`,
            background: T.white, color: T.inkMid,
            fontFamily: T.sans, fontSize: 12, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            transition: "border-color .15s, color .15s",
          }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = T.blue; el.style.color = T.blue; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = T.inkFt; el.style.color = T.inkMid; }}
        >
          {expanded ? "▲ Less" : "▼ Show origin"}
        </button>

        <button
          onClick={() => onCheck(myth.claim)}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: "none", background: T.blue, color: "white",
            fontFamily: T.sans, fontSize: 12, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            transition: "background .15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
        >
          Full Analysis
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </article>
  );
}

// ─── Main page export ─────────────────────────────────────────────────────────
export default function BibleMythsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // Navigate to homepage with query — works with your existing HomeClient routing
  const handleCheck = (query: string) => {
    const slug = queryToSlug(query);
    window.location.href = `/topic/${slug}`;
  };

  const filtered = activeCategory === "All"
    ? MYTHS
    : MYTHS.filter((m) => m.category === activeCategory);

  const counts = {
    Cultural: MYTHS.filter((m) => m.verdict === "Cultural").length,
    Misquoted: MYTHS.filter((m) => m.verdict === "Inferred" || m.verdict === "Concept Present").length,
    Accurate: MYTHS.filter((m) => m.verdict === "Directly Stated").length,
  };

  return (
    <div style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>
      <style>{`
        @media (max-width: 640px) {
          .myths-grid { grid-template-columns: 1fr !important; }
          .myths-hero-stats { flex-direction: column !important; gap: 12px !important; }
          .cat-scroll { overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
          .cat-scroll::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* ── Minimal nav ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(245,241,232,.95)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${T.inkFt}`,
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }} aria-label="Is it in the Bible? — Home">
          <LogoMark size={32} />
          <span style={{ fontFamily: T.serif, fontSize: 17, fontWeight: 600, color: T.ink }}>
            Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
          </span>
        </a>
        <a
          href="/"
          style={{
            padding: "7px 16px", background: T.blue, color: "white",
            fontFamily: T.sans, fontSize: 13, fontWeight: 600,
            borderRadius: 10, textDecoration: "none",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
        >
          Search →
        </a>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`,
        padding: "64px 24px 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255,255,255,.04) 0%, transparent 60%)", pointerEvents: "none" }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 100,
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            marginBottom: 20,
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>
              {MYTHS.length} Common Myths · Verified
            </span>
          </div>

          <h1 style={{
            fontFamily: T.serif,
            fontSize: "clamp(38px, 7vw, 80px)",
            fontWeight: 300, color: "white",
            lineHeight: 1.05, letterSpacing: "-2px",
            marginBottom: 16,
          }}>
            Things People Think<br />Are in the <em style={{ fontStyle: "italic" }}>Bible</em>
          </h1>

          <p style={{
            color: "rgba(255,255,255,.7)", fontSize: 16,
            maxWidth: 520, margin: "0 auto 40px",
            lineHeight: 1.8, fontWeight: 300,
          }}>
            From Shakespeare misattributed as Scripture, to doctrines invented centuries after the Bible was written — a definitive guide to what's actually there.
          </p>

          {/* Stats row */}
          <div className="myths-hero-stats" style={{
            display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap",
          }}>
            {[
              { num: counts.Cultural, label: "Not in the Bible", color: "#F4A0A0" },
              { num: counts.Misquoted, label: "Debated / Inferred", color: "#F4D080" },
              { num: counts.Accurate, label: "Actually in Scripture", color: "#7ED4A8" },
            ].map((s) => (
              <div key={s.label} style={{
                padding: "14px 24px", borderRadius: 14,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.15)",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: s.color, lineHeight: 1, letterSpacing: "-1px" }}>{s.num}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category filter ── */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.inkFt}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="cat-scroll" style={{ display: "flex", gap: 2, padding: "10px 0" }}>
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? MYTHS.length : MYTHS.filter((m) => m.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 14px", border: "none",
                    borderRadius: "8px 8px 0 0",
                    cursor: "pointer", fontFamily: T.sans,
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    background: isActive ? T.blue : "transparent",
                    color: isActive ? "white" : T.inkMid,
                    transition: "all .15s", whiteSpace: "nowrap",
                    marginBottom: -1,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {cat}
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, fontWeight: 600,
                    background: isActive ? "rgba(255,255,255,.2)" : T.parchment,
                    color: isActive ? "white" : T.inkLt,
                    padding: "1px 5px", borderRadius: 4,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 64px" }}>
        {/* Share prompt */}
        <div style={{
          padding: "14px 18px", borderRadius: 12, marginBottom: 28,
          background: T.blueLt, border: `1px solid #C0D4F0`,
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 18 }} aria-hidden="true">💡</span>
          <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.inkMid, lineHeight: 1.5, margin: 0, flex: 1 }}>
            <strong style={{ color: T.ink }}>Did something surprise you?</strong> Click &ldquo;Full Analysis&rdquo; on any myth to see the scholarly breakdown — or share this page with someone who'd be surprised too.
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Things People Think Are in the Bible (But Aren't)", url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: "none", background: T.blue, color: "white",
              fontFamily: T.sans, fontSize: 12, fontWeight: 600,
              cursor: "pointer", flexShrink: 0,
              transition: "background .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
          >
            🔗 Share this page
          </button>
        </div>

        <div
          className="myths-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((myth, i) => (
            <MythCard key={myth.id} myth={myth} index={MYTHS.indexOf(myth)} onCheck={handleCheck} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 56, textAlign: "center",
          padding: "48px 24px",
          background: T.white, borderRadius: 20,
          border: `1px solid ${T.inkFt}`,
          boxShadow: T.shadowSm,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.inkLt, marginBottom: 12 }}>
            Go deeper
          </div>
          <h2 style={{
            fontFamily: T.serif,
            fontSize: "clamp(26px, 4vw, 42px)",
            fontWeight: 300, color: T.ink,
            lineHeight: 1.2, letterSpacing: "-1px", marginBottom: 12,
          }}>
            Check anything else you&rsquo;ve heard
          </h2>
          <p style={{ color: T.inkMid, fontSize: 15, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.75, fontWeight: 300 }}>
            Our AI reads all 31,102 Bible verses and gives you a verdict with actual passages — in seconds.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", background: T.blue, color: "white",
              fontFamily: T.sans, fontSize: 15, fontWeight: 700,
              borderRadius: 12, textDecoration: "none",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Search the Bible
          </a>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: T.ink, padding: "32px 24px", textAlign: "center" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }} aria-label="Is it in the Bible? — Home">
          <LogoMark size={28} />
          <span style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 600, color: "white" }}>
            Is it in the <em style={{ fontStyle: "italic", color: "#7BA8E4" }}>Bible?</em>
          </span>
        </a>
        <p style={{ fontFamily: T.mono, fontSize: 10.5, color: "rgba(255,255,255,.25)", letterSpacing: ".05em", lineHeight: 1.8, margin: 0 }}>
          © 2026 IS IT IN THE BIBLE? — ALL RIGHTS RESERVED<br />
          Verses from the World English Bible (WEB) — Public Domain · Powered by AI<br />
          Non-denominational · Non-affiliated · No theological bias
        </p>
      </footer>
    </div>
  );
}