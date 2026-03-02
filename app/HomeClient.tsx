"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ResultsModal from "./ResultsModal";

type Classification =
  | "Directly Stated"
  | "Concept Present"
  | "Inferred"
  | "Cultural"
  | "Church Tradition";

interface BadgeConfig { bg: string; text: string; border: string; dot: string; label: string; icon: string; }
interface Suggestion  { label: string; classification: Classification; }
interface TrendingItem { label: string; badge: Classification; searches: string; }
interface StatItem    { num: string; label: string; icon: string; }
interface HowItWorksStep { step: string; title: string; desc: string; icon: string; }
interface Misquote    { claim: string; verdict: string; classification: Classification; source?: string; note: string; actual?: string; }
interface BibleResult {
  query: string; classification: Classification; explicitnessScore: number; oneLiner: string;
  originEra: string; closestBiblicalTheme: string; searchPopularity: string; theologicalConsensus: string;
  timeline: { year: string; label: string; detail: string }[];
  verses: { ref: string; text: string; context: string }[];
  misquoteWhat: string; misquoteReality: string;
  analysis: string; confidenceNote: string;
  relatedTopics: { query: string; classification: Classification }[];
}

const T = {
  parchment: "#F5F1E8", parchmentDark: "#EDE8DA", white: "#FFFFFF",
  ink: "#1A1612", inkMid: "#4A3F35", inkLt: "#8A7D72", inkFt: "#D8D0C4",
  blue: "#1A3A6A", blueMid: "#2A5298", blueLt: "#EEF2FA",
  green: "#1A5C38", greenLt: "#EBF5EF", red: "#7A1A1A", redLt: "#FEF0F0",
  purpleLt: "#F3EEF8", orangeLt: "#FEF0E6",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'DM Mono', monospace",
  shadowSm: "0 1px 3px rgba(26,22,18,.05), 0 4px 12px rgba(26,22,18,.04)",
  shadowMd: "0 4px 16px rgba(26,22,18,.08), 0 12px 40px rgba(26,22,18,.06)",
  shadowLg: "0 8px 32px rgba(26,22,18,.12), 0 24px 64px rgba(26,22,18,.08)",
};

const BADGE_CONFIG: Record<Classification, BadgeConfig> = {
  "Directly Stated":  { bg: "#EBF5EF", text: "#1A5C38", border: "#A8D4B8", dot: "#1A5C38", label: "Directly Stated",  icon: "📖" },
  "Concept Present":  { bg: "#F5ECD2", text: "#7A5A00", border: "#D4B870", dot: "#B8860B", label: "Concept Present",  icon: "💡" },
  "Inferred":         { bg: "#FEF0E6", text: "#8A3A00", border: "#E8C4A0", dot: "#8A3A00", label: "Inferred",         icon: "🔍" },
  "Cultural":         { bg: "#FEF0F0", text: "#7A1A1A", border: "#E8BEBE", dot: "#7A1A1A", label: "Not in the Bible", icon: "❌" },
  "Church Tradition": { bg: "#F3EEF8", text: "#4A1A7A", border: "#C8A8E8", dot: "#4A1A7A", label: "Church Tradition", icon: "⛪" },
};

const SUGGESTIONS: Suggestion[] = [
  { label: "The Rapture",                         classification: "Church Tradition" },
  { label: "Guardian Angels",                     classification: "Concept Present"  },
  { label: "Purgatory",                           classification: "Church Tradition" },
  { label: "The Trinity",                         classification: "Inferred"         },
  { label: "God helps those who help themselves", classification: "Cultural"          },
  { label: "Cleanliness is next to godliness",    classification: "Cultural"          },
  { label: "Spare the rod, spoil the child",      classification: "Inferred"          },
  { label: "The eye of a needle",                 classification: "Directly Stated"   },
];

