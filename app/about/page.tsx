// app/about/page.tsx
// ── Server component — crawlers get full HTML + JSON-LD with no JS required ──
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const SITE_URL = "https://isitinthebible.vercel.app";

export const metadata: Metadata = {
  title: "About — Built by Anthony Kariuki",
  description:
    "The story behind Is it in the Bible? — a free, non-denominational AI tool built to help anyone fact-check phrases and beliefs attributed to Scripture.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About — Is it in the Bible?",
    description: "The story behind the free AI biblical fact-checker built by Anthony Kariuki.",
    url: `${SITE_URL}/about`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":    "WebPage",
      "@id":      `${SITE_URL}/about#webpage`,
      url:        `${SITE_URL}/about`,
      name:       "About — Is it in the Bible?",
      description: "The story behind the free AI biblical fact-checker built by Anthony Kariuki.",
      isPartOf:   { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${SITE_URL}/about#breadcrumb` },
    },
    {
      "@type":           "BreadcrumbList",
      "@id":             `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",  item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      ],
    },
    // Person schema — author authority signals for AI citation engines
    {
      "@type":       "Person",
      "@id":         `${SITE_URL}/#founder`,
      name:          "Anthony Kariuki",
      jobTitle:      "Founder",
      worksFor:      { "@type": "Organization", name: "Is it in the Bible?", url: SITE_URL },
      url:           `${SITE_URL}/about`,
      description:   "Indie developer and founder of Is it in the Bible?, a free non-denominational AI tool for fact-checking biblical claims.",
    },
    // Organization schema — builds site authority
    {
      "@type":       "Organization",
      "@id":         `${SITE_URL}/#organization`,
      name:          "Is it in the Bible?",
      url:           SITE_URL,
      founder:       { "@id": `${SITE_URL}/#founder` },
      foundingDate:  "2026",
      description:   "A free, non-denominational, AI-powered biblical fact-checker that analyzes all 31,102 verses of the World English Bible.",
      mission:       "Bible clarity for everyone, without exception.",
      knowsAbout:    ["Biblical studies", "Scripture fact-checking", "World English Bible", "Biblical misquotes", "Christian theology"],
    },
    // FAQPage — about-page questions AI engines frequently answer
    {
      "@type":      "FAQPage",
      "@id":        `${SITE_URL}/about#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name:    "Who built Is it in the Bible?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Is it in the Bible? was built by Anthony Kariuki, an indie developer based in Kenya. It is a solo project built on the conviction that biblical accuracy should be accessible to everyone for free.",
          },
        },
        {
          "@type": "Question",
          name:    "Is Is it in the Bible? affiliated with any church or denomination?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "No. Is it in the Bible? is completely non-denominational and non-affiliated. The tool reports what the biblical text actually says, with no theological agenda or denominational preference.",
          },
        },
        {
          "@type": "Question",
          name:    "Is Is it in the Bible? free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "Yes. Is it in the Bible? is completely free, requires no account, and has no paywalls. The founder's goal is to make biblical fact-checking accessible to anyone with an internet connection.",
          },
        },
        {
          "@type": "Question",
          name:    "Why was Is it in the Bible? created?",
          acceptedAnswer: {
            "@type": "Answer",
            text:    "The tool was created after the founder discovered that many commonly quoted 'Bible verses' — such as 'God helps those who help themselves' — do not actually appear in Scripture. The goal is to help people distinguish between genuine Scripture, church tradition, and cultural myths falsely attributed to the Bible.",
          },
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}