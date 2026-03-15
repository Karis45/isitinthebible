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

// ─── Slug helper (must match cacheKey in route.ts) ────────────────────────────
function queryToSlug(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

const scoreToWidth = (s: number) => `${((s - 1) / 4) * 88 + 6}%`;
const scoreToColor = (s: number) => {
  if (s <= 1) return "#E88080";
  if (s <= 2) return "#E8AA60";
  if (s <= 3) return "#F0C040";
  if (s <= 4) return "#7EC8A0";
  return "#5CC88A";
};

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

function ShareButton({ query }: { query: string }) {
  const [copied, setCopied] = useState(false);

  const handle = () => {
    // Use /topic/ URL for sharing — clean, SEO-friendly, directly linkable
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/topic/${queryToSlug(query)}`
      : "";
    if (navigator.share) {
      navigator.share({
        title: "Is it in the Bible?",
        text: `I just checked: "${query}" — is it actually in the Bible?`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 10,
        border: `1px solid rgba(255,255,255,.25)`,
        background: "rgba(255,255,255,.12)", color: "white",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: T.sans, transition: "background .15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.22)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.12)"; }}
      aria-label="Share this result"
    >
      {copied ? "✓ Copied!" : "🔗 Share"}
    </button>
  );
}

// ─── Inline "search again" footer ─────────────────────────────────────────────
function SearchAgainFooter({ onSearch, onClose }: { onSearch: (q: string) => void; onClose: () => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onClose();
    setTimeout(() => onSearch(value.trim()), 50);
  };

  return (
    <div style={{
      padding: "14px 20px",
      background: T.parchmentDark,
      borderTop: `1px solid ${T.inkFt}`,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <label htmlFor="modal-search-again" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            Search again
          </label>
          <input
            id="modal-search-again"
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder="Search another phrase or belief…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            style={{
              width: "100%", height: 40, padding: "0 12px",
              borderRadius: 10, border: `1.5px solid ${T.inkFt}`,
              background: T.white, fontFamily: T.sans, fontSize: 13.5,
              color: T.ink, outline: "none", boxSizing: "border-box",
              transition: "border-color .15s",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.blue; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.inkFt; }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          style={{
            height: 40, padding: "0 16px", borderRadius: 10,
            border: "none", background: value.trim() ? T.blue : T.inkFt,
            color: "white", fontFamily: T.sans, fontSize: 13, fontWeight: 600,
            cursor: value.trim() ? "pointer" : "default",
            transition: "background .15s", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}
          aria-label="Search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span>Search</span>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.inkLt, letterSpacing: ".08em" }}>📖 World English Bible · Public Domain</div>
        <button
          className="footer-close"
          onClick={onClose}
          style={{ minHeight: 36, padding: "0 14px", border: `1px solid ${T.inkFt}`, borderRadius: 10, background: "transparent", fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.inkMid, cursor: "pointer", transition: "border-color .15s" }}
        >
          Close
        </button>
      </div>
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const tabBarRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) setActiveTab("verdict");
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
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [result, onClose]);

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
        @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
        .modal-scroll::-webkit-scrollbar { width:5px; }
        .modal-scroll::-webkit-scrollbar-track { background:transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background:${T.inkFt}; border-radius:10px; }
        .tab-bar::-webkit-scrollbar { display:none; }
        @media (max-width:600px) {
          .modal-shell     { max-height:100dvh !important; border-radius:0 !important; }
          .modal-hero      { padding:16px 16px 14px !important; }
          .modal-score-bar { display:none !important; }
          .stats-grid      { grid-template-columns:1fr !important; }
          .misquote-grid   { grid-template-columns:1fr !important; }
        }
        .verse-card:hover   { border-color:${T.blue} !important; }
        .related-pill:hover { border-color:${T.blue} !important; background:${T.blueLt} !important; }
        .close-btn:hover    { background:rgba(255,255,255,.22) !important; }
        .footer-close:hover { border-color:${T.inkMid} !important; }
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
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <ClassBadge classification={result.classification} />
                  <ShareButton query={result.query} />
                </div>
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
                  <div key={`${node.year}-${i}`} style={{ display:"flex", gap:16 }}>
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
                      <button key={t.query} className="related-pill" onClick={() => { onClose(); setTimeout(() => onSearch(t.query), 50); }} style={{ padding:"9px 14px", border:`1px solid ${T.inkFt}`, borderRadius:100, background:T.parchment, cursor:"pointer", fontFamily:T.sans, transition:"border-color .15s, background .15s" }}>
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

          {/* ── Footer with inline search ── */}
          <SearchAgainFooter onSearch={onSearch} onClose={onClose} />

        </div>
      </div>
    </>
  );
}