"use client";

import { useState, useEffect, useRef } from "react";

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

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  parchment: "#F5F1E8", parchmentDark: "#EDE8DA", white: "#FFFFFF",
  ink: "#1A1612", inkMid: "#4A3F35", inkLt: "#8A7D72", inkFt: "#D8D0C4",
  blue: "#1A3A6A", blueMid: "#2A5298", blueLt: "#EEF2FA",
  green: "#1A5C38", greenLt: "#EBF5EF", red: "#7A1A1A", redLt: "#FEF0F0",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
};

const BADGE_CONFIG: Record<Classification, { bg: string; text: string; border: string; dot: string; label: string; icon: string }> = {
  "Directly Stated":  { bg: "#EBF5EF", text: "#1A5C38", border: "#A8D4B8", dot: "#1A5C38", label: "Directly Stated",  icon: "📖" },
  "Concept Present":  { bg: "#F5ECD2", text: "#7A5A00", border: "#D4B870", dot: "#B8860B", label: "Concept Present",  icon: "💡" },
  "Inferred":         { bg: "#FEF0E6", text: "#8A3A00", border: "#E8C4A0", dot: "#8A3A00", label: "Inferred",         icon: "🔍" },
  "Cultural":         { bg: "#FEF0F0", text: "#7A1A1A", border: "#E8BEBE", dot: "#7A1A1A", label: "Not in the Bible", icon: "❌" },
  "Church Tradition": { bg: "#F3EEF8", text: "#4A1A7A", border: "#C8A8E8", dot: "#4A1A7A", label: "Church Tradition", icon: "⛪" },
};

const scoreToWidth = (s: number) => `${((s - 1) / 4) * 88 + 6}%`;
const scoreToColor = (s: number) => {
  if (s <= 1) return "#E88080";
  if (s <= 2) return "#E8AA60";
  if (s <= 3) return "#F0C040";
  if (s <= 4) return "#7EC8A0";
  return "#5CC88A";
};

// ─── Site URL ─────────────────────────────────────────────────────────────────
const SITE_URL    = "https://isitinthebible.com";
const SITE_HANDLE = "@isitinthebible";

type TabId = "verdict" | "verses" | "history" | "analysis";

function ClassBadge({ classification }: { classification: Classification }) {
  const b = BADGE_CONFIG[classification] ?? BADGE_CONFIG["Cultural"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: b.bg, color: b.text, border: `1px solid ${b.border}`, fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>
      <span style={{ fontSize: 13 }}>{b.icon}</span>
      {b.label}
    </span>
  );
}

// ─── Share helpers ────────────────────────────────────────────────────────────
function buildShareText(query: string, classification: Classification, oneLiner: string): string {
  const b = BADGE_CONFIG[classification] ?? BADGE_CONFIG["Cultural"];
  return `${b.icon} Is "${query}" in the Bible?\n\nVerdict: ${b.label}\n\n${oneLiner}\n\nFind out what's really in Scripture 👇\n${SITE_URL}`;
}

function buildShareUrl(query: string): string {
  return `${SITE_URL}/?q=${encodeURIComponent(query)}`;
}

