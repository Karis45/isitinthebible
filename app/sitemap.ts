// app/sitemap.ts
import { MetadataRoute } from "next";

const SITE_URL = "https://isitinthebible.vercel.app";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL,                      lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${SITE_URL}/about`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/methodology`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/privacy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_PAGES;
}