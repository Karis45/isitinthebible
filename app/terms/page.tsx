// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — Is it in the Bible?",
  description:
    "Terms of Use for Is it in the Bible? — a free AI-powered biblical fact-checker. Plain English, no legalese.",
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
  serif:         "'Cormorant Garamond', Georgia, serif",
  sans:          "'DM Sans', system-ui, sans-serif",
  mono:          "'DM Mono', monospace",
  shadowSm:      "0 1px 3px rgba(26,22,18,.05), 0 4px 12px rgba(26,22,18,.04)",
};

const NAV_LINKS = [
  { label: "About",         href: "/about"          },
  { label: "Methodology",   href: "/methodology"    },
  { label: "Browse Topics", href: "/#browse-topics" },
  { label: "Contact",       href: "/contact"        },
];

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: T.blue,
      borderRadius: Math.round(size * 0.25),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "0 2px 8px rgba(26,58,106,.28)",
    }}>
      <svg width={size - 8} height={size - 8} viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        <circle cx="17.5" cy="17.5" r="4.5" fill="#1A3A6A" stroke="white" strokeWidth="1.5" />
        <path d="m15.5 17.5 1.5 1.5 3-3" stroke="white" strokeWidth="1.6" fill="none" />
      </svg>
    </div>
  );
}

const SECTIONS = [
  {
    title: "Who we are",
    content: `Is it in the Bible? is a free, independent tool built and maintained by Anthony Kariuki. It uses AI to fact-check whether phrases, doctrines, and beliefs are found in the World English Bible (WEB). We are not a church, denomination, theological institution, or religious organisation of any kind.`,
  },
  {
    title: "Using this site",
    content: `You're welcome to use this site freely — no account, no fee, no catch. We just ask that you use it honestly and don't try to break it. Specifically, please don't attempt to reverse-engineer the AI, scrape the site at scale, submit content intended to abuse or overload the system, or use the results to misrepresent Scripture or deceive others.`,
  },
  {
    title: "AI results and accuracy",
    content: `Our AI reads all 31,102 verses of the World English Bible and does its best to give you an honest, well-reasoned verdict. But AI can make mistakes — it may occasionally misclassify a phrase, miss nuance, or reflect the limits of its training. Results should be treated as a helpful starting point, not a final theological authority. For important decisions of faith or doctrine, please consult a qualified biblical scholar or pastor. Our full methodology is explained on the Methodology page.`,
  },
  {
    title: "Contact form messages",
    content: `When you send us a message via the contact form, your name, email address, and message content are transmitted to us via Resend (our email delivery provider) and delivered to our inbox. We don't store your message in a database — it arrives as an email and that's it. We won't share your details with anyone, and we'll only use them to respond to you.`,
  },
  {
    title: "Intellectual property",
    content: `The Bible verses displayed on this site are from the World English Bible (WEB), which is in the public domain — free for anyone to use. The site's design, copy, code, and branding are owned by Anthony Kariuki. You're welcome to share results and link to the site, but please don't reproduce the site's content or design as your own.`,
  },
  {
    title: "Third-party services",
    content: `This site uses a small number of third-party services to function: Vercel for hosting, Google Analytics / Vercel Analytics for anonymous visitor statistics, and Resend for contact form emails. Each of these has their own privacy and terms policies. We don't sell your data to anyone.`,
  },
  {
    title: "Disclaimer",
    content: `This site is provided as-is, free of charge. We make no guarantees about uptime, accuracy, or completeness. We're not liable for any decisions — theological, personal, or otherwise — made based on results from this tool. Use your own judgement, and when it matters, check the source yourself.`,
  },
  {
    title: "Changes to these terms",
    content: `We may update these terms occasionally. If we make significant changes we'll update the date at the bottom of this page. Continuing to use the site after changes means you're okay with them.`,
  },
  {
    title: "Questions?",
    content: `If anything here is unclear or you have a question, just get in touch via the contact page — we're happy to explain anything in plain English.`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      {/* ── Nav ── */}
      <nav style={{
        background: "rgba(245,241,232,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.inkFt}`,
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: 16,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <LogoMark />
          <span style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, fontWeight: 600, letterSpacing: "-.2px" }}>
            Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} style={{
              padding: "6px 12px", fontSize: 13.5, fontWeight: 500,
              color: T.inkMid, textDecoration: "none", borderRadius: 8,
              whiteSpace: "nowrap", fontFamily: T.sans,
            }}>
              {l.label}
            </Link>
          ))}
          <Link href="/" style={{
            marginLeft: 6, padding: "7px 16px", background: T.blue,
            color: "white", fontSize: 13.5, fontWeight: 600,
            textDecoration: "none", borderRadius: 10, whiteSpace: "nowrap",
          }}>
            Search
          </Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <section style={{
        background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`,
        padding: "72px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{
            fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 58px)",
            fontWeight: 400, color: "white", lineHeight: 1.15,
            letterSpacing: "-1px", marginBottom: 16,
          }}>
            Terms of <em style={{ color: "#A8C4F0" }}>Use</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Written in plain English. No legalese, no tricks — just what you need to know.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Last updated */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: 100,
          background: T.parchmentDark, border: `1px solid ${T.inkFt}`,
          fontFamily: T.mono, fontSize: 11, color: T.inkLt,
          letterSpacing: ".06em", marginBottom: 48,
        }}>
          Last updated: February 2026
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{
              paddingBottom: 36,
              marginBottom: 36,
              borderBottom: i < SECTIONS.length - 1 ? `1px solid ${T.inkFt}` : "none",
            }}>
              <h2 style={{
                fontFamily: T.serif,
                fontSize: "clamp(20px, 2.5vw, 26px)",
                fontWeight: 500,
                color: T.ink,
                letterSpacing: "-.3px",
                marginBottom: 12,
                lineHeight: 1.3,
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: T.serif,
                fontSize: 16,
                lineHeight: 1.85,
                color: T.inkMid,
                margin: 0,
              }}>
                {s.content}{" "}
                {s.title === "Questions?" && (
                  <Link href="/contact" style={{ color: T.blue, textDecoration: "none", fontWeight: 500 }}>
                    Contact us →
                  </Link>
                )}
                {s.title === "AI results and accuracy" && (
                  <Link href="/methodology" style={{ color: T.blue, textDecoration: "none", fontWeight: 500 }}>
                    Read our methodology →
                  </Link>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{
            fontSize: 13.5, color: T.inkLt, textDecoration: "none",
            fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to homepage
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: T.parchmentDark,
        borderTop: `1px solid ${T.inkFt}`,
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, margin: 0, letterSpacing: ".06em" }}>
          © 2026 Is it in the Bible? · Built by Anthony Kariuki ·{" "}
          <Link href="/about" style={{ color: T.inkLt }}>About</Link>
          {" · "}
          <Link href="/privacy" style={{ color: T.inkLt }}>Privacy Policy</Link>
          {" · "}
          <Link href="/methodology" style={{ color: T.inkLt }}>Methodology</Link>
        </p>
      </footer>

    </main>
  );
}