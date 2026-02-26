// app/page.tsx
// Server component — handles ?q= param for SSR metadata + prefetch.
// HomeClient (client component) handles all interactivity.

import type { Metadata } from "next";
import HomeClient from "@/app/HomeClient";
// ─── Types (shared with API route) ────────────────────────────────────────────
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

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL  = "https://isitinthebible.com";
const SITE_NAME = "Is it in the Bible?";
const SITE_DESC =
  "AI-powered biblical fact-checker. Type any phrase, doctrine, or belief and find out exactly what Scripture says — with the actual verses to back it up.";

// Classification → human-readable verdict for OG description
const VERDICT_LABELS: Record<Classification, string> = {
  "Directly Stated":  "✅ Directly Stated in Scripture",
  "Concept Present":  "💡 Concept Present in Scripture",
  "Inferred":         "🔍 Inferred from Scripture",
  "Cultural":         "❌ Not in the Bible",
  "Church Tradition": "⛪ Church Tradition — not in Scripture",
};

// ─── Server-side result fetcher ────────────────────────────────────────────────
// Called at request time only when ?q= is present.
// Re-uses the same Gemini logic as the API route by hitting the internal endpoint.
// On failure we return null — the client will re-fetch on mount.
async function fetchResult(query: string): Promise<BibleResult | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/analyze`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ statement: query }),
      // Next.js cache: revalidate every 24 h so repeated ?q= requests are fast
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.result as BibleResult) ?? null;
  } catch {
    return null;
  }
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query  = params?.q?.trim() ?? "";

  // ── No query → return site defaults (layout.tsx handles the base) ──────────
  if (!query) {
    return {
      title:       SITE_NAME,
      description: SITE_DESC,
      openGraph: {
        title:       SITE_NAME,
        description: SITE_DESC,
        url:         SITE_URL,
        images: [
          {
            url:    `${SITE_URL}/api/og`,
            width:  1200,
            height: 630,
            alt:    SITE_NAME,
          },
        ],
      },
      twitter: {
        card:        "summary_large_image",
        title:       SITE_NAME,
        description: SITE_DESC,
        images:      [`${SITE_URL}/api/og`],
      },
      alternates: { canonical: SITE_URL },
    };
  }

  // ── Query present → fetch result for rich metadata ─────────────────────────
  const result = await fetchResult(query);

  const title       = result
    ? `${query} — ${VERDICT_LABELS[result.classification]}`
    : `"${query}" — Is it in the Bible?`;

  const description = result
    ? `${result.oneLiner} Verdict: ${VERDICT_LABELS[result.classification]}. Analyzed against all 31,102 Bible verses.`
    : `Find out if "${query}" is in the Bible. AI-powered analysis of all 31,102 Bible verses.`;

  const ogImageUrl = `${SITE_URL}/api/og?q=${encodeURIComponent(query)}${
    result ? `&c=${encodeURIComponent(result.classification)}&s=${result.explicitnessScore}&v=${encodeURIComponent(result.oneLiner)}` : ""
  }`;

  const canonicalUrl = `${SITE_URL}?q=${encodeURIComponent(query)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url:    ogImageUrl,
          width:  1200,
          height: 630,
          alt:    title,
        },
      ],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImageUrl],
    },
    alternates: { canonical: canonicalUrl },
  };
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const query  = params?.q?.trim() ?? "";

  // Pre-fetch on the server so the modal opens instantly (no loading state)
  // when someone arrives via a shared link.
  const prefetchedResult = query ? await fetchResult(query) : null;

  return (
    <HomeClient
      prefetchedResult={prefetchedResult}
      initialQuery={query || null}
    />
  );
}