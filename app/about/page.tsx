// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Is it in the Bible?",
  description:
    "Anthony Kariuki built Is it in the Bible? after realising many phrases he believed were Scripture simply weren't. This is the story behind the mission.",
};

// ─── Design tokens (matches site) ─────────────────────────────────────────────
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
};

export default function AboutPage() {
  return (
    <main style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      {/* ── Nav (matches site header) ── */}
      <nav style={{
        background: "white",
        borderBottom: `1px solid ${T.inkFt}`,
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, background: T.blue, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>📖</div>
          <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, fontWeight: 600 }}>
            Is it in the <em style={{ color: T.blue }}>Bible?</em>
          </span>
        </Link>
        <Link href="/" style={{
          padding: "8px 18px", borderRadius: 8, background: T.blue,
          color: "white", textDecoration: "none", fontSize: 13,
          fontWeight: 600, fontFamily: T.sans,
        }}>
          Search
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`,
        padding: "80px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em",
            textTransform: "uppercase", color: "rgba(255,255,255,.5)",
            marginBottom: 20,
          }}>
            Our Story
          </div>
          <h1 style={{
            fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400, color: "white", lineHeight: 1.15,
            letterSpacing: "-1px", marginBottom: 24,
          }}>
            Built on a moment of<br />
            <em style={{ color: "#A8C4F0" }}>honest realisation</em>
          </h1>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,.7)",
            lineHeight: 1.7, maxWidth: 520, margin: "0 auto",
          }}>
            Millions of people quote the Bible daily — without realising the words
            they&apos;re quoting simply aren&apos;t there. This tool exists to change that.
          </p>
        </div>
      </section>

      {/* ── Founder story ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>

        {/* Pull quote */}
        <div style={{
          borderLeft: `4px solid ${T.blue}`,
          paddingLeft: 28,
          marginBottom: 56,
        }}>
          <p style={{
            fontFamily: T.serif, fontSize: "clamp(22px, 3vw, 30px)",
            color: T.ink, lineHeight: 1.5, fontStyle: "italic",
            margin: 0,
          }}>
            &ldquo;I used to quote phrases I was certain were Scripture.
            The day I discovered they weren&apos;t — I felt both embarrassed
            and deeply curious. How many others were doing the same?&rdquo;
          </p>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: T.blue, display: "flex", alignItems: "center",
              justifyContent: "center", color: "white", fontSize: 16, fontWeight: 700,
              fontFamily: T.serif, flexShrink: 0,
            }}>
              AK
            </div>
            <div>
              <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.ink }}>Anthony Kariuki</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, letterSpacing: ".06em" }}>Founder, Is it in the Bible?</div>
            </div>
          </div>
        </div>

        {/* Story body */}
        <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.9, color: T.inkMid }}>
          <p style={{ marginBottom: 24 }}>
            My name is Anthony Kariuki. I&apos;m an indie developer — not a theologian,
            not a pastor, not a biblical scholar. Just someone who grew up hearing
            certain phrases repeated so often in church, in conversation, in culture,
            that I assumed they must be in the Bible.
          </p>
          <p style={{ marginBottom: 24 }}>
            &ldquo;God helps those who help themselves.&rdquo; I said it with confidence.
            &ldquo;Cleanliness is next to godliness.&rdquo; I nodded along when others quoted it.
            &ldquo;Money is the root of all evil.&rdquo; I had no idea that one was a misquote —
            the Bible actually says <em>the love of money</em> is the root of all evil.
            That single word changes everything.
          </p>
          <p style={{ marginBottom: 24 }}>
            When I finally sat down and searched for these phrases in Scripture,
            I couldn&apos;t find them. The experience was humbling — but also clarifying.
            I hadn&apos;t been reading the Bible. I had been reading <em>culture</em>,
            mistaking it for truth.
          </p>
          <p style={{ marginBottom: 0 }}>
            I built this tool so that anyone — believer or skeptic, scholar or
            curious first-timer — can type any phrase and get an honest, non-partisan
            answer: is it actually in the Bible? No agenda. No denomination. Just
            Scripture, examined with care.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Mission ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{
          fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em",
          textTransform: "uppercase", color: T.inkLt, marginBottom: 16,
        }}>
          Our Mission
        </div>
        <h2 style={{
          fontFamily: T.serif, fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 400, color: T.ink, lineHeight: 1.2,
          letterSpacing: "-.5px", marginBottom: 32,
        }}>
          Bible clarity for everyone,<br />
          <span style={{ color: T.blue }}>without exception.</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          {[
            {
              icon: "📖",
              title: "Rooted in the Text",
              body: "Every verdict is grounded in all 31,102 verses of the World English Bible — a modern, accurate, fully public-domain translation. No paraphrases. No interpretations. The text itself.",
            },
            {
              icon: "⚖️",
              title: "Non-Denominational",
              body: "We don't take sides. Whether you're Catholic, Protestant, Orthodox, or simply curious — the analysis is the same. We report what the text says, not what any tradition prefers.",
            },
            {
              icon: "🔍",
              title: "Academically Honest",
              body: "Some things are directly stated. Others are inferred. Others are pure cultural myths. We distinguish between them clearly, with five precise classifications and a biblical confidence score.",
            },
            {
              icon: "🌍",
              title: "Free for Everyone",
              body: "Biblical fact-checking shouldn't be locked behind paywalls or gatekept by institutions. This tool is and will always be free to use for anyone with an internet connection.",
            },
          ].map((card) => (
            <div key={card.title} style={{
              padding: "24px", borderRadius: 16,
              background: "white", border: `1px solid ${T.inkFt}`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 8 }}>
                {card.title}
              </div>
              <p style={{ fontFamily: T.serif, fontSize: 14.5, lineHeight: 1.7, color: T.inkMid, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto" , padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── By the numbers ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{
          fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em",
          textTransform: "uppercase", color: T.inkLt, marginBottom: 40,
        }}>
          What powers this
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { number: "31,102", label: "Bible verses analyzed" },
            { number: "5",      label: "Classification levels" },
            { number: "1",      label: "Solo builder" },
            { number: "∞",      label: "Searches, always free" },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: "28px 20px", borderRadius: 16,
              background: T.parchmentDark, border: `1px solid ${T.inkFt}`,
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: T.serif, fontSize: 42, fontWeight: 400,
                color: T.blue, lineHeight: 1, marginBottom: 8,
              }}>
                {stat.number}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, letterSpacing: ".06em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Donate ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`,
          borderRadius: 24, padding: "48px 40px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🕊️</div>
            <h3 style={{
              fontFamily: T.serif, fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400, color: "white", lineHeight: 1.2,
              marginBottom: 16, letterSpacing: "-.5px",
            }}>
              Help keep this free
            </h3>
            <p style={{
              fontSize: 15, color: "rgba(255,255,255,.7)",
              lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px",
            }}>
              This tool is built and maintained by one person, powered by AI and
              a conviction that Scripture should be accessible and honest.
              If it&apos;s helped you, consider supporting it.
            </p>
            <a
              href="https://ko-fi.com/isitinthebible"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 10,
                background: "#F5ECD2", color: T.blue,
                textDecoration: "none", fontFamily: T.sans,
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px rgba(0,0,0,.2)",
              }}
            >
              ☕ Buy me a coffee
            </a>
            <p style={{
              marginTop: 16, fontSize: 12,
              color: "rgba(255,255,255,.4)", fontFamily: T.mono,
            }}>
              Via Ko-fi · No account needed
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        maxWidth: 760, margin: "0 auto",
        padding: "0 24px 80px", textAlign: "center",
      }}>
        <p style={{ fontFamily: T.serif, fontSize: 18, color: T.inkMid, marginBottom: 24, fontStyle: "italic" }}>
          Ready to find out what&apos;s really in Scripture?
        </p>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 32px", borderRadius: 10, background: T.blue,
          color: "white", textDecoration: "none",
          fontFamily: T.sans, fontSize: 15, fontWeight: 700,
        }}>
          📖 Start Searching
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: T.parchmentDark,
        borderTop: `1px solid ${T.inkFt}`,
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, margin: 0, letterSpacing: ".06em" }}>
          © {new Date().getFullYear()} Is it in the Bible? · Built by Anthony Kariuki ·{" "}
          <Link href="/privacy" style={{ color: T.inkLt }}>Privacy Policy</Link>
          {" · "}
          <Link href="/methodology" style={{ color: T.inkLt }}>Methodology</Link>
        </p>
      </footer>

    </main>
  );
}