// ─── Share Menu ───────────────────────────────────────────────────────────────
function ShareMenu({
  result,
  onClose,
  triggerRef,
}: {
  result: BibleResult;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const ref        = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const shareText  = buildShareText(result.query, result.classification, result.oneLiner);
  const shareUrl   = buildShareUrl(result.query);
  const encoded    = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const badge      = BADGE_CONFIG[result.classification] ?? BADGE_CONFIG["Cultural"];

  // Close on outside click — skip the trigger button to avoid toggle flicker
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current && !ref.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose, triggerRef]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Social platform rows — 2-col grid layout
  const socials = [
    {
      label: "X / Twitter",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      color: "#000000",
      bg: "#F5F5F5",
      href: `https://twitter.com/intent/tweet?text=${encoded}&via=${SITE_HANDLE.replace("@", "")}`,
    },
    {
      label: "Facebook",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
      color: "#1877F2",
      bg: "#EEF4FF",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encoded}`,
    },
    {
      label: "WhatsApp",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
      color: "#25D366",
      bg: "#EDFBF3",
      href: `https://wa.me/?text=${encoded}`,
    },
    {
      label: "Email",
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
      color: "#4A3F35",
      bg: "#F5F1E8",
      href: `mailto:?subject=${encodeURIComponent(`Is "${result.query}" in the Bible?`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: "absolute", bottom: "calc(100% + 10px)", right: 0,
        width: 292, background: T.white, borderRadius: 16,
        border: `1px solid ${T.inkFt}`,
        boxShadow: "0 12px 40px rgba(26,22,18,.18), 0 0 0 1px rgba(26,22,18,.06)",
        padding: 12, zIndex: 20,
      }}
    >
      {/* ── Post preview ── */}
      <div style={{
        background: T.parchment, borderRadius: 10, padding: "10px 12px",
        marginBottom: 10, border: `1px dashed ${T.inkFt}`,
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.inkLt, marginBottom: 6 }}>
          Post Preview
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 13 }}>{badge.icon}</span>
          <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.ink }}>
            Is &ldquo;{result.query}&rdquo; in the Bible?
          </span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 100, background: badge.bg, border: `1px solid ${badge.border}` }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: badge.dot, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: T.mono, fontSize: 9.5, fontWeight: 600, color: badge.text }}>{badge.label}</span>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.blue, marginTop: 6 }}>
          {SITE_URL.replace("https://", "")}
        </div>
      </div>

      {/* ── 2-col social grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 8 }}>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 8px", borderRadius: 9, textDecoration: "none",
              background: s.bg, color: s.color,
              fontFamily: T.sans, fontSize: 12, fontWeight: 600,
              border: "1px solid transparent",
              transition: "filter .12s, border-color .12s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(.93)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}
          >
            {s.icon}
            {s.label}
          </a>
        ))}
      </div>

      {/* ── Primary CTA: copy link ── */}
      <button
        onClick={handleCopy}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 9, border: "none",
          background: copied ? T.greenLt : T.blueLt,
          color: copied ? T.green : T.blue,
          fontFamily: T.sans, fontSize: 13, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8,
          transition: "background .2s, color .2s",
        }}
      >
        {copied
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        }
        {copied ? "Copied!" : "Copy Direct Link"}
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface ResultsModalProps {
  result: BibleResult | null;
  onClose: () => void;
  onSearch: (q: string) => void;
}

export default function ResultsModal({ result, onClose, onSearch }: ResultsModalProps) {
  const [activeTab, setActiveTab]       = useState<TabId>("verdict");
  const [tabsOverflow, setTabsOverflow] = useState(false);
  const [showShare, setShowShare]       = useState(false);
  const overlayRef      = useRef<HTMLDivElement>(null);
  const tabBarRef       = useRef<HTMLDivElement>(null);
  const shareTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (result) { setActiveTab("verdict"); setShowShare(false); }
  }, [result]);

  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;
    const check = () => setTabsOverflow(el.scrollWidth > el.clientWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [result]);

  useEffect(() => {
    if (!result) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (showShare) setShowShare(false); else onClose(); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [result, onClose, showShare]);

  useEffect(() => {
    document.body.style.overflow = result ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [result]);

  if (!result) return null;

  const TABS: { id: TabId; label: string }[] = [
    { id: "verdict",  label: "📊 Verdict"  },
    { id: "verses",   label: "📖 Verses"   },
    { id: "history",  label: "🕰 History"  },
    { id: "analysis", label: "🎓 Analysis" },
  ];

  return (
    <>
      <style>{`
        @keyframes modalIn   { from { opacity:0; transform:translateY(24px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes shareIn   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
        .modal-scroll::-webkit-scrollbar { width:5px; }
        .modal-scroll::-webkit-scrollbar-track { background:transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background:${T.inkFt}; border-radius:10px; }
        .tab-bar::-webkit-scrollbar { display:none; }
        @media (max-width:600px) {
          .modal-shell      { max-height:100dvh !important; border-radius:0 !important; }
          .modal-hero       { padding:16px 16px 14px !important; }
          .modal-score-bar  { display:none !important; }
          .stats-grid       { grid-template-columns:1fr !important; }
          .misquote-grid    { grid-template-columns:1fr !important; }
          .share-grid       { grid-template-columns:1fr 1fr !important; }
        }
        .verse-card:hover    { border-color:${T.blue} !important; }
        .related-pill:hover  { border-color:${T.blue} !important; background:${T.blueLt} !important; }
        .close-btn:hover     { background:rgba(255,255,255,.22) !important; }
        .share-trigger:hover { background:${T.blueMid} !important; }
        .footer-close:hover  { border-color:${T.inkMid} !important; }
      `}</style>

      <div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(26,22,18,.72)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", animation:"overlayIn .2s ease" }}
        role="dialog" aria-modal="true" aria-label={`Analysis results for: ${result.query}`}
      >
        <div className="modal-shell" style={{ width:"100%", maxWidth:760, maxHeight:"92dvh", background:T.parchment, borderRadius:20, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 32px 80px rgba(26,22,18,.4), 0 0 0 1px rgba(26,22,18,.08)", animation:"modalIn .28s cubic-bezier(.4,0,.2,1)" }}>

          {/* ── Hero ── */}
          <div className="modal-hero" style={{ background:`linear-gradient(135deg,${T.blue} 0%,#0F2347 100%)`, padding:"28px 28px 22px", position:"relative", overflow:"hidden", flexShrink:0 }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.04)", pointerEvents:"none" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:14 }}>
                <ClassBadge classification={result.classification} />
                <button className="close-btn" onClick={onClose} aria-label="Close results" style={{ width:36, height:36, borderRadius:8, border:"none", background:"rgba(255,255,255,.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .15s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <h2 style={{ fontFamily:T.serif, fontSize:"clamp(20px,4vw,30px)", fontWeight:400, color:"white", lineHeight:1.2, letterSpacing:"-.5px", marginBottom:8 }}>{result.query}</h2>
              <p style={{ fontFamily:T.sans, fontSize:13.5, color:"rgba(255,255,255,.7)", lineHeight:1.6, marginBottom:18, maxWidth:520 }}>{result.oneLiner}</p>
              <div className="modal-score-bar">
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontFamily:T.mono, fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,.4)" }}>← Less Biblical</span>
                  <span style={{ fontFamily:T.mono, fontSize:9, color:"rgba(255,255,255,.55)" }}>Score: {result.explicitnessScore} / 5 &nbsp; More Biblical →</span>
                </div>
                <div style={{ height:6, borderRadius:100, background:"rgba(255,255,255,.15)", position:"relative" }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:scoreToWidth(result.explicitnessScore), background:scoreToColor(result.explicitnessScore), borderRadius:100, transition:"width .6s cubic-bezier(.4,0,.2,1)", boxShadow:"0 0 8px rgba(255,255,255,.2)" }} />
                </div>
                <div style={{ display:"flex", marginTop:4 }}>
                  {["1·Cultural","2·Tradition","3·Inferred","4·Concept","5·Stated"].map((l, i, arr) => (
                    <span key={l} style={{ fontFamily:T.mono, fontSize:7.5, color:"rgba(255,255,255,.3)", flex:1, textAlign: i === 0 ? "left" : i === arr.length - 1 ? "right" : "center" }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div style={{ position:"relative", background:T.white, borderBottom:`1px solid ${T.inkFt}`, flexShrink:0 }}>
            <div ref={tabBarRef} className="tab-bar" role="tablist" aria-label="Result sections" style={{ display:"flex", gap:2, padding:"10px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
              {TABS.map(({ id, label }) => {
                const isActive = activeTab === id;
                return (
                  <button key={id} role="tab" aria-selected={isActive} aria-controls={`tabpanel-${id}`} id={`tab-${id}`} onClick={() => setActiveTab(id)} style={{ minHeight:44, padding:"0 14px", border:"none", borderRadius:"8px 8px 0 0", cursor:"pointer", fontFamily:T.sans, fontSize:13, fontWeight:isActive?600:400, background:isActive?T.blue:"transparent", color:isActive?"white":T.inkMid, transition:"all .15s", whiteSpace:"nowrap", marginBottom:-1, flexShrink:0 }}>{label}</button>
                );
              })}
            </div>
            {tabsOverflow && <div aria-hidden="true" style={{ position:"absolute", right:0, top:0, bottom:0, width:40, pointerEvents:"none", background:`linear-gradient(to right,transparent,${T.white})` }} />}
          </div>

          {/* ── Tab panels ── */}
          <div className="modal-scroll" style={{ overflowY:"auto", flex:1, background:T.white }}>

            {activeTab === "verdict" && (
              <div role="tabpanel" id="tabpanel-verdict" aria-labelledby="tab-verdict" style={{ padding:"20px" }}>
                <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:16 }}>
                  {[
                    { label:"Origin Era",            value:result.originEra,            accent:false },
                    { label:"Closest Theme",         value:result.closestBiblicalTheme, accent:false },
                    { label:"Search Popularity",     value:result.searchPopularity,     accent:false },
                    { label:"Theological Consensus", value:result.theologicalConsensus, accent:true  },
                  ].map((s) => (
                    <div key={s.label} style={{ padding:"12px 14px", borderRadius:12, background:T.parchment, border:`1px solid ${T.inkFt}` }}>
                      <div style={{ fontFamily:T.mono, fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:T.inkLt, marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontFamily:T.serif, fontSize:15, fontWeight:600, color:s.accent?T.green:T.ink, lineHeight:1.2 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="misquote-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  <div style={{ padding:14, borderRadius:12, background:T.redLt, border:"1px solid #E8BEBE" }}>
                    <div style={{ fontFamily:T.mono, fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:T.red, marginBottom:8 }}>❌ Common Claim</div>
                    <p style={{ fontFamily:T.serif, fontSize:14, lineHeight:1.55, color:T.ink, fontStyle:"italic", margin:0 }}>{result.misquoteWhat}</p>
                  </div>
                  <div style={{ padding:14, borderRadius:12, background:T.greenLt, border:"1px solid #A8D4B8" }}>
                    <div style={{ fontFamily:T.mono, fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:T.green, marginBottom:8 }}>✓ What It Actually Says</div>
                    <p style={{ fontFamily:T.serif, fontSize:14, lineHeight:1.55, color:T.ink, margin:0 }}>{result.misquoteReality}</p>
                  </div>
                </div>
                <div style={{ padding:"14px 16px", borderRadius:12, background:T.blueLt, border:"1px solid #C0D4F0", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>🎓</span>
                  <div>
                    <div style={{ fontFamily:T.mono, fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:T.blue, marginBottom:4 }}>Scholarly Confidence</div>
                    <p style={{ fontSize:13, color:T.inkMid, lineHeight:1.65, margin:0 }}>{result.confidenceNote}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "verses" && (
              <div role="tabpanel" id="tabpanel-verses" aria-labelledby="tab-verses" style={{ padding:"20px" }}>
                <p style={{ fontSize:12, color:T.inkLt, marginBottom:14, fontStyle:"italic" }}>From the World English Bible (WEB) — Public Domain translation.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {result.verses.map((v, i) => (
                    <div key={v.ref} className="verse-card" style={{ padding:"16px 18px", borderRadius:14, background:T.parchment, border:`1px solid ${T.inkFt}`, transition:"border-color .15s" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <span style={{ width:22, height:22, borderRadius:6, background:T.blue, color:"white", fontFamily:T.mono, fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</span>
                        <span style={{ fontFamily:T.serif, fontWeight:700, fontSize:15 }}>{v.ref}</span>
                        <span style={{ fontFamily:T.mono, fontSize:9, background:T.greenLt, color:T.green, border:"1px solid #A8D4B8", borderRadius:4, padding:"1px 6px" }}>WEB</span>
                      </div>
                      <p style={{ fontFamily:T.serif, fontSize:15, lineHeight:1.75, color:T.ink, fontStyle:"italic", marginBottom:8 }}>"{v.text}"</p>
                      <p style={{ fontSize:13, color:T.inkMid, lineHeight:1.65, margin:0 }}>{v.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div role="tabpanel" id="tabpanel-history" aria-labelledby="tab-history" style={{ padding:"20px" }}>
                {result.timeline.map((node, i) => (
                  <div key={node.year} style={{ display:"flex", gap:16 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:20 }}>
                      <div style={{ width:12, height:12, borderRadius:"50%", marginTop:4, flexShrink:0, background:i===0?T.blue:T.white, border:`2px solid ${i===0?T.blue:T.inkFt}`, boxShadow:i===0?"0 0 0 3px rgba(26,58,106,.15)":"none" }} />
                      {i < result.timeline.length-1 && <div style={{ width:1, flex:1, background:T.inkFt, minHeight:28 }} />}
                    </div>
                    <div style={{ paddingBottom:24 }}>
                      <div style={{ fontFamily:T.mono, fontSize:11, fontWeight:600, color:T.blue, marginBottom:3 }}>{node.year} — {node.label}</div>
                      <div style={{ fontSize:13.5, color:T.inkMid, lineHeight:1.7 }}>{node.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "analysis" && (
              <div role="tabpanel" id="tabpanel-analysis" aria-labelledby="tab-analysis" style={{ padding:"20px" }}>
                <div style={{ fontFamily:T.serif, fontSize:15.5, lineHeight:1.9, color:T.inkMid, borderLeft:`3px solid ${T.inkFt}`, paddingLeft:18, marginBottom:24 }}>
                  {result.analysis.split("\n\n").map((para, i) => <p key={i} style={{ margin:i>0?"14px 0 0":"0" }}>{para}</p>)}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:9.5, letterSpacing:".12em", textTransform:"uppercase", color:T.inkLt, marginBottom:12 }}>People Also Ask About</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {result.relatedTopics.map((t) => {
                    const rb = BADGE_CONFIG[t.classification] ?? BADGE_CONFIG["Cultural"];
                    return (
                      <button key={t.query} className="related-pill" onClick={() => { onClose(); onSearch(t.query); }} style={{ padding:"9px 14px", border:`1px solid ${T.inkFt}`, borderRadius:100, background:T.parchment, cursor:"pointer", fontFamily:T.sans, transition:"border-color .15s, background .15s" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:rb.dot, flexShrink:0, display:"inline-block" }} />
                          <span style={{ fontSize:13, color:T.ink, fontWeight:500 }}>{t.query}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* ── Footer ── */}
          <div style={{ padding:"12px 20px", background:T.parchmentDark, borderTop:`1px solid ${T.inkFt}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexShrink:0, flexWrap:"wrap" }}>
            <div style={{ fontFamily:T.mono, fontSize:10, color:T.inkLt, letterSpacing:".08em" }}>📖 World English Bible · Public Domain</div>
            <div style={{ display:"flex", gap:8, position:"relative" }}>
              <button className="footer-close" onClick={onClose} style={{ minHeight:44, padding:"0 16px", border:`1px solid ${T.inkFt}`, borderRadius:10, background:"transparent", fontFamily:T.sans, fontSize:13, fontWeight:500, color:T.inkMid, cursor:"pointer", transition:"border-color .15s" }}>Close</button>

              {/* Share trigger */}
              <button
                ref={shareTriggerRef}
                className="share-trigger"
                onClick={() => setShowShare((s) => !s)}
                aria-haspopup="true"
                aria-expanded={showShare}
                style={{ minHeight:44, padding:"0 18px", border:"none", borderRadius:10, background:T.blue, fontFamily:T.sans, fontSize:13, fontWeight:600, color:"white", cursor:"pointer", transition:"background .15s", display:"flex", alignItems:"center", gap:7 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>

              {/* Share dropdown */}
              {showShare && (
                <div style={{ animation:"shareIn .15s ease" }}>
                  <ShareMenu
                    result={result}
                    onClose={() => setShowShare(false)}
                    triggerRef={shareTriggerRef}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}