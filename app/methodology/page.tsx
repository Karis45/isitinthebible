// app/methodology/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology — Is it in the Bible?",
  description:
    "How our AI analyzes 31,102 Bible verses to classify phrases as Directly Stated, Concept Present, Inferred, Church Tradition, or Not in the Bible.",
};

const T = {
  parchment:     "#F5F1E8",
  parchmentDark: "#EDE8DA",
  inkFt:         "#D8D0C4",
  ink:           "#1A1612",
  inkMid:        "#4A3F35",
  inkLt:         "#8A7D72",
  blue:          "#1A3A6A",
  blueMid:       "#2A5298",
  blueLt:        "#EEF2FA",
  green:         "#1A5C38",
  greenLt:       "#EBF5EF",
  red:           "#7A1A1A",
  redLt:         "#FEF0F0",
  serif:         "'Cormorant Garamond', Georgia, serif",
  sans:          "'DM Sans', system-ui, sans-serif",
  mono:          "'DM Mono', monospace",
};

const CLASSIFICATIONS = [
  {
    icon: "📖",
    score: 5,
    label: "Directly Stated",
    color: "#1A5C38",
    bg: "#EBF5EF",
    border: "#A8D4B8",
    bar: "#5CC88A",
    description:
      "The exact phrase, concept, or command appears verbatim or near-verbatim in Scripture. No interpretation required.",
    example: {
      phrase: "Love your neighbour as yourself",
      reference: "Matthew 22:39",
      note: "Stated explicitly and repeatedly across both Old and New Testaments.",
    },
  },
  {
    icon: "💡",
    score: 4,
    label: "Concept Present",
    color: "#7A5A00",
    bg: "#F5ECD2",
    border: "#D4B870",
    bar: "#7EC8A0",
    description:
      "The idea is clearly and consistently present in Scripture even if the exact phrasing isn't. The concept can be directly traced to biblical teaching.",
    example: {
      phrase: "The Trinity",
      reference: "Matthew 28:19, 2 Corinthians 13:14",
      note: "The word 'Trinity' never appears, but the three-person nature of God is clearly present throughout Scripture.",
    },
  },
  {
    icon: "🔍",
    score: 3,
    label: "Inferred",
    color: "#8A3A00",
    bg: "#FEF0E6",
    border: "#E8C4A0",
    bar: "#F0C040",
    description:
      "The claim can be logically derived or theologically deduced from Scripture, but requires interpretation. Reasonable people may disagree.",
    example: {
      phrase: "Abortion is a sin",
      reference: "Psalm 139:13-16, Jeremiah 1:5",
      note: "No verse explicitly addresses abortion, but verses about the sanctity of life in the womb are used to infer this position.",
    },
  },
  {
    icon: "⛪",
    score: 2,
    label: "Church Tradition",
    color: "#4A1A7A",
    bg: "#F3EEF8",
    border: "#C8A8E8",
    bar: "#E8AA60",
    description:
      "A doctrine or practice that developed in church history and tradition, not directly from Scripture itself. May be widely believed but lacks direct biblical basis.",
    example: {
      phrase: "The Rapture",
      reference: "1 Thessalonians 4:17",
      note: "The concept is derived from one passage but the specific pre-tribulation Rapture doctrine is a 19th-century theological development.",
    },
  },
  {
    icon: "❌",
    score: 1,
    label: "Not in the Bible",
    color: "#7A1A1A",
    bg: "#FEF0F0",
    border: "#E8BEBE",
    bar: "#E88080",
    description:
      "The phrase or idea has no meaningful basis in Scripture. Often a cultural saying, misattribution, or popular myth falsely credited to the Bible.",
    example: {
      phrase: "God helps those who help themselves",
      reference: "Not found",
      note: "This phrase originated in ancient Greek literature and was popularised by Benjamin Franklin — never appears in Scripture.",
    },
  },
];

