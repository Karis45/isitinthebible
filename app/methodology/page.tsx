// app/methodology/page.tsx
// ── Server component — crawlers get full HTML + JSON-LD with no JS required ──
import type { Metadata } from "next";
import MethodologyClient from "./methodologyClient";

const SITE_URL = "https://isitinthebible.vercel.app";

export const metadata: Metadata = {
  title: "Methodology — How We Fact-Check the Bible",
  description:
    "Learn how our AI reads all 31,102 Bible verses to deliver a rigorous, non-denominational verdict on any phrase, doctrine, or belief attributed to Scripture.",
  alternates: { canonical: `${SITE_URL}/methodology` },
  openGraph: {
    title: "Methodology — Is it in the Bible?",
    description:
      "How our AI reads all 31,102 Bible verses to deliver rigorous, non-denominational biblical verdicts.",
    url: `${SITE_URL}/methodology`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "WebPage",
      "@id":         `${SITE_URL}/methodology#webpage`,
      url:           `${SITE_URL}/methodology`,
      name:          "Methodology — How We Fact-Check the Bible",
      description:   "How our AI reads all 31,102 Bible verses to deliver rigorous, non-denominational biblical verdicts.",
      isPartOf:      { "@id": `${SITE_URL}/#website` },
      breadcrumb:    { "@id": `${SITE_URL}/methodology#breadcrumb` },
    },
    {
      "@type":           "BreadcrumbList",
      "@id":             `${SITE_URL}/methodology#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",        item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Methodology", item: `${SITE_URL}/methodology` },
      ],
    },
    // FAQPage — the methodology Q&As are exactly what AI answer engines want
    {
      "@type":      "FAQPage",
      "@id":        `${SITE_URL}/methodology#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name:    "What Bible translation does Is it in the Bible use?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "We use the World English Bible (WEB), a modern, accurate, fully public-domain translation covering all 66 books, 1,189 chapters, and 31,102 verses. It is translated directly from original Hebrew, Aramaic, and Greek texts.",
          },
        },
        {
          "@type": "Question",
          name:    "How does the AI biblical fact-checker work?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "When you submit a query, our AI cross-references it against all 31,102 verses of the World English Bible in real time, applying a five-tier classification framework: Directly Stated, Concept Present, Inferred, Church Tradition, or Not in the Bible. It returns relevant verses, a confidence score of 1–5, a historical timeline, and a full scholarly analysis.",
          },
        },
        {
          "@type": "Question",
          name:    "What does 'Directly Stated' mean in the classification system?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Directly Stated (score 5/5) means the exact phrase or concept appears verbatim or near-verbatim in Scripture. No interpretation is required. Example: 'Love your neighbour as yourself' (Matthew 22:39).",
          },
        },
        {
          "@type": "Question",
          name:    "What does 'Not in the Bible' mean?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Classified as 'Cultural' (score 1/5), this means the phrase or idea has no meaningful basis in Scripture. It is often a cultural saying, misattribution, or popular myth falsely credited to the Bible. Example: 'God helps those who help themselves' — originated with Benjamin Franklin, 1736.",
          },
        },
        {
          "@type": "Question",
          name:    "What is the difference between 'Inferred' and 'Church Tradition'?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Inferred (score 3/5) means a claim can be logically derived from Scripture through interpretation, though reasonable people may disagree. Church Tradition (score 2/5) means a doctrine developed in church history and is widely believed, but lacks direct biblical basis. Example of Church Tradition: the pre-tribulation Rapture doctrine, which developed in the 19th century.",
          },
        },
        {
          "@type": "Question",
          name:    "Is this tool affiliated with any church or denomination?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "No. Is it in the Bible? is completely non-denominational and non-affiliated. The analysis reports what the biblical text actually says, not what any tradition, denomination, or culture wants it to say.",
          },
        },
        {
          "@type": "Question",
          name:    "Can AI make mistakes in biblical analysis?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Yes. While our AI is trained on rigorous biblical scholarship, it can make mistakes. For high-stakes theological decisions, always consult a qualified biblical scholar. Our verdicts reflect the most defensible academic position based on the World English Bible text.",
          },
        },
      ],
    },
    // HowTo schema — describes the process step by step
    {
      "@type":       "HowTo",
      "@id":         `${SITE_URL}/methodology#howto`,
      name:          "How to fact-check a Bible quote or belief",
      description":  "Use AI to verify whether a phrase, doctrine, or belief actually appears in the Bible.",
      totalTime:     "PT10S",
      step: [
        { "@type": "HowToStep", position: 1, name: "Submit your query",        text: "Type any phrase, doctrine, belief, or saying — up to 500 characters." },
        { "@type": "HowToStep", position: 2, name: "AI analysis begins",       text: "Our AI applies a rigorous academic framework developed specifically for Scripture." },
        { "@type": "HowToStep", position: 3, name: "All 31,102 verses scanned", text: "The AI cross-references your query against the complete World English Bible." },
        { "@type": "HowToStep", position: 4, name: "Classification assigned",  text: "One of five classifications is assigned with a confidence score of 1–5." },
        { "@type": "HowToStep", position: 5, name: "Evidence gathered",        text: "Relevant verses, historical timeline, and contextual explanations are compiled." },
        { "@type": "HowToStep", position: 6, name: "Verdict returned",         text: "You receive classification, key verses, historical timeline, and full scholarly analysis." },
      ],
    },
  ],
};

export default function MethodologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MethodologyClient />
    </>
  );
}