"use client";

// app/AdUnit.tsx
// Drop-in replacement for the AdLeaderboard placeholder.
//
// SETUP — fill in your values once approved:
//   1. Replace ADSENSE_CLIENT with your ca-pub-XXXXXXXXXXXXXXXX ID
//   2. Replace each AD_SLOT_* with the slot IDs from your AdSense dashboard
//   3. Remove the DEV_MODE block once you've confirmed ads render in production
//
// Usage:
//   <AdUnit slot="mid" />
//
// Slots defined below — add more as needed.

import { useEffect, useRef } from "react";

// ─── !! FILL THESE IN AFTER ADSENSE APPROVAL !! ──────────────────────────────
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX"; // ← your publisher ID

const AD_SLOTS: Record<string, string> = {
  top:      "XXXXXXXXXX", // ← slot ID for the top leaderboard
  mid:      "XXXXXXXXXX", // ← slot ID for the mid-page unit
  trending: "XXXXXXXXXX", // ← slot ID for below-trending unit
};
// ─────────────────────────────────────────────────────────────────────────────

// In development we render a clearly-labelled placeholder instead of
// calling AdSense (avoids invalid-traffic flags on your account).
const IS_DEV = process.env.NODE_ENV === "development";

interface AdUnitProps {
  slot: keyof typeof AD_SLOTS;
  style?: React.CSSProperties;
}

export default function AdUnit({ slot, style }: AdUnitProps) {
  const ref       = useRef<HTMLDivElement>(null);
  const pushed    = useRef(false);
  const slotId    = AD_SLOTS[slot] ?? AD_SLOTS["mid"];

  // Push the ad unit once the component mounts.
  // Using useEffect ensures this runs client-side only — safe for App Router.
  useEffect(() => {
    if (IS_DEV || pushed.current) return;
    try {
      // @ts-expect-error — adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Silently swallow — ad blocker or script not yet loaded
    }
  }, []);

  // ── Development placeholder ───────────────────────────────────────────────
  if (IS_DEV) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: 90,
          background: "#EDE8DA",
          border: "1.5px dashed #D8D0C4",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "12px 0",
          ...style,
        }}
        role="complementary"
        aria-label="Advertisement placeholder"
      >
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#8A7D72", letterSpacing: ".08em", textTransform: "uppercase" }}>
          Ad · {slot} slot
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#D8D0C4" }}>
          {ADSENSE_CLIENT} / {slotId}
        </span>
      </div>
    );
  }

  // ── Production AdSense unit ───────────────────────────────────────────────
  return (
    <div
      ref={ref}
      style={{ width: "100%", overflow: "hidden", textAlign: "center", ...style }}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}