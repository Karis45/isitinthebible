"use client";

// app/methodology/methodologyClient.tsx

const T = {
  parchment:     "#F5F1E8",
  parchmentDark: "#EDE8DA",
  white:         "#FFFFFF",
  ink:           "#1A1612",
  inkMid:        "#4A3F35",
  inkLt:         "#8A7D72",
  inkFt:         "#D8D0C4",
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
  shadowSm:      "0 1px 3px rgba(26,22,18,.05), 0 4px 12px rgba(26,22,18,.04)",
  shadowMd:      "0 4px 16px rgba(26,22,18,.08), 0 12px 40px rgba(26,22,18,.06)",
};

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

const STEPS = [
  { n: 1, title: "Submit your query",          body: "Type any phrase, doctrine, belief, or saying — up to 500 characters." },
  { n: 2, title: "AI analysis begins",         body: "Our AI applies a rigorous academic framework developed specifically for Scripture." },
  { n: 3, title: "All 31,102 verses scanned",  body: "The AI cross-references your query against the complete World English Bible." },
  { n: 4, title: "Classification assigned",    body: "One of five classifications is assigned with a confidence score of 1-5." },
  { n: 5, title: "Evidence gathered",          body: "Relevant verses, historical timeline, and contextual explanations are compiled." },
  { n: 6, title: "Verdict returned",           body: "You receive classification, key verses, historical timeline, and full scholarly analysis." },
];

const TIERS = [
  { score: "5/5", label: "Directly Stated",  color: T.green,   bg: T.greenLt, border: "#A8D4B8", desc: "The exact phrase or concept appears verbatim or near-verbatim in Scripture. No interpretation required." },
  { score: "4/5", label: "Concept Present",  color: "#1A4A6A", bg: T.blueLt,  border: "#B8CCE8", desc: "The idea is clearly present in Scripture, though the exact modern phrasing may not appear word-for-word." },
  { score: "3/5", label: "Inferred",         color: "#5A4A10", bg: "#FEFAED", border: "#E8D898", desc: "Can be logically derived from Scripture through interpretation. Reasonable people may disagree." },
  { score: "2/5", label: "Church Tradition", color: "#6A3A10", bg: "#FEF5ED", border: "#E8C898", desc: "A doctrine developed in church history. Widely believed but lacks direct biblical basis." },
  { score: "1/5", label: "Not in the Bible", color: T.red,     bg: T.redLt,   border: "#E8C4C4", desc: "No meaningful basis in Scripture. Often a cultural saying or misattribution falsely credited to the Bible." },
];

const FAQS = [
  {
    q: "What Bible translation do you use?",
    a: "We use the World English Bible (WEB) — a modern, accurate, fully public-domain translation covering all 66 books, 1,189 chapters, and 31,102 verses, translated directly from the original Hebrew, Aramaic, and Greek texts.",
  },
  {
    q: "Is this tool affiliated with any church or denomination?",
    a: "No. Is it in the Bible? is completely non-denominational and non-affiliated. The analysis reports what the biblical text actually says, not what any tradition, denomination, or culture wants it to say.",
  },
  {
    q: "Can the AI make mistakes?",
    a: "Yes. While our AI is trained on rigorous biblical scholarship, it can make mistakes. For high-stakes theological decisions, always consult a qualified biblical scholar. Our verdicts reflect the most defensible academic position based on the World English Bible text.",
  },
  {
    q: "How is 'Inferred' different from 'Church Tradition'?",
    a: "Inferred (3/5) means a claim can be logically derived from Scripture through interpretation. Church Tradition (2/5) means a doctrine developed in church history that is widely believed but lacks direct biblical basis — for example, the pre-tribulation Rapture doctrine, which emerged in the 19th century.",
  },
];

