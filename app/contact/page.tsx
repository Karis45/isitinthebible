"use client";

import { useState, useRef } from "react";

const T = {
  parchment: "#F5F1E8", parchmentDark: "#EDE8DA", white: "#FFFFFF",
  ink: "#1A1612", inkMid: "#4A3F35", inkLt: "#8A7D72", inkFt: "#D8D0C4",
  blue: "#1A3A6A", blueMid: "#2A5298", blueLt: "#EEF2FA",
  green: "#1A5C38", greenLt: "#EBF5EF", red: "#7A1A1A", redLt: "#FEF0F0",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'DM Mono', monospace",
  shadowSm: "0 1px 3px rgba(26,22,18,.05), 0 4px 12px rgba(26,22,18,.04)",
  shadowMd: "0 4px 16px rgba(26,22,18,.08), 0 12px 40px rgba(26,22,18,.06)",
};

type FormStatus = "idle" | "sending" | "success" | "error";

const REASONS = [
  "General question",
  "Report an incorrect result",
  "Suggest a topic",
  "Press / media inquiry",
  "Technical issue",
  "Other",
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 14.5,
  fontFamily: T.sans,
  color: T.ink,
  background: T.white,
  border: `1.5px solid ${T.inkFt}`,
  borderRadius: 10,
  outline: "none",
  transition: "border-color .15s, box-shadow .15s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: T.mono,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: T.inkMid,
  marginBottom: 7,
};

export default function ContactPage() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [reason, setReason]   = useState(REASONS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<FormStatus>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const focusStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focused === field ? T.blue : T.inkFt,
    boxShadow: focused === field ? `0 0 0 3px rgba(26,58,106,.1)` : "none",
  });

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      // Replace with your actual form endpoint (e.g. Formspree, Resend, etc.)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage(""); setReason(REASONS[0]);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ background: T.parchment, minHeight: "100vh", fontFamily: T.sans }}>

      {/* Simple top nav */}
      <header style={{ background: T.parchment, borderBottom: `1px solid ${T.inkFt}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }} aria-label="Is it in the Bible? — Home">
          <LogoMark />
          <span style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: "-.2px", lineHeight: 1.2 }}>
            Is it in the <em style={{ fontStyle: "italic", color: T.blue }}>Bible?</em>
          </span>
        </a>
      </header>

      <main style={{ maxWidth: 620, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 44, textAlign: "center" }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.inkLt, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
            Get in Touch
            <div style={{ width: 28, height: 1, background: T.inkFt }} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 300, color: T.ink, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 14 }}>
            Contact <em style={{ fontStyle: "italic", color: T.blue }}>Us</em>
          </h1>
          <p style={{ color: T.inkMid, fontSize: 15.5, lineHeight: 1.8, fontWeight: 300, maxWidth: 480, margin: "0 auto" }}>
            Found an incorrect result? Have a suggestion? Want to collaborate? We read every message.
          </p>
        </div>

        {/* Success state */}
        {status === "success" ? (
          <div style={{ background: T.greenLt, border: `1.5px solid #A8D4B8`, borderRadius: 16, padding: "36px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 500, color: T.green, marginBottom: 10 }}>Message sent!</h2>
            <p style={{ color: T.inkMid, fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
              Thanks for reaching out. We typically reply within 1–2 business days.
            </p>
            <button
              onClick={() => setStatus("idle")}
              style={{ padding: "10px 22px", background: T.blue, color: "white", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: T.sans }}
            >
              Send another message
            </button>
          </div>
        ) : (
          /* Form card */
          <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.inkFt}`, boxShadow: T.shadowMd, padding: "36px 32px" }}>

            {/* Error banner */}
            {status === "error" && (
              <div style={{ background: T.redLt, border: `1px solid #E8C4C4`, borderRadius: 10, padding: "12px 14px", marginBottom: 24, fontSize: 13.5, color: T.red, display: "flex", alignItems: "center", gap: 9 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            <div style={{ display: "grid", gap: 20 }}>

              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>Name <span style={{ color: T.red }}>*</span></label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    style={focusStyle("name")}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>Email <span style={{ color: T.red }}>*</span></label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={focusStyle("email")}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="contact-reason" style={labelStyle}>Reason for contact</label>
                <select
                  id="contact-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onFocus={() => setFocused("reason")}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...focusStyle("reason"),
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A7D72' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: 38,
                    cursor: "pointer",
                  }}
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" style={labelStyle}>Message <span style={{ color: T.red }}>*</span></label>
                <textarea
                  id="contact-message"
                  placeholder="Tell us what's on your mind…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  style={{
                    ...focusStyle("message"),
                    resize: "vertical",
                    minHeight: 120,
                    lineHeight: 1.65,
                  }}
                />
                <div style={{ textAlign: "right", fontFamily: T.mono, fontSize: 10, color: T.inkLt, marginTop: 5 }}>
                  {message.length} / 2000
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === "sending" || !name.trim() || !email.trim() || !message.trim()}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: (!name.trim() || !email.trim() || !message.trim()) ? T.inkFt : T.blue,
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: T.sans,
                  cursor: (!name.trim() || !email.trim() || !message.trim()) ? "not-allowed" : "pointer",
                  transition: "background .15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
                onMouseEnter={(e) => { if (name.trim() && email.trim() && message.trim()) (e.currentTarget as HTMLElement).style.background = T.blueMid; }}
                onMouseLeave={(e) => { if (name.trim() && email.trim() && message.trim()) (e.currentTarget as HTMLElement).style.background = T.blue; }}
              >
                {status === "sending" ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: T.inkLt, lineHeight: 1.6, margin: 0 }}>
                Prefer email?{" "}
                <a href="mailto:hello@isitinthebible.com" style={{ color: T.blue, textDecoration: "none", fontWeight: 500 }}>
                  hello@isitinthebible.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <a href="/" style={{ fontSize: 13.5, color: T.inkLt, textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "color .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = T.blue; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.inkLt; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to homepage
          </a>
        </div>
      </main>

      {/* Minimal footer */}
      <footer style={{ borderTop: `1px solid ${T.inkFt}`, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: T.mono, fontSize: 10.5, color: T.inkLt, letterSpacing: ".05em", margin: 0 }}>
          © {new Date().getFullYear()} IS IT IN THE BIBLE? — ALL RIGHTS RESERVED
        </p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}