const TRENDING: TrendingItem[] = [
  { label: "Manifesting",       badge: "Cultural",         searches: "48K/mo" },
  { label: "Original Sin",      badge: "Directly Stated",  searches: "32K/mo" },
  { label: "Prosperity Gospel", badge: "Inferred",         searches: "27K/mo" },
  { label: "Hell",              badge: "Directly Stated",  searches: "91K/mo" },
  { label: "Soul Sleep",        badge: "Church Tradition", searches: "14K/mo" },
  { label: "Free Will",         badge: "Inferred",         searches: "38K/mo" },
];

const STATS: StatItem[] = [
  { num: "1,189", label: "Bible Chapters",      icon: "📜" },
  { num: "31K+",  label: "Verses Indexed",      icon: "🔍" },
  { num: "66",    label: "Books of the Bible",  icon: "📖" },
  { num: "100%",  label: "Public Domain (WEB)", icon: "🕊️" },
];

const HOW_IT_WORKS: HowItWorksStep[] = [
  { step: "01", title: "You Ask",              icon: "✍️", desc: "Type any phrase, doctrine, or belief — something you've heard in church, online, or attributed to the Bible." },
  { step: "02", title: "AI Reads Every Verse", icon: "🤖", desc: "Our AI scans all 31,102 Bible verses in real-time, cross-referencing your query against the complete World English Bible." },
  { step: "03", title: "You Get the Truth",    icon: "💡", desc: "A clear verdict: Directly Stated, Concept Present, Inferred, Church Tradition, or Not in the Bible — with the actual verses to prove it." },
];

const MISQUOTES: Misquote[] = [
  {
    claim: '"This too shall pass."',
    verdict: "Cultural — Not in the Bible",
    classification: "Cultural",
    source: "Persian Sufi poets, 13th century",
    note: "Beloved phrase, but completely absent from Scripture. Often attributed to King Solomon — he never said it.",
  },
  {
    claim: '"The Lord works in mysterious ways."',
    verdict: "Cultural — Not in the Bible",
    classification: "Cultural",
    source: "William Cowper, hymn 'God Moves in a Mysterious Way' (1773)",
    note: "One of the most confidently quoted 'Bible verses' — written by an 18th-century English poet, not found anywhere in Scripture.",
  },
  {
    claim: '"Hate the sin, love the sinner."',
    verdict: "Cultural — Not in the Bible",
    classification: "Cultural",
    source: "Attributed to Mahatma Gandhi, 'An Autobiography' (1927)",
    note: "Widely used as a biblical principle, especially in theological debates. The phrase originates with Gandhi, not the Bible.",
  },
];

const WHY_IT_MATTERS = [
  {
    icon: "📊",
    stat: "53%",
    label: "The Misquote Problem",
    detail: "Over half of Americans attribute quotes to the Bible that simply aren't there — often repeating them with complete confidence.",
  },
  {
    icon: "📖",
    stat: "#1",
    label: "Widely Owned, Rarely Read",
    detail: "The Bible is the world's best-selling book, yet most people cannot name 5 of its 66 books. Familiarity and knowledge are not the same thing.",
  },
  {
    icon: "⚡",
    stat: "6×",
    label: "Why Accuracy Matters",
    detail: "Misinformation spreads six times faster than corrections online. When false quotes are attributed to Scripture, the damage outlasts the debunk.",
  },
];

const NAV_LINKS = [
  { label: "About",         href: "/about"         },
  { label: "Methodology",   href: "/methodology"   },
  { label: "Browse Topics", href: "#browse-topics" },
  { label: "Contact",       href: "/contact"       },
];

const FOOTER_LINKS = [
  { label: "About",          href: "/about"         },
  { label: "Methodology",    href: "/methodology"   },
  { label: "Privacy Policy", href: "/privacy"       },
  { label: "Terms of Use",   href: "/terms"         },
  { label: "Browse Topics",  href: "#browse-topics" },
  { label: "Contact",        href: "/contact"       },
];

// ── Shared placeholder — short enough to read on 375px mobile ──
const SEARCH_PLACEHOLDER = "Is it really in the Bible? Ask…";

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

