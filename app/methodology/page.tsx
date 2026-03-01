// app/methodology/page.tsx
"use client";

import type { Metadata } from "next";
import Link from "next/link";
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
  red:           "#7A1A1A",
  redLt:         "#FEF0F0",
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
      phrase: "Christians should not drink alcohol",
      reference: "Ephesians 5:18, Romans 14:21",
      note: "No verse explicitly forbids alcohol — Jesus turned water into wine — but passages on sobriety and not causing others to stumble are used to infer abstinence.",
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
    body: "Our purpose-built biblical AI activates — applying a rigorous academic framework developed specifically for Scripture. It cross-references theology, historical context, and original language nuance to deliver a verdict that a keyword search never could.",
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

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: T.blue,
      borderRadius: Math.round(size * 0.25),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "0 2px 8px rgba(26,58,106,.28)",
    }}>
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
      style={{
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
      }}
      aria-label="Primary navigation"
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <LogoMark />
        <span style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, fontWeight: 600, letterSpacing: "-.2px" }}>
          Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="methodology-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{
              padding: "6px 12px",
              fontSize: 13.5,
              fontWeight: 500,
              color: l.href === activePath ? T.blue : T.inkMid,
              textDecoration: "none",
              borderRadius: 8,
              background: l.href === activePath ? T.blueLt : "transparent",
              whiteSpace: "nowrap",
              fontFamily: T.sans,
            }}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" style={{
          marginLeft: 6,
          padding: "7px 16px",
          background: T.blue,
          color: "white",
          fontSize: 13.5,
          fontWeight: 600,
          textDecoration: "none",
          borderRadius: 10,
          whiteSpace: "nowrap",
          fontFamily: T.sans,
        }}>
          Search
        </Link>
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="methodology-ham-btn"
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        aria-controls="methodology-mobile-nav"
        style={{
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          width: 36,
          height: 36,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 4,
          borderRadius: 8,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display: "block", width: 18, height: 1.5, background: T.ink, borderRadius: 2,
            transition: "transform .2s, opacity .2s",
            ...(menuOpen && i === 0 ? { transform: "rotate(45deg) translate(5px, 4px)" } : {}),
            ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
            ...(menuOpen && i === 2 ? { transform: "rotate(-45deg) translate(5px, -4px)" } : {}),
          }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="methodology-mobile-nav"
          aria-label="Mobile navigation"
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 16,
            width: 220, background: "white", borderRadius: 14,
            border: `1px solid ${T.inkFt}`, boxShadow: T.shadowLg,
            overflow: "hidden", zIndex: 100,
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "12px 18px", fontSize: 14,
                fontWeight: l.href === activePath ? 600 : 500,
                color: l.href === activePath ? T.blue : T.inkMid,
                textDecoration: "none", fontFamily: T.sans,
                background: l.href === activePath ? T.blueLt : "transparent",
                transition: "background .12s, color .12s",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: T.inkFt, margin: "2px 0" }} />
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block", padding: "12px 18px", fontSize: 14,
              fontWeight: 600, color: T.blue, textDecoration: "none",
              fontFamily: T.sans, transition: "background .12s",
            }}
          >
            🔍 Search
          </Link>
          <a
            href="https://ko-fi.com/isitinthebible"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block", padding: "12px 18px", fontSize: 14,
              fontWeight: 500, color: T.inkMid, textDecoration: "none",
              fontFamily: T.sans, transition: "background .12s, color .12s",
            }}
          >
            ☕ Donate
          </a>
        </nav>
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .methodology-desktop-nav { display: none !important; }
          .methodology-ham-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

export default function MethodologyPage() {
  return (
    <main style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      <SiteNav activePath="/methodology" />

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
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
            <div key={c.label} style={{ borderRadius: 16, background: "white", border: `1px solid ${T.inkFt}`, overflow: "hidden" }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 160 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 100, background: T.inkFt, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((c.score - 1) / 4) * 100}%`, background: c.bar, borderRadius: 100 }} />
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, flexShrink: 0 }}>Score {c.score}/5</span>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontFamily: T.serif, fontSize: 15, lineHeight: 1.7, color: T.inkMid, marginBottom: 16 }}>
                  {c.description}
                </p>
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
            <div key={i} style={{
              display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12,
              background: item.icon === "✅" ? T.greenLt : "#FFFBEB",
              border: `1px solid ${item.icon === "✅" ? "#A8D4B8" : "#E8D898"}`,
            }}>
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
          <LogoIcon size={16} /> Try a Search
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.parchmentDark, borderTop: `1px solid ${T.inkFt}`, padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.inkLt, margin: 0, letterSpacing: ".06em" }}>
          © 2026 Is it in the Bible? · Built by Anthony Kariuki ·{" "}
          <Link href="/about" style={{ color: T.inkLt }}>About</Link>
          {" · "}
          <Link href="/privacy" style={{ color: T.inkLt }}>Privacy Policy</Link>
          {" · "}
          <Link href="/#browse-topics" style={{ color: T.inkLt }}>Browse Topics</Link>
        </p>
      </footer>

    </main>
  );
}