import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = "https://isitinthebible.vercel.app"; // ← update to custom domain later

// ── Font loader ──────────────────────────────────────────────────────────────
async function loadFont(family: string, text: string, weight = 400): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,${weight};1,${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Failed to load font: ${family}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font binary: ${family}`);
  return res.arrayBuffer();
}

// ── Badge config ─────────────────────────────────────────────────────────────
const BADGE: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  "Directly Stated":  { label: "Directly Stated",  icon: "📖", color: "#1A5C38", bg: "#EBF5EF" },
  "Concept Present":  { label: "Concept Present",  icon: "💡", color: "#7A5A00", bg: "#F5ECD2" },
  "Inferred":         { label: "Inferred",          icon: "🔍", color: "#8A3A00", bg: "#FEF0E6" },
  "Cultural":         { label: "Not in the Bible",  icon: "❌", color: "#7A1A1A", bg: "#FEF0F0" },
  "Church Tradition": { label: "Church Tradition",  icon: "⛪", color: "#4A1A7A", bg: "#F3EEF8" },
};

const scoreToColor = (s: number) => {
  if (s <= 1) return "#E88080";
  if (s <= 2) return "#E8AA60";
  if (s <= 3) return "#F0C040";
  if (s <= 4) return "#7EC8A0";
  return "#5CC88A";
};

// ── Route ────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "Is it in the Bible?";
  const c = searchParams.get("c") ?? "Cultural";
  const s = Math.max(1, Math.min(5, Number(searchParams.get("s") ?? 1)));
  const v = searchParams.get("v") ?? "";

  const badge = BADGE[c] ?? BADGE["Cultural"];
  const barWidth = Math.round(((s - 1) / 4) * 88 + 6);

  const displayDomain = SITE_URL.replace("https://", "");

  const allText = `Is it in the Bible? ${q} ${v} ${badge.label} Biblical Score AI-POWERED BIBLICAL FACT-CHECKER · WORLD ENGLISH BIBLE ${displayDomain}`;

  const [cormorantData, cormorantItalicData, dmSansData, dmMonoData] = await Promise.all([
    loadFont("Cormorant+Garamond", allText, 400),
    loadFont("Cormorant+Garamond", allText, 600),
    loadFont("DM+Sans",            allText, 500),
    loadFont("DM+Mono",            allText, 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#F5F1E8",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parchment texture lines */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              top: 80 + i * 30,
              height: 1,
              background: "rgba(180,160,120,.18)",
              display: "flex",
            }}
          />
        ))}

        {/* Top navy bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#1A3A6A",
            padding: "0 60px",
            height: 72,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "rgba(255,255,255,.15)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              📖
            </div>
            <span
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.5px",
                fontFamily: "'DM Sans'",
              }}
            >
              Is it in the{" "}
              <em style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond'" }}>
                Bible?
              </em>
            </span>
          </div>
          {/* Domain — updates automatically from SITE_URL */}
          <span
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono'",
            }}
          >
            {displayDomain}
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 60px 40px",
          }}
        >
          {/* Classification badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: badge.bg,
              border: `1.5px solid ${badge.color}33`,
              borderRadius: 100,
              padding: "8px 18px",
              alignSelf: "flex-start",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 18 }}>{badge.icon}</span>
            <span
              style={{
                color: badge.color,
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "'DM Mono'",
              }}
            >
              {badge.label}
            </span>
          </div>

          {/* Query */}
          <div
            style={{
              fontSize: q.length > 50 ? 42 : q.length > 30 ? 52 : 62,
              fontWeight: 400,
              color: "#1A1612",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: 20,
              maxWidth: 900,
              fontFamily: "'Cormorant Garamond'",
            }}
          >
            {q}
          </div>

          {/* One-liner */}
          {v && (
            <div
              style={{
                fontSize: 22,
                fontStyle: "italic",
                color: "#4A3F35",
                lineHeight: 1.5,
                maxWidth: 820,
                marginBottom: 32,
                fontFamily: "'Cormorant Garamond'",
              }}
            >
              {v.length > 120 ? v.slice(0, 120) + "…" : v}
            </div>
          )}

          {/* Score bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 400 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: 11,
                  color: "#8A7D72",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono'",
                }}
              >
                Biblical Score
              </span>
              <span style={{ fontSize: 11, color: "#8A7D72", fontFamily: "'DM Mono'" }}>
                {s} / 5
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 100,
                background: "rgba(26,22,18,.12)",
                position: "relative",
                display: "flex",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${barWidth}%`,
                  background: scoreToColor(s),
                  borderRadius: 100,
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EDE8DA",
            borderTop: "1px solid #D8D0C4",
            height: 52,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#8A7D72",
              letterSpacing: "0.08em",
              fontFamily: "'DM Mono'",
            }}
          >
            AI-POWERED BIBLICAL FACT-CHECKER · WORLD ENGLISH BIBLE
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cormorant Garamond", data: cormorantData,       style: "normal", weight: 400 },
        { name: "Cormorant Garamond", data: cormorantItalicData, style: "italic", weight: 600 },
        { name: "DM Sans",            data: dmSansData,          style: "normal", weight: 500 },
        { name: "DM Mono",            data: dmMonoData,          style: "normal", weight: 400 },
      ],
    }
  );
}