// app/sitemap.ts
import { MetadataRoute } from "next";
import { TOPICS } from "./topic/topics";

const SITE_URL = "https://isitinthebible.vercel.app";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${SITE_URL}/about`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/methodology`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/privacy`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const topicPages: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${SITE_URL}/topic/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...STATIC_PAGES, ...topicPages];
}