export default function MethodologyClient() {
  return (
    <div style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      {/* Nav */}
      <header style={{ background: T.parchment, borderBottom: `1px solid ${T.inkFt}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }} aria-label="Is it in the Bible? — Home">
          <LogoMark />
          <span style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: "-.2px", lineHeight: 1.2 }}>
            Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
          </span>
        </a>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.inkLt, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
            Our Process
            <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 300, color: T.ink, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 16 }}>
            How We <em style={{ fontStyle: "italic", color: T.blue }}>Fact-Check</em> the Bible
          </h1>
          <p style={{ color: T.inkMid, fontSize: 15.5, lineHeight: 1.8, fontWeight: 300, maxWidth: 560, margin: "0 auto" }}>
            Every query is cross-referenced against all 31,102 verses of the World English Bible using a rigorous, non-denominational academic framework.
          </p>
        </div>

        {/* How it works — steps */}
        <section aria-labelledby="how-it-works" style={{ marginBottom: 64 }}>
          <h2 id="how-it-works" style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, color: T.ink, marginBottom: 28, letterSpacing: "-.5px" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ background: T.white, border: `1px solid ${T.inkFt}`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 18, alignItems: "flex-start", boxShadow: T.shadowSm }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.blueLt, border: `1.5px solid #B8CCE8`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.blue }}>{s.n}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: T.ink, fontSize: 14.5, marginBottom: 4, fontFamily: T.sans }}>{s.title}</p>
                  <p style={{ color: T.inkMid, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Five-tier classification */}
        <section aria-labelledby="classification" style={{ marginBottom: 64 }}>
          <h2 id="classification" style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, color: T.ink, marginBottom: 8, letterSpacing: "-.5px" }}>
            The five-tier classification
          </h2>
          <p style={{ color: T.inkMid, fontSize: 14.5, lineHeight: 1.75, marginBottom: 28, maxWidth: 600 }}>
            Every result is assigned one of five verdicts, each with a confidence score and a clear explanation of what it means.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {TIERS.map((t) => (
              <div key={t.label} style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 14, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, paddingTop: 2 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: t.color, background: "rgba(255,255,255,.6)", padding: "3px 8px", borderRadius: 20, border: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>{t.score}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: t.color, fontSize: 14, marginBottom: 5, fontFamily: T.sans }}>{t.label}</p>
                  <p style={{ color: T.inkMid, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Translation section */}
        <section aria-labelledby="translation" style={{ marginBottom: 64 }}>
          <div style={{ background: T.white, border: `1px solid ${T.inkFt}`, borderRadius: 18, padding: "32px 28px", boxShadow: T.shadowSm }}>
            <h2 id="translation" style={{ fontFamily: T.serif, fontSize: 26, fontWeight: 400, color: T.ink, marginBottom: 12, letterSpacing: "-.4px" }}>
              The <em style={{ fontStyle: "italic", color: T.blue }}>World English Bible</em>
            </h2>
            <p style={{ color: T.inkMid, fontSize: 14.5, lineHeight: 1.8, marginBottom: 16 }}>
              We use the World English Bible (WEB) — a modern, accurate, fully public-domain translation. It covers all 66 books, 1,189 chapters, and 31,102 verses, translated directly from the original Hebrew, Aramaic, and Greek texts.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[["66", "Books"], ["1,189", "Chapters"], ["31,102", "Verses"]].map(([n, label]) => (
                <div key={label} style={{ background: T.blueLt, border: `1px solid #B8CCE8`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <p style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 500, color: T.blue, margin: "0 0 2px" }}>{n}</p>
                  <p style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: T.inkLt, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq">
          <h2 id="faq" style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, color: T.ink, marginBottom: 24, letterSpacing: "-.5px" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {FAQS.map((f) => (
              <div key={f.q} style={{ background: T.white, border: `1px solid ${T.inkFt}`, borderRadius: 14, padding: "20px 22px", boxShadow: T.shadowSm }}>
                <p style={{ fontWeight: 600, color: T.ink, fontSize: 14.5, marginBottom: 8, fontFamily: T.sans }}>{f.q}</p>
                <p style={{ color: T.inkMid, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <a
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: T.blue, color: "white", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: T.sans, boxShadow: "0 2px 12px rgba(26,58,106,.25)", transition: "background .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Try the fact-checker
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.inkFt}`, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: T.mono, fontSize: 10.5, color: T.inkLt, letterSpacing: ".05em", margin: 0 }}>
          © {new Date().getFullYear()} IS IT IN THE BIBLE? — ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
}