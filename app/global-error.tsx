"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0,
        minHeight: "100vh",
        background: "#F5F1E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">⚠️</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 400,
          color: "#1A1612",
          letterSpacing: "-0.5px",
          marginBottom: 12,
          lineHeight: 1.2,
        }}>
          Something went <em style={{ fontStyle: "italic", color: "#7A1A1A" }}>wrong</em>
        </h1>

        <p style={{
          color: "#4A3F35",
          fontSize: 15,
          maxWidth: 420,
          lineHeight: 1.8,
          marginBottom: 32,
          fontWeight: 300,
        }}>
          Our AI had trouble analyzing Scripture just now. This is usually
          temporary — please try again in a moment.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              background: "#1A3A6A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <Link href="/" style={{
            padding: "12px 28px",
            background: "white",
            color: "#1A3A6A",
            textDecoration: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            border: "1.5px solid #D8D0C4",
          }}>
            ← Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}