function ClassChip({ classification, small }: { classification: string; small?: boolean }) {
  const b = BADGE_CONFIG[classification as Classification] ?? BADGE_CONFIG["Cultural"];
  return (
    <span className="class-chip" style={{ background: b.bg, color: b.text, border: `1px solid ${b.border}`, fontSize: small ? 10 : 11 }}>
      <span style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%", background: b.dot, flexShrink: 0, display: "inline-block" }} />
      {b.label}
    </span>
  );
}

function ClearButton({ onClear, dark = false }: { onClear: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear search"
      style={{
        position: "absolute", right: 56, top: "50%", transform: "translateY(-50%)",
        width: 22, height: 22, borderRadius: "50%",
        background: dark ? "rgba(255,255,255,.2)" : T.inkFt,
        border: "none", cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", padding: 0, transition: "background .15s", zIndex: 2,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = dark ? "rgba(255,255,255,.35)" : T.inkLt; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = dark ? "rgba(255,255,255,.2)" : T.inkFt; }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={dark ? "white" : T.inkMid} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function AdLeaderboard({ id = "ad" }: { id?: string }) {
  return null;
}

function SiteHeader({ onSearch }: { onSearch: (q: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false);
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
    <header ref={headerRef} className={`site-header${scrolled ? " scrolled" : ""}`} role="banner">
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }} aria-label="Is it in the Bible? — Home">
        <LogoMark />
        <span style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: "-.2px", lineHeight: 1.2, whiteSpace: "nowrap" }}>
          Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href}
            style={{ padding: "6px 12px", fontSize: 13.5, fontWeight: 500, color: T.inkMid, textDecoration: "none", borderRadius: 8, transition: "color .15s, background .15s", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = T.blue; (e.currentTarget as HTMLElement).style.background = T.blueLt; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.inkMid; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >{l.label}</a>
        ))}
        <a href="#search"
          style={{ marginLeft: 6, padding: "7px 16px", background: T.blue, color: "white", fontSize: 13.5, fontWeight: 600, textDecoration: "none", borderRadius: 10, transition: "background .15s", whiteSpace: "nowrap" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.blue; }}
        >Search</a>
      </nav>
      <button className="ham-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label="Toggle navigation" aria-controls="mobile-nav">
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
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile navigation" style={{ position: "absolute", top: "calc(100% + 8px)", right: 16, width: 220, background: T.white, borderRadius: 14, border: `1px solid ${T.inkFt}`, boxShadow: T.shadowLg, overflow: "hidden", zIndex: 100 }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: 500, color: T.inkMid, textDecoration: "none", fontFamily: T.sans, transition: "background .12s, color .12s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = T.blueLt; el.style.color = T.blue; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = T.inkMid; }}
            >{l.label}</a>
          ))}
          <div style={{ height: 1, background: T.inkFt, margin: "2px 0" }} />
          <a href="#search" onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: 600, color: T.blue, textDecoration: "none", fontFamily: T.sans, transition: "background .12s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.blueLt; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >🔍 Search</a>
          <a href="https://ko-fi.com/isitinthebible" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 18px", fontSize: 14, fontWeight: 500, color: T.inkMid, textDecoration: "none", fontFamily: T.sans, transition: "background .12s, color .12s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = T.blueLt; el.style.color = T.blue; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = T.inkMid; }}
          >☕ Donate</a>
        </nav>
      )}
    </header>
  );
}

