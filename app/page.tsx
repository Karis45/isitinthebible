// app/page.tsx
import HomeClient from "@/app/HomeClient";

// This is a static, hardcoded "featured" result — no API call needed
const FEATURED_RESULT = {
  query: "God helps those who help themselves",
  classification: "Cultural" as const,
  explicitnessScore: 1,
  oneLiner: "One of the most quoted 'Bible verses' — never written by any biblical author.",
  originEra: "Ancient Greece, later popularised by Benjamin Franklin (1736)",
  closestBiblicalTheme: "Self-reliance vs. dependence on God",
  searchPopularity: "High — est. 40K+ searches/month",
  theologicalConsensus: "Universally agreed: not in the Bible. Contradicts core biblical themes of reliance on God.",
  timeline: [
    { year: "~550 BC", label: "Algernon Sidney", detail: "Similar phrase appears in ancient Greek writing" },
    { year: "1736",    label: "Benjamin Franklin", detail: "Popularised in Poor Richard's Almanack" },
    { year: "Today",   label: "Still misquoted",   detail: "Millions attribute this to Scripture annually" },
  ],
  verses: [
    {
      ref: "Proverbs 3:5",
      text: "Trust in Yahweh with all your heart, and don't lean on your own understanding.",
      context: "This verse directly contradicts the sentiment — Scripture calls for dependence on God, not self-reliance.",
    },
    {
      ref: "Psalm 121:2",
      text: "My help comes from Yahweh, who made heaven and earth.",
      context: "The Bible consistently frames help as coming from God, not from oneself.",
    },
  ],
  misquoteWhat: "People cite this as biblical wisdom endorsing hard work and initiative.",
  misquoteReality: "The phrase has no biblical origin. It was written by Benjamin Franklin and contradicts Scripture's emphasis on dependence on God.",
  analysis: "This is perhaps the most famous phrase falsely attributed to the Bible...",
  confidenceNote: "Confidence: Very High. No translation of any biblical text contains this phrase.",
  relatedTopics: [
    { query: "The Lord works in mysterious ways", classification: "Cultural" as const },
    { query: "This too shall pass",               classification: "Cultural" as const },
  ],
};

export default function Page() {
  return (
    <HomeClient
      prefetchedResult={FEATURED_RESULT}
      initialQuery="God helps those who help themselves"
    />
  );
}