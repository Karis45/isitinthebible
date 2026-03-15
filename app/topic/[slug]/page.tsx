// app/topic/[slug]/page.tsx
import { Metadata } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import Link from "next/link";

// ─── Allow server-rendering for slugs not pre-built at deploy time ────────────
export const dynamicParams = true;
export const revalidate = 0; // disable ISR cache — force fresh render to clear stale "undefined" pages

const SITE_URL = "https://isitinthebible.vercel.app";

// ─── Firebase Admin ───────────────────────────────────────────────────────────
function getDb() {
  if (!getApps().length) {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        "Missing Firebase env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY"
      );
    }
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Slug helpers (must match cacheKey() in route.ts exactly) ─────────────────
function slugToKey(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

function queryToSlug(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getResult(slug: string): Promise<BibleResult | null> {
  const humanQuery = decodeURIComponent(slug).replace(/-/g, " ").trim();

  try {
    const db  = getDb();
    const key = slugToKey(slug);
    const doc = await db.collection("query_cache").doc(key).get();
    if (doc.exists) {
      const data = doc.data();
      if (data?.result) {
        const result = data.result as BibleResult;
        if (!result.query) result.query = data.queryRaw ?? humanQuery;
        return result;
      }
    }
  } catch (err) {
    console.error("[topic/page] Firestore error:", err);
  }

  try {
    const res = await fetch(`${SITE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statement: humanQuery }),
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const result = (json.result as BibleResult) ?? null;
      if (result && !result.query) result.query = humanQuery;
      return result;
    }
    console.error("[topic/page] Live API returned", res.status, "for slug:", slug);
  } catch (err) {
    console.error("[topic/page] Live API fallback error:", err);
  }

  return null;
}

async function getAllCachedSlugs(): Promise<string[]> {
  try {
    const db   = getDb();
    const snap = await db.collection("query_cache").select("queryRaw").get();
    return snap.docs
      .map((d) => queryToSlug(d.data().queryRaw ?? ""))
      .filter(Boolean);
  } catch (err) {
    console.error("[topic/page] getAllCachedSlugs error:", err);
    return [];
  }
}

// ─── Static params (pre-render all cached topics at build time) ───────────────
export async function generateStaticParams() {
  const slugs = await getAllCachedSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getResult(slug);
  if (!result) return { title: "Not Found — Is it in the Bible?" };

  const title       = `Is "${result.query}" in the Bible? — ${result.classification}`;
  const description = result.oneLiner;
  const url         = `${SITE_URL}/topic/${slug}`;
  const ogUrl       = `${SITE_URL}/api/og?q=${encodeURIComponent(result.query)}&c=${encodeURIComponent(result.classification)}&s=${result.explicitnessScore}&v=${encodeURIComponent(result.oneLiner)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type:   "article",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogUrl],
    },
  };
}

// ─── Classification badge config ──────────────────────────────────────────────
const BADGE: Record<
  Classification,
  { bg: string; text: string; border: string; dot: string; label: string; icon: string }
> = {
  "Directly Stated":  { bg: "#EBF5EF", text: "#1A5C38", border: "#A8D4B8", dot: "#1A5C38", label: "Directly Stated",  icon: "📖" },
  "Concept Present":  { bg: "#F5ECD2", text: "#7A5A00", border: "#D4B870", dot: "#B8860B", label: "Concept Present",  icon: "💡" },
  "Inferred":         { bg: "#FEF0E6", text: "#8A3A00", border: "#E8C4A0", dot: "#8A3A00", label: "Inferred",         icon: "🔍" },
  "Cultural":         { bg: "#FEF0F0", text: "#7A1A1A", border: "#E8BEBE", dot: "#7A1A1A", label: "Not in the Bible", icon: "❌" },
  "Church Tradition": { bg: "#F3EEF8", text: "#4A1A7A", border: "#C8A8E8", dot: "#4A1A7A", label: "Church Tradition", icon: "⛪" },
};

const scoreLabel = (s: number) =>
  (["", "Not in the Bible", "Church Tradition", "Inferred", "Concept Present", "Directly Stated"] as const)[s] ?? "";

const scoreColor = (s: number) => {
  if (s <= 1) return "#E88080";
  if (s <= 2) return "#E8AA60";
  if (s <= 3) return "#F0C040";
  if (s <= 4) return "#7EC8A0";
  return "#5CC88A";
};

// ─── JSON-LD schema ───────────────────────────────────────────────────────────
function buildJsonLd(result: BibleResult, url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":      "QAPage",
        "@id":        `${url}#qapage`,
        url,
        name:         `Is "${result.query}" in the Bible?`,
        description:  result.oneLiner,
        mainEntity: {
          "@type":        "Question",
          name:           `Is "${result.query}" in the Bible?`,
          text:           `Is "${result.query}" mentioned or taught in the Bible?`,
          datePublished:  new Date().toISOString().split("T")[0],
          author:         { "@type": "Organization", name: "Is it in the Bible?" },
          acceptedAnswer: {
            "@type":      "Answer",
            text:         `${result.oneLiner} ${result.misquoteReality}`,
            url,
            author:       { "@type": "Organization", name: "Is it in the Bible?" },
            upvoteCount:  result.explicitnessScore * 10,
          },
        },
      },
      {
        "@type":       "Article",
        "@id":         `${url}#article`,
        url,
        headline:      `Is "${result.query}" in the Bible? — ${result.classification}`,
        description:   result.oneLiner,
        datePublished: new Date().toISOString().split("T")[0],
        dateModified:  new Date().toISOString().split("T")[0],
        author:        { "@type": "Organization", name: "Is it in the Bible?", url: SITE_URL },
        publisher:     { "@type": "Organization", name: "Is it in the Bible?", url: SITE_URL },
        about:         { "@type": "Thing", name: result.query },
        keywords:      [result.query, result.classification, result.closestBiblicalTheme, "Bible", "Scripture", "World English Bible"].join(", "),
        articleBody:   `${result.oneLiner}\n\n${result.analysis}\n\nCommon claim: ${result.misquoteWhat}\n\nWhat the Bible actually says: ${result.misquoteReality}\n\nScholarly confidence: ${result.confidenceNote}`,
      },
      {
        "@type":           "BreadcrumbList",
        "@id":             `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",   item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topic` },
          { "@type": "ListItem", position: 3, name: result.query, item: url },
        ],
      },
      {
        "@type":    "FAQPage",
        "@id":      `${url}#faq`,
        mainEntity: result.relatedTopics.slice(0, 5).map((t) => ({
          "@type": "Question",
          name:    `Is "${t.query}" in the Bible?`,
          acceptedAnswer: {
            "@type": "Answer",
            text:    `According to biblical analysis, "${t.query}" is classified as: ${t.classification}.`,
          },
        })),
      },
    ],
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getResult(slug);
  const humanQuery = decodeURIComponent(slug).replace(/-/g, " ").trim();

  if (!result) {
    return (
      <div style={{ background: "#F5F1E8", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <nav style={{ background: "white", borderBottom: "1px solid #D8D0C4", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "#1A3A6A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 16 }}>📖</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#1A1612" }}>
              Is it in the <em style={{ color: "#1A3A6A", fontStyle: "italic" }}>Bible?</em>
            </span>
          </Link>
          <Link href="/" style={{ padding: "7px 16px", background: "#1A3A6A", color: "white", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            Search
          </Link>
        </nav>
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>📖</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 400, color: "#1A1612", marginBottom: 16, lineHeight: 1.2 }}>
            This topic isn&apos;t in our cache yet
          </h1>
          <p style={{ fontSize: 16, color: "#4A3F35", lineHeight: 1.75, marginBottom: 32 }}>
            We couldn&apos;t find an analysis for &ldquo;{humanQuery}&rdquo;. Search for it from the homepage and our AI will analyze it instantly.
          </p>
          <Link
            href={`/?q=${encodeURIComponent(humanQuery)}`}
            style={{ display: "inline-block", padding: "12px 28px", background: "#1A3A6A", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            Search for &ldquo;{humanQuery}&rdquo; →
          </Link>
        </main>
      </div>
    );
  }

  const url    = `${SITE_URL}/topic/${slug}`;
  const badge  = BADGE[result.classification] ?? BADGE["Cultural"];
  const jsonLd = buildJsonLd(result, url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: "#F5F1E8", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── Nav ── */}
        <nav style={{ background: "white", borderBottom: "1px solid #D8D0C4", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "#1A3A6A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 16 }}>📖</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#1A1612" }}>
              Is it in the{" "}
              <em style={{ color: "#1A3A6A", fontStyle: "italic" }}>Bible?</em>
            </span>
          </Link>
          <Link href="/" style={{ padding: "7px 16px", background: "#1A3A6A", color: "white", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            Search
          </Link>
        </nav>

        {/* ── Breadcrumb ── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "16px 24px 0" }}>
          <nav aria-label="Breadcrumb">
            <ol style={{ display: "flex", gap: 6, alignItems: "center", listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#8A7D72" }}>
              <li><Link href="/" style={{ color: "#8A7D72", textDecoration: "none" }}>Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#browse-topics" style={{ color: "#8A7D72", textDecoration: "none" }}>Topics</Link></li>
              <li aria-hidden="true">›</li>
              <li style={{ color: "#1A1612", fontWeight: 500 }}>{result.query}</li>
            </ol>
          </nav>
        </div>

        {/* ── Hero ── */}
        <header style={{ background: "linear-gradient(135deg, #1A3A6A 0%, #0F2347 100%)", padding: "48px 24px 40px", marginTop: 16 }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: badge.bg, border: `1px solid ${badge.border}`, marginBottom: 20 }}>
              <span style={{ fontSize: 13 }}>{badge.icon}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: badge.text, letterSpacing: ".06em", textTransform: "uppercase" }}>
                {badge.label}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400, color: "white", lineHeight: 1.2, letterSpacing: "-.5px", marginBottom: 16 }}>
              Is &ldquo;{result.query}&rdquo; in the Bible?
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.8)", lineHeight: 1.65, maxWidth: 580, marginBottom: 24 }}>
              {result.oneLiner}
            </p>
            <div style={{ maxWidth: 400 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>
                  Biblical Explicitness
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,.55)" }}>
                  {result.explicitnessScore}/5 — {scoreLabel(result.explicitnessScore)}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 100, background: "rgba(255,255,255,.15)" }}>
                <div style={{ height: "100%", width: `${((result.explicitnessScore - 1) / 4) * 88 + 6}%`, background: scoreColor(result.explicitnessScore), borderRadius: 100, transition: "width .6s" }} />
              </div>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>

          {/* ── Verdict cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 32 }}>
            <div style={{ padding: "16px 18px", borderRadius: 14, background: "#FEF0F0", border: "1px solid #E8BEBE" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#7A1A1A", marginBottom: 8 }}>
                ❌ Common Claim
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.6, color: "#1A1612", fontStyle: "italic", margin: 0 }}>
                {result.misquoteWhat}
              </p>
            </div>
            <div style={{ padding: "16px 18px", borderRadius: 14, background: "#EBF5EF", border: "1px solid #A8D4B8" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#1A5C38", marginBottom: 8 }}>
                ✓ What Scripture Says
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.6, color: "#1A1612", margin: 0 }}>
                {result.misquoteReality}
              </p>
            </div>
          </div>

          {/* ── Stats grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 32 }}>
            {[
              { label: "Origin Era",            value: result.originEra            },
              { label: "Closest Biblical Theme", value: result.closestBiblicalTheme },
              { label: "Search Popularity",      value: result.searchPopularity     },
              { label: "Theological Consensus",  value: result.theologicalConsensus },
            ].map((s) => (
              <div key={s.label} style={{ padding: "12px 14px", borderRadius: 12, background: "white", border: "1px solid #D8D0C4" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7D72", marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#1A1612", lineHeight: 1.3 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── Bible Verses ── */}
          <section aria-labelledby="verses-heading" style={{ marginBottom: 36 }}>
            <h2 id="verses-heading" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 16, letterSpacing: "-.3px" }}>
              Relevant Bible Verses
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {result.verses.map((v, i) => (
                <article key={v.ref} style={{ padding: "18px 20px", borderRadius: 14, background: "white", border: "1px solid #D8D0C4" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: "#1A3A6A", color: "white", fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <strong style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16 }}>{v.ref}</strong>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, background: "#EBF5EF", color: "#1A5C38", border: "1px solid #A8D4B8", borderRadius: 4, padding: "1px 6px" }}>WEB</span>
                  </div>
                  <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, lineHeight: 1.75, color: "#1A1612", fontStyle: "italic", borderLeft: "3px solid #D8D0C4", paddingLeft: 14, margin: "0 0 10px 0" }}>
                    &ldquo;{v.text}&rdquo;
                  </blockquote>
                  <p style={{ fontSize: 13.5, color: "#4A3F35", lineHeight: 1.65, margin: 0 }}>{v.context}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Scholarly Analysis ── */}
          <section aria-labelledby="analysis-heading" style={{ marginBottom: 36 }}>
            <h2 id="analysis-heading" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 16, letterSpacing: "-.3px" }}>
              Scholarly Analysis
            </h2>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, lineHeight: 1.9, color: "#4A3F35", borderLeft: "3px solid #D8D0C4", paddingLeft: 18 }}>
              {result.analysis.split("\n\n").map((para, i) => (
                <p key={i} style={{ margin: i > 0 ? "14px 0 0" : "0" }}>{para}</p>
              ))}
            </div>
          </section>

          {/* ── Historical Timeline ── */}
          <section aria-labelledby="history-heading" style={{ marginBottom: 36 }}>
            <h2 id="history-heading" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 400, color: "#1A1612", marginBottom: 20, letterSpacing: "-.3px" }}>
              Historical Timeline
            </h2>
            {result.timeline.map((node, i) => (
              <div key={`${node.year}-${i}`} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: i === 0 ? "#1A3A6A" : "white", border: `2px solid ${i === 0 ? "#1A3A6A" : "#D8D0C4"}`, boxShadow: i === 0 ? "0 0 0 3px rgba(26,58,106,.15)" : "none" }} />
                  {i < result.timeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "#D8D0C4", minHeight: 28 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 24 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: "#1A3A6A", marginBottom: 3 }}>
                    {node.year} — {node.label}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#4A3F35", lineHeight: 1.7 }}>{node.detail}</div>
                </div>
              </div>
            ))}
          </section>

          {/* ── Scholarly Confidence ── */}
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#EEF2FA", border: "1px solid #C0D4F0", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 36 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🎓</span>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#1A3A6A", marginBottom: 4 }}>
                Scholarly Confidence
              </div>
              <p style={{ fontSize: 13.5, color: "#4A3F35", lineHeight: 1.65, margin: 0 }}>{result.confidenceNote}</p>
            </div>
          </div>

          {/* ── Related Topics ── */}
          <section aria-labelledby="related-heading" style={{ marginBottom: 48 }}>
            <h2 id="related-heading" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: "#1A1612", marginBottom: 14, letterSpacing: "-.3px" }}>
              Related Topics
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.relatedTopics.map((t) => {
                const rb    = BADGE[t.classification] ?? BADGE["Cultural"];
                const rSlug = queryToSlug(t.query);
                return (
                  <Link key={t.query} href={`/topic/${rSlug}`} style={{ padding: "9px 14px", border: "1px solid #D8D0C4", borderRadius: 100, background: "white", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: rb.dot, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#1A1612", fontWeight: 500 }}>{t.query}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── CTA ── */}
          <div style={{ padding: "32px 28px", borderRadius: 20, background: "linear-gradient(135deg, #1A3A6A 0%, #0F2347 100%)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "white", marginBottom: 16, lineHeight: 1.4 }}>
              Have another phrase to check?
            </p>
            <Link href="/" style={{ display: "inline-block", padding: "12px 28px", background: "white", color: "#1A3A6A", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Search the Bible →
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}