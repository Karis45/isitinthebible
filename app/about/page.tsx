// app/about/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  shadowLg:      "0 8px 32px rgba(26,22,18,.12), 0 24px 64px rgba(26,22,18,.08)",
};

const NAV_LINKS = [
  { label: "About",         href: "/about"          },
  { label: "Methodology",   href: "/methodology"    },
  { label: "Browse Topics", href: "/#browse-topics" },
  { label: "Contact",       href: "/contact"        },
];

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

function LogoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <circle cx="17.5" cy="17.5" r="4.5" fill="#1A3A6A" stroke="white" strokeWidth="1.5" />
      <path d="m15.5 17.5 1.5 1.5 3-3" stroke="white" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function SiteNav({ activePath }: { activePath: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [menuOpen]);

  return (
    <nav
      ref={navRef}
      style={{ background: "rgba(245,241,232,0.96)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid ${T.inkFt}`, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, gap: 16 }}
      aria-label="Primary navigation"
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <LogoMark />
        <span style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, fontWeight: 600, letterSpacing: "-.2px" }}>
          Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="about-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {NAV_LINKS.map((l) => (
          <Link key={l.label} href={l.href} style={{ padding: "6px 12px", fontSize: 13.5, fontWeight: 500, color: l.href === activePath ? T.blue : T.inkMid, textDecoration: "none", borderRadius: 8, background: l.href === activePath ? T.blueLt : "transparent", whiteSpace: "nowrap", fontFamily: T.sans }}>
            {l.label}
          </Link>
        ))}
        <Link href="/" style={{ marginLeft: 6, padding: "7px 16px", background: T.blue, color: "white", fontSize: 13.5, fontWeight: 600, textDecoration: "none", borderRadius: 10, whiteSpace: "nowrap", fontFamily: T.sans }}>
          Search
        </Link>
      </div>

      {/* Hamburger — mobile only */}
      <button
        className="about-ham-btn"
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        aria-controls="about-mobile-nav"
        style={{ display: "none", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 4, width: 36, height: 36, background: "transparent", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, flexShrink: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display: "block", width: 18, height: 1.5, background: T.ink, borderRadius: 2, transition: "transform .2s, opacity .2s",
            ...(menuOpen && i === 0 ? { transform: "rotate(45deg) translate(5px, 4px)" } : {}),
            ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
            ...(menuOpen && i === 2 ? { transform: "rotate(-45deg) translate(5px, -4px)" } : {}),
          }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav id="about-mobile-nav" aria-label="Mobile navigation" style={{ position: "absolute", top: "calc(100% + 8px)", right: 16, width: 220, background: "white", borderRadius: 14, border: `1px solid ${T.inkFt}`, boxShadow: T.shadowLg, overflow: "hidden", zIndex: 100 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: l.href === activePath ? 600 : 500, color: l.href === activePath ? T.blue : T.inkMid, textDecoration: "none", fontFamily: T.sans, background: l.href === activePath ? T.blueLt : "transparent", transition: "background .12s, color .12s" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: T.inkFt, margin: "2px 0" }} />
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: 600, color: T.blue, textDecoration: "none", fontFamily: T.sans, transition: "background .12s" }}>
            🔍 Search
          </Link>
          <a href="https://ko-fi.com/isitinthebible" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: 500, color: T.inkMid, textDecoration: "none", fontFamily: T.sans, transition: "background .12s, color .12s" }}>
            ☕ Donate
          </a>
        </nav>
      )}

      <style>{`
        @media (max-width: 640px) {
          .about-desktop-nav { display: none !important; }
          .about-ham-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

export default function AboutPage() {
  return (
    <main style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      <SiteNav activePath="/about" />

      {/* ── Hero ── */}
      <section style={{ background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`, padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 20 }}>
            Our Story
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 400, color: "white", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 24 }}>
            Built on a moment of<br />
            <em style={{ color: "#A8C4F0" }}>honest realisation</em>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Millions of people quote the Bible daily — without realising the words
            they&apos;re quoting simply aren&apos;t there. This tool exists to change that.
          </p>
        </div>
      </section>

      {/* ── Founder story ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>

        {/* Founder photo + name card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 52 }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%", overflow: "hidden",
            border: `4px solid ${T.blue}`,
            boxShadow: "0 8px 32px rgba(26,58,106,.18)",
            flexShrink: 0,
            marginBottom: 18,
            position: "relative",
          }}>
            <Image
              src="/Anthony.png"
              alt="Anthony Kariuki — Founder of Is it in the Bible?"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 18, color: T.ink, marginBottom: 4 }}>
              Anthony Kariuki
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, letterSpacing: ".08em", textTransform: "uppercase" }}>
              Founder, Is it in the Bible?
            </div>
          </div>
        </div>

        {/* Pull quote */}
        <div style={{ borderLeft: `4px solid ${T.blue}`, paddingLeft: 28, marginBottom: 56 }}>
          <p style={{ fontFamily: T.serif, fontSize: "clamp(22px, 3vw, 30px)", color: T.ink, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>
            &ldquo;I used to quote phrases I was certain were Scripture.
            The day I discovered they weren&apos;t — I felt both embarrassed
            and deeply curious. How many others were doing the same?&rdquo;
          </p>
        </div>

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

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Mission ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 16 }}>
          Our Mission
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, color: T.ink, lineHeight: 1.2, letterSpacing: "-.5px", marginBottom: 32 }}>
          Bible clarity for everyone,<br />
          <span style={{ color: T.blue }}>without exception.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          {[
            { icon: "📖", title: "Rooted in the Text",    body: "Every verdict is grounded in all 31,102 verses of the World English Bible — a modern, accurate, fully public-domain translation. No paraphrases. No interpretations. The text itself." },
            { icon: "⚖️", title: "Non-Denominational",    body: "We don't take sides. Whether you're Catholic, Protestant, Orthodox, or simply curious — the analysis is the same. We report what the text says, not what any tradition prefers." },
            { icon: "🔍", title: "Academically Honest",   body: "Some things are directly stated. Others are inferred. Others are pure cultural myths. We distinguish between them clearly, with five precise classifications and a biblical confidence score." },
            { icon: "🌍", title: "Free for Everyone",     body: "Biblical fact-checking shouldn't be locked behind paywalls or gatekept by institutions. This tool is and will always be free to use for anyone with an internet connection." },
          ].map((card) => (
            <div key={card.title} style={{ padding: "24px", borderRadius: 16, background: "white", border: `1px solid ${T.inkFt}` }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontFamily: T.serif, fontSize: 14.5, lineHeight: 1.7, color: T.inkMid, margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── By the numbers ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLt, marginBottom: 40 }}>
          What powers this
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { number: "31,102", label: "Bible verses analyzed" },
            { number: "5",      label: "Classification levels"  },
            { number: "1",      label: "Solo builder"           },
            { number: "∞",      label: "Searches, always free"  },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "28px 20px", borderRadius: 16, background: T.parchmentDark, border: `1px solid ${T.inkFt}`, textAlign: "center" }}>
              <div style={{ fontFamily: T.serif, fontSize: 42, fontWeight: 400, color: T.blue, lineHeight: 1, marginBottom: 8 }}>
                {stat.number}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, letterSpacing: ".06em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: T.inkFt }} />
      </div>

      {/* ── Donate ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ background: `linear-gradient(135deg, ${T.blue} 0%, #0F2347 100%)`, borderRadius: 24, padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🕊️</div>
            <h3 style={{ fontFamily: T.serif, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, color: "white", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-.5px" }}>
              Help keep this free
            </h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
              This tool is built and maintained by one person, powered by AI and
              a conviction that Scripture should be accessible and honest.
              If it&apos;s helped you, consider supporting it.
            </p>
            <a href="https://ko-fi.com/isitinthebible" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 10, background: "#F5ECD2", color: T.blue, textDecoration: "none", fontFamily: T.sans, fontSize: 15, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
              ☕ Buy me a coffee
            </a>
            <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.4)", fontFamily: T.mono }}>
              Via Ko-fi · No account needed
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: T.serif, fontSize: 18, color: T.inkMid, marginBottom: 24, fontStyle: "italic" }}>
          Ready to find out what&apos;s really in Scripture?
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 10, background: T.blue, color: "white", textDecoration: "none", fontFamily: T.sans, fontSize: 15, fontWeight: 700 }}>
          <LogoIcon size={16} /> Start Searching
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.parchmentDark, borderTop: `1px solid ${T.inkFt}`, padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, margin: 0, letterSpacing: ".06em" }}>
          © 2026 Is it in the Bible? · Built by Anthony Kariuki ·{" "}
          <Link href="/privacy" style={{ color: T.inkLt }}>Privacy Policy</Link>
          {" · "}
          <Link href="/methodology" style={{ color: T.inkLt }}>Methodology</Link>
          {" · "}
          <Link href="/#browse-topics" style={{ color: T.inkLt }}>Browse Topics</Link>
        </p>
      </footer>

    </main>
  );
}