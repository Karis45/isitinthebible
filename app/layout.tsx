// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = "https://isitinthebible.vercel.app";
const SITE_NAME = "Is it in the Bible?";
const SITE_DESC =
  "AI-powered biblical fact-checker. Type any phrase, doctrine, or belief and find out exactly what Scripture says — with the actual verses to back it up.";

const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";

const DEFAULT_OG = `${SITE_URL}/api/og?q=Is+it+in+the+Bible%3F&c=Cultural&s=1&v=AI-powered+biblical+fact-checker+for+31%2C000%2B+verses`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  openGraph: {
    type:        "website",
    siteName:    SITE_NAME,
    locale:      "en_US",
    url:         SITE_URL,
    title:       SITE_NAME,
    description: SITE_DESC,
    images: [
      {
        url:    DEFAULT_OG,
        width:  1200,
        height: 630,
        alt:    "Is it in the Bible? — AI-powered biblical fact-checker",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@isitinthebible",
    title:       SITE_NAME,
    description: SITE_DESC,
    images:      [DEFAULT_OG],
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "JEa7aG17-rTjqgIz71GruYAPeh4JQTdLVPMRnQ-wuR4",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
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
    {
      "@type": "Organization",
      "@id":   `${SITE_URL}/#organization`,
      name:    SITE_NAME,
      url:     SITE_URL,
    },
    {
      "@type":    "FAQPage",
      "@id":      `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type":        "Question",
          name:           "Is 'God helps those who help themselves' in the Bible?",
          acceptedAnswer: { "@type": "Answer", text: "No. This phrase does not appear anywhere in the Bible. It originated in ancient Greek texts and was later popularized by Benjamin Franklin in Poor Richard's Almanack (1736)." },
        },
        {
          "@type":        "Question",
          name:           "Is the Rapture in the Bible?",
          acceptedAnswer: { "@type": "Answer", text: "The word 'Rapture' does not appear in the Bible. The concept is derived from 1 Thessalonians 4:17. The modern pre-tribulation Rapture doctrine is a Church Tradition that developed in the 19th century." },
        },
        {
          "@type":        "Question",
          name:           "Is 'Money is the root of all evil' an accurate Bible quote?",
          acceptedAnswer: { "@type": "Answer", text: "No — this is a misquote. 1 Timothy 6:10 says 'the love of money is the root of all evil.' The omission of 'love' significantly changes the meaning." },
        },
        {
          "@type":        "Question",
          name:           "What Bible translation does Is it in the Bible use?",
          acceptedAnswer: { "@type": "Answer", text: "We use the World English Bible (WEB), a modern English translation that is completely in the public domain." },
        },
        {
          "@type":        "Question",
          name:           "How does the AI biblical fact-checker work?",
          acceptedAnswer: { "@type": "Answer", text: "Our AI analyzes all 31,102 verses of the World English Bible in real time and returns a classification — Directly Stated, Concept Present, Inferred, Church Tradition, or Not in the Bible — with relevant verses and scholarly analysis." },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        {process.env.NODE_ENV === "production" && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}