const STEPS = [
  {
    number: "01",
    title: "Query received",
    body: "You type a phrase, doctrine, belief, or saying. Our system accepts anything from single words to full sentences, up to 500 characters.",
  },
  {
    number: "02",
    title: "AI analysis begins",
    body: "We pass your query to Google Gemini — a large language model trained on extensive biblical and theological sources — with a precise academic prompt.",
  },
  {
    number: "03",
    title: "All 31,102 verses examined",
    body: "The AI cross-references your query against the complete World English Bible (WEB), a modern public-domain translation that preserves scholarly accuracy.",
  },
  {
    number: "04",
    title: "Classification assigned",
    body: "The AI assigns one of five classifications based on how explicitly and directly the concept appears in Scripture, with a confidence score of 1–5.",
  },
  {
    number: "05",
    title: "Evidence gathered",
    body: "Relevant verses are identified with their exact WEB text and contextual explanation. A historical timeline traces the phrase's origin and development.",
  },
  {
    number: "06",
    title: "Verdict returned",
    body: "You receive a full scholarly analysis: classification, biblical score, key verses, historical timeline, common misquote vs. reality, and related topics.",
  },
];

export default function MethodologyPage() {
  return (
    <main style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      {/* ── Nav ── */}
      <nav style={{
        background: "white", borderBottom: `1px solid ${T.inkFt}`,
        padding: "0 24px", height: 64, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: T.blue, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📖</div>
          <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, fontWeight: 600 }}>
            Is it in the <em style={{ color: T.blue }}>Bible?</em>
          </span>
        </Link>
        <Link href="/" style={{ padding: "8px 18px", borderRadius: 8, background: T.blue, color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          Search
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`,
        padding: "80px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 20 }}>
            How it works
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 400, color: "white", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 24 }}>
            Rigorous, honest,<br />
            <em style={{ color: "#A8C4F0" }}>non-denominational.</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Our methodology is built on one principle: report what the text actually says,
            not what any tradition, denomination, or culture wants it to say.
          </p>
        </div>
      </section>

      {/* ── Translation ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 16 }}>
          The Source Text
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: T.ink, letterSpacing: "-.5px", marginBottom: 24 }}>
          The World English Bible
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          {[
            { label: "Modern language", detail: "Written in clear, contemporary English — not King James-era prose." },
            { label: "Public domain", detail: "No copyright restrictions. Anyone can read, quote, and share freely." },
            { label: "Scholarly accurate", detail: "Translated directly from original Hebrew, Aramaic, and Greek texts." },
            { label: "Complete canon", detail: "All 66 books, 1,189 chapters, and 31,102 verses — nothing omitted." },
          ].map((item) => (
            <div key={item.label} style={{ padding: "18px 20px", borderRadius: 12, background: "white", border: `1px solid ${T.inkFt}` }}>
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 6 }}>✓ {item.label}</div>
              <p style={{ fontFamily: T.serif, fontSize: 14, lineHeight: 1.6, color: T.inkMid, margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "18px 20px", borderRadius: 12, background: T.blueLt, border: "1px solid #C0D4F0", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontFamily: T.serif, fontSize: 14.5, lineHeight: 1.65, color: T.inkMid, margin: 0 }}>
            We chose the WEB specifically because it is free from copyright restrictions, enabling our AI to read and quote every verse without limitation. Other translations (NIV, ESV, NLT) are copyrighted and cannot be fully accessed this way.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── How it works steps ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 16 }}>
          The Process
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: T.ink, letterSpacing: "-.5px", marginBottom: 48 }}>
          From your question to a verdict
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ display: "flex", gap: 24, paddingBottom: i < STEPS.length - 1 ? 36 : 0 }}>
              {/* Timeline */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 48 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: i === 0 ? T.blue : "white",
                  border: `2px solid ${i === 0 ? T.blue : T.inkFt}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: T.mono, fontSize: 13, fontWeight: 700,
                  color: i === 0 ? "white" : T.inkLt, flexShrink: 0,
                }}>
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: T.inkFt, minHeight: 24, marginTop: 4 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingTop: 10 }}>
                <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 6 }}>
                  {step.title}
                </div>
                <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.7, color: T.inkMid, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Classifications ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 16 }}>
          The Five Classifications
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: T.ink, letterSpacing: "-.5px", marginBottom: 12 }}>
          Not everything is black and white
        </h2>
        <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.inkMid, marginBottom: 48, maxWidth: 600 }}>
          Scripture is a complex document spanning thousands of years. Our five-tier
          classification system reflects that nuance honestly — rather than forcing
          every answer into a simple yes or no.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CLASSIFICATIONS.map((c) => (
            <div key={c.label} style={{
              borderRadius: 16, background: "white",
              border: `1px solid ${T.inkFt}`, overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.inkFt}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", borderRadius: 100,
                  background: c.bg, border: `1px solid ${c.border}`,
                  fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                  color: c.color, letterSpacing: ".06em", textTransform: "uppercase",
                  flexShrink: 0,
                }}>
                  <span>{c.icon}</span> {c.label}
                </span>
                {/* Score bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 160 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 100, background: T.inkFt, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((c.score - 1) / 4) * 100}%`, background: c.bar, borderRadius: 100 }} />
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, flexShrink: 0 }}>Score {c.score}/5</span>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.7, color: T.inkMid, marginBottom: 16 }}>
                  {c.description}
                </p>
                {/* Example */}
                <div style={{ padding: "14px 16px", borderRadius: 10, background: T.parchment, border: `1px solid ${T.inkFt}` }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.inkLt, marginBottom: 8 }}>
                    Example
                  </div>
                  <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 4, fontStyle: "italic" }}>
                    &ldquo;{c.example.phrase}&rdquo;
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.blue, marginBottom: 6 }}>
                    {c.example.reference}
                  </div>
                  <p style={{ fontFamily: T.serif, fontSize: 13.5, lineHeight: 1.6, color: T.inkMid, margin: 0 }}>
                    {c.example.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Limitations ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 16 }}>
          Honest Limitations
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: T.ink, letterSpacing: "-.5px", marginBottom: 24 }}>
          What this tool is — and isn&apos;t
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "✅", text: "A fast, accessible way to fact-check biblical claims against the full text of Scripture." },
            { icon: "✅", text: "A starting point for deeper study — our verdicts cite exact verses so you can read them yourself." },
            { icon: "✅", text: "Non-denominational and non-partisan — we don't favor any theological tradition." },
            { icon: "⚠️", text: "AI can make mistakes. For high-stakes theological decisions, always consult a qualified biblical scholar." },
            { icon: "⚠️", text: "We use one translation (WEB). Some nuances differ across translations — our verdicts reflect WEB specifically." },
            { icon: "⚠️", text: "Complex doctrinal questions often have legitimate scholarly debate. Our classifications reflect the most defensible academic position, not a final word." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: item.icon === "✅" ? T.greenLt : "#FFFBEB", border: `1px solid ${item.icon === "✅" ? "#A8D4B8" : "#E8D898"}` }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.6, color: T.inkMid, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: T.serif, fontSize: 18, color: T.inkMid, marginBottom: 24, fontStyle: "italic" }}>
          Convinced? See the methodology in action.
        </p>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 32px", borderRadius: 10, background: T.blue,
          color: "white", textDecoration: "none",
          fontFamily: T.sans, fontSize: 15, fontWeight: 700,
        }}>
          📖 Try a Search
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.parchmentDark, borderTop: `1px solid ${T.inkFt}`, padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, margin: 0, letterSpacing: ".06em" }}>
          © {new Date().getFullYear()} Is it in the Bible? · Built by Anthony Kariuki ·{" "}
          <Link href="/about" style={{ color: T.inkLt }}>About</Link>
          {" · "}
          <Link href="/privacy" style={{ color: T.inkLt }}>Privacy Policy</Link>
        </p>
      </footer>

    </main>
  );
}