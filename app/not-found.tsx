import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
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
      {/* Large decorative 404 */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(80px, 20vw, 180px)",
        fontWeight: 300,
        color: "#EDE8DA",
        lineHeight: 1,
        marginBottom: -16,
        userSelect: "none",
      }} aria-hidden="true">
        404
      </div>

      {/* Book icon */}
      <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">📖</div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(28px, 5vw, 48px)",
        fontWeight: 400,
        color: "#1A1612",
        letterSpacing: "-0.5px",
        marginBottom: 12,
        lineHeight: 1.2,
      }}>
        This page is not in the <em style={{ fontStyle: "italic", color: "#1A3A6A" }}>Bible</em>
        <br />— or our site.
      </h1>

      <p style={{
        color: "#4A3F35",
        fontSize: 16,
        maxWidth: 420,
        lineHeight: 1.8,
        marginBottom: 36,
        fontWeight: 300,
      }}>
        The page you&apos;re looking for doesn&apos;t exist. But the truth about
        what&apos;s actually in Scripture does — try a search below.
      </p>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          padding: "12px 28px",
          background: "#1A3A6A",
          color: "white",
          textDecoration: "none",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          transition: "background .15s",
        }}>
          ← Back to Home
        </Link>
        <Link href="/#search" style={{
          padding: "12px 28px",
          background: "white",
          color: "#1A3A6A",
          textDecoration: "none",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          border: "1.5px solid #D8D0C4",
          transition: "border-color .15s",
        }}>
          Search Scripture
        </Link>
      </div>

      {/* Popular searches */}
      <div style={{ marginTop: 48 }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#8A7D72",
          marginBottom: 14,
        }}>
          Popular searches
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
          {[
            "The Rapture",
            "Purgatory",
            "Guardian Angels",
            "The Trinity",
            "God helps those who help themselves",
          ].map((q) => (
            <Link key={q} href={`/?q=${encodeURIComponent(q)}`} style={{
              padding: "7px 14px",
              background: "white",
              border: "1px solid #D8D0C4",
              borderRadius: 20,
              fontSize: 13,
              color: "#4A3F35",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}