// app/layout.tsx
// Sets site-level defaults ONLY.
// Page-level generateMetadata() in page.tsx overrides these for shared links.
// IMPORTANT: Do NOT add openGraph.images here — that blocks dynamic OG images.

import type { Metadata } from "next";

const SITE_URL  = "https://isitinthebible.com";
const SITE_NAME = "Is it in the Bible?";
const SITE_DESC =
  "AI-powered biblical fact-checker. Type any phrase, doctrine, or belief and find out exactly what Scripture says — with the actual verses to back it up.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  // ── Open Graph base (page.tsx overrides title/description/images per query) ──
  openGraph: {
    type:     "website",
    siteName: SITE_NAME,
    locale:   "en_US",
  },
  // ── Twitter/X base ──
  twitter: {
    card: "summary_large_image",
    site: "@isitinthebible",
  },
  // ── Crawl rules ──
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
// WebSite schema enables Google Sitelinks Search Box.
// FAQPage schema gets your content into Google's rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // WebSite — enables sitelinks search box in Google
    {
      "@type":           "WebSite",
      "@id":             `${SITE_URL}/#website`,
      url:               SITE_URL,
      name:              SITE_NAME,
      description:       SITE_DESC,
      potentialAction: {
        "@type":       "SearchAction",
        target:        `${SITE_URL}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    // Organization
    {
      "@type": "Organization",
      "@id":   `${SITE_URL}/#organization`,
      name:    SITE_NAME,
      url:     SITE_URL,
      logo: {
        "@type": "ImageObject",
        url:     `${SITE_URL}/api/og`,
      },
    },
    // FAQPage — shows as rich results in Google
    {
      "@type":       "FAQPage",
      "@id":         `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type":          "Question",
          name:             "Is 'God helps those who help themselves' in the Bible?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "No. This phrase does not appear anywhere in the Bible. It is commonly attributed to Scripture, but it originated in ancient Greek texts and was later popularized by Benjamin Franklin in Poor Richard's Almanack (1736).",
          },
        },
        {
          "@type":          "Question",
          name:             "Is the Rapture in the Bible?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "The word 'Rapture' does not appear in the Bible. The concept is derived from 1 Thessalonians 4:17, which describes believers being 'caught up' to meet the Lord. The modern doctrine of a pre-tribulation Rapture is a Church Tradition that developed in the 19th century.",
          },
        },
        {
          "@type":          "Question",
          name:             "Is Purgatory in the Bible?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Purgatory is not directly mentioned in the Bible. It is a doctrine of Church Tradition, primarily in Catholic theology, developed over centuries from passages like 1 Corinthians 3:15 and 2 Maccabees 12:46.",
          },
        },
        {
          "@type":          "Question",
          name:             "Is 'Money is the root of all evil' an accurate Bible quote?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "No — this is a misquote. The actual verse (1 Timothy 6:10) says 'the love of money is the root of all evil.' The omission of the word 'love' significantly changes the meaning.",
          },
        },
        {
          "@type":          "Question",
          name:             "What Bible translation does Is it in the Bible use?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "We use the World English Bible (WEB), a modern English translation that is completely in the public domain. It is accurate, readable, and free from copyright restrictions.",
          },
        },
        {
          "@type":          "Question",
          name:             "How does the AI biblical fact-checker work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Our AI analyzes all 31,102 verses of the World English Bible in real time, cross-referencing your query against the complete text. It returns a classification (Directly Stated, Concept Present, Inferred, Church Tradition, or Not in the Bible), relevant verses, and scholarly analysis.",
          },
        },
      ],
    },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}