function HeroSection({ onSearch, pending }: { onSearch: (q: string) => void; pending: boolean }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section id="search" className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-bg-lines" aria-hidden="true" />
      <div className="hero-ornament" aria-hidden="true" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="animate-in" style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.inkLt, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
          AI-Powered Biblical Fact-Checker
          <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
        </div>
        <h1 id="hero-heading" className="animate-in-delay-1" style={{ fontFamily: T.serif, fontSize: "clamp(48px, 9vw, 100px)", fontWeight: 300, color: T.ink, lineHeight: 1.05, marginBottom: 20, letterSpacing: "-2px" }}>
          Is it in the <em style={{ fontStyle: "italic", color: T.blue, fontWeight: 400 }}>Bible?</em>
        </h1>
        <p className="animate-in-delay-2" style={{ maxWidth: 540, margin: "0 auto 10px", color: T.ink, fontSize: 18, lineHeight: 1.65, fontFamily: T.serif }}>
          <em>&ldquo;God helps those who help themselves.&rdquo;</em>{" "}
          <span style={{ color: T.red, fontWeight: 600 }}>Not in the Bible.</span>
        </p>
        <p className="animate-in-delay-2" style={{ maxWidth: 500, margin: "0 auto 36px", color: T.inkMid, fontSize: 15, lineHeight: 1.8, fontWeight: 300 }}>
          Millions of phrases get credited to Scripture that never appear there. Our AI reads all 31,000+ verses in seconds and gives you a verdict — with the actual passages to back it up.
        </p>
        <div className="animate-in-delay-3" style={{ marginBottom: 0 }} role="search" aria-label="Search for phrases or beliefs">
          <div className="search-wrapper">
            <label htmlFor="hero-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
              Search for a phrase, belief, or doctrine
            </label>
            <input
              id="hero-input"
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder={SEARCH_PLACEHOLDER}
              autoComplete="off"
              spellCheck={false}
              disabled={pending}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) onSearch(value.trim());
              }}
            />
            {value && (
              <ClearButton onClear={() => { setValue(""); inputRef.current?.focus(); }} />
            )}
            <button className="search-btn" disabled={pending} aria-label={pending ? "Searching…" : "Search"}
              onClick={() => { if (value.trim()) onSearch(value.trim()); }}>
              {pending
                ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              }
            </button>
          </div>
        </div>
        <div className="animate-in-delay-4">
          <div className="suggestions-row" role="list" aria-label="Popular searches" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {SUGGESTIONS.map((s) => {
              const b = BADGE_CONFIG[s.classification];
              return (
                <button key={s.label} role="listitem" className="sugg-pill"
                  onClick={() => { setValue(s.label); onSearch(s.label); }}
                  aria-label={`Search for ${s.label}`}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: b?.dot || "#999", display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="animate-in-delay-5">
          <div className="trust-bar" role="list" aria-label="Trust indicators">
            {[
              { icon: "🤖", text: "AI Reads Every Verse", sub: "All 31,102 — in seconds" },
              { icon: "📖", text: "World English Bible",  sub: "100% Public Domain"      },
              { icon: "🎓", text: "Non-Denominational",   sub: "No bias. Just the text." },
            ].map((t) => (
              <div key={t.text} role="listitem" className="trust-item">
                <span style={{ fontSize: 20 }} aria-hidden="true">{t.icon}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>{t.text}</div>
                  <div style={{ fontSize: 11, color: T.inkLt }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section style={{ background: T.blue, padding: "40px 24px" }} aria-label="Database statistics">
      <div className="stats-row">
        {STATS.map((s) => (
          <div key={s.label} style={{ textAlign: "center", color: "white" }}>
            <div style={{ fontSize: 26, marginBottom: 4 }} aria-hidden="true">{s.icon}</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 600, lineHeight: 1, letterSpacing: "-1px", marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.65)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section" style={{ background: T.white }} id="methodology" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-label">Simple Process</div>
        <h2 id="how-heading" className="section-title" style={{ marginBottom: 12 }}>
          The AI that actually <em style={{ fontStyle: "italic", color: T.blue }}>reads the Bible</em>
        </h2>
        <p style={{ textAlign: "center", color: T.inkMid, fontSize: 15, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 300 }}>
          Not a keyword search. Not a lookup table. A genuine AI analysis of every verse — delivered in seconds.
        </p>
        <ol className="how-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.step} className="card" style={{ position: "relative", overflow: "hidden", textAlign: "center", padding: "32px 24px" }}>
              <div style={{ position: "absolute", top: -8, right: 16, fontFamily: T.serif, fontSize: 76, fontWeight: 700, color: T.parchment, lineHeight: 1, userSelect: "none", pointerEvents: "none" }} aria-hidden="true">{step.step}</div>
              <div style={{ fontSize: 34, marginBottom: 14, display: "inline-block", animation: `float ${2 + i * 0.4}s ease-in-out infinite` }} aria-hidden="true">{step.icon}</div>
              <h3 style={{ fontFamily: T.serif, fontSize: 21, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClassificationLegend() {
  return (
    <section className="section-sm" style={{ background: T.parchment, borderTop: `1px solid ${T.inkFt}`, borderBottom: `1px solid ${T.inkFt}` }} id="classifications" aria-labelledby="legend-heading">
      <div className="container" style={{ textAlign: "center" }}>
        <div className="section-label">Verdict System</div>
        <h2 id="legend-heading" className="section-title" style={{ fontSize: "clamp(22px, 3vw, 32px)", marginBottom: 8 }}>Our 5 Classification Types</h2>
        <p style={{ color: T.inkMid, fontSize: 14.5, maxWidth: 520, margin: "0 auto 4px", lineHeight: 1.75, fontWeight: 300 }}>Every topic receives one of these verdicts, scored on a 1–5 Clarity Scale.</p>
        <div className="legend-row" role="list">
          {(Object.entries(BADGE_CONFIG) as [Classification, BadgeConfig][]).map(([key, b]) => (
            <div key={key} role="listitem" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: b.bg, border: `1px solid ${b.border}`, boxShadow: T.shadowSm }}>
              <span style={{ fontSize: 15 }} aria-hidden="true">{b.icon}</span>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: b.text, fontWeight: 500 }}>{key}</div>
                <div style={{ fontSize: 11.5, color: b.text, fontWeight: 600, lineHeight: 1.2 }}>{b.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingTopics({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <section className="section" id="browse-topics" aria-labelledby="trending-heading">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ justifyContent: "flex-start" }}>🔥 Trending</div>
          <h2 id="trending-heading" style={{ fontFamily: T.serif, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 400, color: T.ink, letterSpacing: "-.5px", lineHeight: 1.15 }}>
            What people are searching <em style={{ fontStyle: "italic", color: T.blue }}>right now</em>
          </h2>
        </div>
        <div className="trending-grid">
          {TRENDING.map((t) => {
            const b = BADGE_CONFIG[t.badge];
            return (
              <button key={t.label} className="card" onClick={() => onSearch(t.label)}
                style={{ textAlign: "left", cursor: "pointer", padding: "18px 20px", border: `1px solid ${T.inkFt}`, borderRadius: 14, background: T.white, fontFamily: T.sans, transition: "all .18s", boxShadow: T.shadowSm, display: "block", width: "100%" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = T.blue; el.style.boxShadow = T.shadowMd; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = T.inkFt; el.style.boxShadow = T.shadowSm; el.style.transform = "none"; }}
                aria-label={`Search for ${t.label} — ${b?.label}`}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <ClassChip classification={t.badge} small />
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkLt }}>{t.searches}</span>
                </div>
                <div style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 500, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{t.label}</div>
                <div style={{ color: T.blue, fontSize: 12, fontWeight: 600 }}>Analyze this →</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MisquotesSection({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <section className="section" style={{ background: T.white }} aria-labelledby="misquotes-heading">
      <div className="container">
        <div className="misquote-two-col">
          <div>
            <div className="section-label" style={{ justifyContent: "flex-start" }}>Eye-openers</div>
            <h2 id="misquotes-heading" style={{ fontFamily: T.serif, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: T.ink, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-.5px" }}>
              The AI <em style={{ fontStyle: "italic", color: T.red }}>surprises</em> even lifelong believers
            </h2>
            <p style={{ color: T.inkMid, fontSize: 15, lineHeight: 1.8, marginBottom: 28, fontWeight: 300, maxWidth: 440 }}>
              These phrases are <strong style={{ color: T.ink }}>passed down through culture, sermons, and social media</strong> — but they&apos;ve never appeared in any Bible translation.
            </p>
            <button onClick={() => onSearch("The Lord works in mysterious ways")}
              style={{ padding: "12px 24px", background: T.blue, color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.sans, transition: "background .2s" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = T.blueMid; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = T.blue; }}
            >Try an Example →</button>
          </div>
          <div className="misquotes-list" role="list" aria-label="Common misquotes">
            {MISQUOTES.map((m) => {
              const b = BADGE_CONFIG[m.classification];
              return (
                <article key={m.claim} role="listitem" className="card" style={{ padding: "18px 20px", borderLeft: `3px solid ${b.dot}` }}>
                  <blockquote style={{ fontFamily: T.serif, fontSize: 16.5, fontStyle: "italic", color: T.ink, lineHeight: 1.4, marginBottom: 9 }}>{m.claim}</blockquote>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <ClassChip classification={m.classification} small />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkLt }}>{m.verdict}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: T.inkMid, lineHeight: 1.6 }}>{m.note}</p>
                  {m.source && <p style={{ fontSize: 11, color: T.inkLt, marginTop: 5, fontStyle: "italic" }}>Source: {m.source}</p>}
                  {m.actual  && <p style={{ fontSize: 12, color: T.green, marginTop: 5, fontWeight: 500 }}>✓ {m.actual}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section className="section" style={{ background: T.parchment, borderTop: `1px solid ${T.inkFt}` }} aria-labelledby="why-heading">
      <div className="container">
        <div className="section-label">Why It Matters</div>
        <h2 id="why-heading" className="section-title" style={{ marginBottom: 12 }}>
          Biblical literacy is in <em style={{ fontStyle: "italic", color: T.red }}>decline</em>
        </h2>
        <p style={{ textAlign: "center", color: T.inkMid, fontSize: 15, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 300 }}>
          The problem isn&apos;t malice — it&apos;s assumption. Most people repeat what they&apos;ve heard, never realising it was never written.
        </p>
        <div className="how-grid" role="list">
          {WHY_IT_MATTERS.map((item) => (
            <div key={item.label} role="listitem" className="card" style={{ textAlign: "center", padding: "36px 28px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">{item.icon}</div>
              <div style={{ fontFamily: T.serif, fontSize: 52, fontWeight: 600, color: T.blue, lineHeight: 1, letterSpacing: "-2px", marginBottom: 10 }}>
                {item.stat}
              </div>
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>
                {item.label}
              </div>
              <p style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.75, fontWeight: 300, margin: 0 }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="section" style={{ background: `linear-gradient(135deg, ${T.blue} 0%, #1A2E58 100%)`, textAlign: "center", position: "relative", overflow: "hidden" }} aria-labelledby="cta-heading">
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,.04) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 28, height: 1, background: "rgba(255,255,255,.2)" }} aria-hidden="true" />
          Free • No Account Required
          <div style={{ width: 28, height: 1, background: "rgba(255,255,255,.2)" }} aria-hidden="true" />
        </div>
        <h2 id="cta-heading" style={{ fontFamily: T.serif, fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 300, color: "white", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-1px" }}>
          Ask the AI anything about <em style={{ fontStyle: "italic" }}>Scripture</em>
        </h2>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15.5, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.75, fontWeight: 300 }}>
          Every verse. Every book. Analyzed in seconds — just type and discover the truth.
        </p>
        <div role="search" aria-label="Search the Bible">
          <div className="search-wrapper">
            <label htmlFor="cta-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Search query</label>
            <input
              id="cta-input"
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder={SEARCH_PLACEHOLDER}
              style={{ border: "2px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.12)", color: "white" }}
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) onSearch(value.trim());
              }}
            />
            {value && (
              <ClearButton onClear={() => { setValue(""); inputRef.current?.focus(); }} dark />
            )}
            <button className="search-btn" style={{ background: "white" }} aria-label="Search"
              onClick={() => { if (value.trim()) onSearch(value.trim()); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const LOADING_STEPS = [
  { icon: "📜", label: "Opening the Scripture…" },
  { icon: "🔍", label: "Scanning Old Testament…" },
  { icon: "✝️",  label: "Scanning New Testament…" },
  { icon: "🤖", label: "Cross-referencing verses…" },
  { icon: "⚖️", label: "Weighing theological context…" },
  { icon: "💡", label: "Forming verdict…" },
];

const LOADING_FACTS = [
  { quote: '"God helps those who help themselves."', verdict: "❌ Not in the Bible", source: "Benjamin Franklin, 1736" },
  { quote: '"This too shall pass."',                 verdict: "❌ Not in the Bible", source: "Persian Sufi poets" },
  { quote: '"Money is the root of all evil."',       verdict: "⚠️ Misquoted",        source: "1 Timothy 6:10 says love of money" },
  { quote: '"The Lord works in mysterious ways."',   verdict: "❌ Not in the Bible", source: "William Cowper, 1773" },
  { quote: '"Cleanliness is next to godliness."',    verdict: "❌ Not in the Bible", source: "John Wesley, 1778" },
];

function LoadingOverlay() {
  const [step, setStep]           = useState(0);
  const [count, setCount]         = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  // Advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Count up verses
  useEffect(() => {
    const target = 31102;
    const duration = 18000; // spread over ~18s
    const increment = Math.ceil(target / (duration / 60));
    const interval = setInterval(() => {
      setCount((c) => {
        const next = c + increment;
        return next >= target ? target : next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Rotate fun facts every 5s with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % LOADING_FACTS.length);
        setFactVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fact = LOADING_FACTS[factIndex];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(16,14,12,.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }} aria-busy="true" aria-label="Analyzing…">

      {/* Title */}
      <div style={{ fontFamily: T.serif, fontSize: "clamp(22px, 4vw, 30px)", color: "white", letterSpacing: "-.3px", marginBottom: 6, textAlign: "center" }}>
        Analyzing <em style={{ fontStyle: "italic", color: "#7BA8E4" }}>Scripture…</em>
      </div>

      {/* Verse counter */}
      <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: ".1em", color: "rgba(255,255,255,.45)", marginBottom: 32, textAlign: "center" }}>
        {count.toLocaleString()} / 31,102 verses scanned
      </div>

      {/* Progress bar */}
      <div style={{ width: "min(480px, 90vw)", height: 3, background: "rgba(255,255,255,.1)", borderRadius: 3, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #3A6AC8, #7BA8E4)", borderRadius: 3, width: `${((step + 1) / LOADING_STEPS.length) * 100}%`, transition: "width 0.6s ease" }} />
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, width: "min(480px, 90vw)" }}>
        {LOADING_STEPS.map((s, i) => {
          const done    = i < step;
          const current = i === step;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i > step ? 0.25 : 1, transition: "opacity 0.4s" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#1A5C38" : current ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.06)", border: done ? "none" : current ? "1.5px solid rgba(255,255,255,.4)" : "1.5px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.4s" }}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                  : <span style={{ fontSize: 12 }}>{s.icon}</span>
                }
              </div>
              <span style={{ fontFamily: T.sans, fontSize: 13.5, color: current ? "white" : done ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.3)", fontWeight: current ? 600 : 400, transition: "color 0.4s" }}>
                {s.label}
              </span>
              {current && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.2)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite", marginLeft: "auto", flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>

      {/* Rotating "Did you know" fact */}
      <div style={{ width: "min(480px, 90vw)", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "16px 20px", opacity: factVisible ? 1 : 0, transition: "opacity 0.4s" }}>
        <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 8 }}>
          Did you know?
        </div>
        <blockquote style={{ fontFamily: T.serif, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginBottom: 8 }}>
          {fact.quote}
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: fact.verdict.startsWith("❌") ? "#F4A0A0" : "#F4D080" }}>
            {fact.verdict}
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: "rgba(255,255,255,.3)" }}>
            — {fact.source}
          </span>
        </div>
      </div>

    </div>
  );
}

function SiteFooter() {
  return (
    <footer style={{ background: T.ink, padding: "48px 24px 28px", textAlign: "center" }} role="contentinfo">
      <div className="container">
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 20 }} aria-label="Is it in the Bible? — Home">
          <LogoMark />
          <span style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, color: "white" }}>
            Is it in the <em style={{ fontStyle: "italic", color: "#7BA8E4" }}>Bible?</em>
          </span>
        </a>
        <nav aria-label="Footer navigation" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 24px", marginBottom: 28 }}>
          {FOOTER_LINKS.map((l) => (
            <a key={l.label} href={l.href}
              style={{ fontSize: 13, color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 500, transition: "color .15s" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "white"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,.5)"; }}
            >{l.label}</a>
          ))}
          <a href="https://ko-fi.com/isitinthebible" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 500, transition: "color .15s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,.5)"; }}
          >☕ Donate</a>
        </nav>
        <div style={{ width: 40, height: 1, background: "rgba(255,255,255,.1)", margin: "0 auto 20px" }} aria-hidden="true" />
        <p style={{ fontFamily: T.mono, fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".05em", lineHeight: 1.8, margin: 0 }}>
          © 2026 IS IT IN THE BIBLE? — ALL RIGHTS RESERVED<br />
          Verses from the World English Bible (WEB) — Public Domain · Powered by AI<br />
          Non-denominational · Non-affiliated · No theological bias
        </p>
      </div>
    </footer>
  );
}

interface HomeClientProps {
  prefetchedResult: BibleResult | null;
  initialQuery: string | null;
}

export default function HomeClient({ prefetchedResult, initialQuery }: HomeClientProps) {
  const [result, setResult]   = useState<BibleResult | null>(prefetchedResult);
  const [error, setError]     = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setResult(null); setError(null); setPending(true);
    setLiveAnnouncement(`Analyzing "${query}" — reading all 31,102 Bible verses…`);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: query.trim() }),
        signal: AbortSignal.timeout(30000),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.error ?? "Something went wrong. Please try again.";
        setError(msg);
        setLiveAnnouncement(`Error: ${msg}`);
      } else {
        const parsed = json.result as BibleResult;
        setResult(parsed);
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("q", query.trim());
          window.history.pushState({}, "", url.toString());
        }
        setLiveAnnouncement(`Analysis complete for "${query}".`);
      }
    } catch (e) {
      const msg = e instanceof Error && e.name === "TimeoutError"
        ? "Request timed out. Please try again."
        : (e as Error).message ?? "Network error. Please try again.";
      setError(msg);
      setLiveAnnouncement(`Error: ${msg}`);
    } finally {
      setPending(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setResult(null);
    setLiveAnnouncement("");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    if (prefetchedResult) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) handleSearch(query);
  }, [handleSearch, prefetchedResult]);

  return (
    <div style={{ background: T.parchment, minHeight: "100vh" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        {liveAnnouncement}
      </div>
      <SiteHeader onSearch={handleSearch} />
      <main id="main-content">
        <HeroSection onSearch={handleSearch} pending={pending} />
        <StatsStrip />
        {error && (
          <div style={{ maxWidth: 640, margin: "20px auto", padding: "14px 16px", background: T.redLt, border: `1px solid #E8C4C4`, borderRadius: 12, fontSize: 14, color: T.red, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 10 }} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span>{error}</span>
          </div>
        )}
        {pending && <LoadingOverlay />}
        <ResultsModal result={result} onClose={handleCloseModal} onSearch={handleSearch} />
        <HowItWorks />
        <ClassificationLegend />
        <TrendingTopics onSearch={handleSearch} />
        <MisquotesSection onSearch={handleSearch} />
        <WhyItMatters />
        <CTABanner onSearch={handleSearch} />
      </main>
      <SiteFooter />
    </div>
  );
}