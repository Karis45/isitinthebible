// app/topic/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TOPICS, getTopicBySlug } from "@/app/topic/topics";

export const revalidate = 86400; // Cache for 24 hours, regenerate on next visit
const SITE_URL = "https://isitinthebible.vercel.app";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Badge config ─────────────────────────────────────────────────────────────
const BADGE: Record<Classification, { bg: string; text: string; border: string; icon: string; label: string }> = {
  "Directly Stated":  { bg: "#EBF5EF", text: "#1A5C38", border: "#A8D4B8", icon: "📖", label: "Directly Stated"  },
  "Concept Present":  { bg: "#F5ECD2", text: "#7A5A00", border: "#D4B870", icon: "💡", label: "Concept Present"  },
  "Inferred":         { bg: "#FEF0E6", text: "#8A3A00", border: "#E8C4A0", icon: "🔍", label: "Inferred"         },
  "Cultural":         { bg: "#FEF0F0", text: "#7A1A1A", border: "#E8BEBE", icon: "❌", label: "Not in the Bible" },
  "Church Tradition": { bg: "#F3EEF8", text: "#4A1A7A", border: "#C8A8E8", icon: "⛪", label: "Church Tradition" },
};

// ─── Helper functions ─────────────────────────────────────────────────────────
function extractJSON(text: string): string {
  let braceCount = 0;
  let startIdx = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (braceCount === 0) startIdx = i;
      braceCount++;
    } else if (text[i] === "}") {
      braceCount--;
      if (braceCount === 0 && startIdx !== -1) {
        return text.substring(startIdx, i + 1);
      }
    }
  }
  return text;
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchResult(query: string): Promise<BibleResult | null> {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const SYSTEM_PROMPT = `You are a biblical scholar and AI fact-checker. Analyze whether the given phrase, belief, or doctrine appears in the Bible (World English Bible translation). Respond ONLY with valid JSON, no markdown fences.

Use this exact structure:
{
  "query": "<exact query>",
  "classification": "<Directly Stated | Concept Present | Inferred | Cultural | Church Tradition>",
  "explicitnessScore": <1-5>,
  "oneLiner": "<one sentence verdict>",
  "originEra": "<era>",
  "closestBiblicalTheme": "<theme>",
  "searchPopularity": "<Very High | High | Moderate | Low>",
  "theologicalConsensus": "<consensus>",
  "timeline": [{ "year": "<year>", "label": "<label>", "detail": "<detail>" }],
  "verses": [{ "ref": "<ref>", "text": "<WEB text>", "context": "<explanation>" }],
  "misquoteWhat": "<common misunderstanding>",
  "misquoteReality": "<what Scripture actually says>",
  "analysis": "<2-3 paragraphs>",
  "confidenceNote": "<one sentence>",
  "relatedTopics": [{ "query": "<topic>", "classification": "<classification>" }]
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096, responseMimeType: "application/json" },
    });

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nAnalyze: "${query}"`);
    const raw = result.response.text();

    // ✅ Fixed: use brace-depth extractJSON instead of naive lastIndexOf("}")
    // The old approach broke on gemini-2.5-flash thinking blocks which contain
    // their own { } characters, corrupting the JSON slice.
    const parsed: BibleResult = JSON.parse(extractJSON(raw));
    parsed.explicitnessScore = Math.max(1, Math.min(5, Math.round(parsed.explicitnessScore)));
    return parsed;
  } catch (e) {
    console.error(`[topic/${query}] fetch error:`, e);
    return null;
  }
}

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return []; // Don't pre-build at deploy time — generate on first visit instead
}


// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  const title = `Is "${topic.query}" in the Bible?`;
  const description = `Find out if "${topic.query}" actually appears in Scripture — with the exact verses, historical context, and scholarly analysis. Powered by AI.`;
  const ogUrl = `${SITE_URL}/api/og?q=${encodeURIComponent(topic.query)}&c=Cultural&s=1`;
  const pageUrl = `${SITE_URL}/topic/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function TopicPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const result = await fetchResult(topic.query);
  if (!result) notFound();

  const badge = BADGE[result.classification] ?? BADGE["Cultural"];
  const barWidth = Math.round(((result.explicitnessScore - 1) / 4) * 88 + 6);

  const scoreColor = (s: number) => {
    if (s <= 1) return "#E88080";
    if (s <= 2) return "#E8AA60";
    if (s <= 3) return "#F0C040";
    if (s <= 4) return "#7EC8A0";
    return "#5CC88A";
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Is "${result.query}" in the Bible?`,
    description: result.oneLiner,
    url: `${SITE_URL}/topic/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Is it in the Bible?",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Question",
      name: `Is "${result.query}" in the Bible?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${result.oneLiner} ${result.misquoteReality}`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: "#F5F1E8", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── Nav ── */}
        <header style={{ background: "white", borderBottom: "1px solid #D8D0C4", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1A1612", textDecoration: "none" }}>
            Is it in the <em style={{ color: "#1A3A6A", fontStyle: "italic" }}>Bible?</em>
          </a>
          <a href="/" style={{ padding: "7px 16px", background: "#1A3A6A", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", borderRadius: 10 }}>
            Search →
          </a>
        </header>

        {/* ── Hero ── */}
        <div style={{ background: "linear-gradient(135deg, #1A3A6A 0%, #0F2347 100%)", padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* Breadcrumb */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,.45)", marginBottom: 20, letterSpacing: ".08em" }}>
              <a href="/" style={{ color: "rgba(255,255,255,.45)", textDecoration: "none" }}>Home</a>
              {" / "}
              <span style={{ color: "rgba(255,255,255,.65)" }}>Topic</span>
            </div>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: badge.bg, border: `1px solid ${badge.border}`, marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>{badge.icon}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: badge.text }}>{badge.label}</span>
            </div>

            {/* Heading */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 400, color: "white", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 14 }}>
              Is &ldquo;{result.query}&rdquo; in the Bible?
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, maxWidth: 580, marginBottom: 28 }}>
              {result.oneLiner}
            </p>

            {/* Score bar */}
            <div style={{ maxWidth: 400 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase" }}>← Less Biblical</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,.5)" }}>Score: {result.explicitnessScore} / 5 · More Biblical →</span>
              </div>
              <div style={{ height: 7, borderRadius: 100, background: "rgba(255,255,255,.15)", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barWidth}%`, background: scoreColor(result.explicitnessScore), borderRadius: 100 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Origin Era",            value: result.originEra            },
              { label: "Closest Theme",         value: result.closestBiblicalTheme },
              { label: "Search Popularity",     value: result.searchPopularity     },
              { label: "Theological Consensus", value: result.theologicalConsensus },
            ].map((s) => (
              <div key={s.label} style={{ padding: "14px 16px", borderRadius: 12, background: "white", border: "1px solid #D8D0C4" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7D72", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: "#1A1612" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Common claim vs reality */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            <div style={{ padding: 18, borderRadius: 12, background: "#FEF0F0", border: "1px solid #E8BEBE" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#7A1A1A", marginBottom: 10 }}>❌ Common Claim</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.6, color: "#1A1612", fontStyle: "italic", margin: 0 }}>{result.misquoteWhat}</p>
            </div>
            <div style={{ padding: 18, borderRadius: 12, background: "#EBF5EF", border: "1px solid #A8D4B8" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#1A5C38", marginBottom: 10 }}>✓ What It Actually Says</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.6, color: "#1A1612", margin: 0 }}>{result.misquoteReality}</p>
            </div>
          </div>

          {/* Verses */}
          {result.verses.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 16, letterSpacing: "-.3px" }}>
                Relevant Scripture
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {result.verses.map((v, i) => (
                  <div key={v.ref} style={{ padding: "18px 20px", borderRadius: 14, background: "white", border: "1px solid #D8D0C4" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: "#1A3A6A", color: "white", fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                      <strong style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16 }}>{v.ref}</strong>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, background: "#EBF5EF", color: "#1A5C38", border: "1px solid #A8D4B8", borderRadius: 4, padding: "1px 6px" }}>WEB</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, lineHeight: 1.75, color: "#1A1612", fontStyle: "italic", marginBottom: 8 }}>&ldquo;{v.text}&rdquo;</p>
                    <p style={{ fontSize: 13.5, color: "#4A3F35", lineHeight: 1.65, margin: 0 }}>{v.context}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Analysis */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 16, letterSpacing: "-.3px" }}>
              Scholarly Analysis
            </h2>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, lineHeight: 1.9, color: "#4A3F35", borderLeft: "3px solid #D8D0C4", paddingLeft: 20 }}>
              {result.analysis.split("\n\n").map((para, i) => (
                <p key={i} style={{ margin: i > 0 ? "16px 0 0" : "0" }}>{para}</p>
              ))}
            </div>
          </section>

          {/* Timeline */}
          {result.timeline.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 20, letterSpacing: "-.3px" }}>
                Historical Timeline
              </h2>
              {result.timeline.map((node, i) => (
                <div key={node.year} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", marginTop: 4, background: i === 0 ? "#1A3A6A" : "white", border: `2px solid ${i === 0 ? "#1A3A6A" : "#D8D0C4"}`, flexShrink: 0 }} />
                    {i < result.timeline.length - 1 && <div style={{ width: 1, flex: 1, background: "#D8D0C4", minHeight: 28 }} />}
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: "#1A3A6A", marginBottom: 4 }}>{node.year} — {node.label}</div>
                    <div style={{ fontSize: 14, color: "#4A3F35", lineHeight: 1.7 }}>{node.detail}</div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Confidence note */}
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "#EEF2FA", border: "1px solid #C0D4F0", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 40 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🎓</span>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#1A3A6A", marginBottom: 4 }}>Scholarly Confidence</div>
              <p style={{ fontSize: 13.5, color: "#4A3F35", lineHeight: 1.65, margin: 0 }}>{result.confidenceNote}</p>
            </div>
          </div>

          {/* Related topics */}
          {result.relatedTopics.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: "#1A1612", marginBottom: 14 }}>
                Related Topics
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.relatedTopics.map((t) => {
                  const rb = BADGE[t.classification] ?? BADGE["Cultural"];
                  const relSlug = t.query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  return (
                    <a key={t.query} href={`/topic/${relSlug}`}
                      style={{ padding: "9px 14px", border: "1px solid #D8D0C4", borderRadius: 100, background: "#F5F1E8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: rb.text, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#1A1612", fontWeight: 500 }}>{t.query}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "40px 24px", background: "linear-gradient(135deg, #1A3A6A 0%, #0F2347 100%)", borderRadius: 20 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: "white", marginBottom: 10, letterSpacing: "-.5px" }}>
              Ask your own question
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.65)", marginBottom: 22, lineHeight: 1.6 }}>
              Check any phrase, doctrine, or belief against all 31,102 Bible verses — free, instant, no account needed.
            </p>
            <a href="/" style={{ display: "inline-block", padding: "12px 28px", background: "white", color: "#1A3A6A", fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 12 }}>
              Search the Bible →
            </a>
          </div>

        </div>

        {/* ── Footer ── */}
        <footer style={{ background: "#1A1612", padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".05em", lineHeight: 1.8, margin: 0 }}>
            © {new Date().getFullYear()} IS IT IN THE BIBLE? — ALL RIGHTS RESERVED<br />
            Verses from the World English Bible (WEB) — Public Domain · Non-denominational
          </p>
        </footer>

      </div>
    </>
  );
}