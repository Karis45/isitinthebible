// app/sitemap.ts
// Generates /sitemap.xml automatically.
// Pre-lists high-traffic queries so Googlebot can crawl result pages.

import type { MetadataRoute } from "next";

const SITE_URL = "https://isitinthebible.com";

// High-traffic queries — each becomes a crawlable URL with full SSR metadata.
// Add more as you discover popular searches in your analytics.
const POPULAR_QUERIES = [
  "The Rapture",
  "Purgatory",
  "Guardian Angels",
  "The Trinity",
  "God helps those who help themselves",
  "Cleanliness is next to godliness",
  "Money is the root of all evil",
  "This too shall pass",
  "Hell",
  "Original Sin",
  "Free Will",
  "Prosperity Gospel",
  "Soul Sleep",
  "Manifesting",
  "Spare the rod spoil the child",
  "Eye of a needle",
  "Pride comes before a fall",
  "Forbidden fruit",
  "Heaven is a place on Earth",
  "God will not give you more than you can handle",
  "Love the sinner hate the sin",
  "The road to hell is paved with good intentions",
  "Satan fell like lightning from heaven",
  "Once saved always saved",
  "Baptism of the Holy Spirit",
  "Christmas",
  "Easter",
  "Seven deadly sins",
  "The Antichrist",
  "Limbo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             SITE_URL,
      lastModified:    now,
      changeFrequency: "daily",
      priority:        1,
    },
  ];

  // One URL per popular query
  const queryRoutes: MetadataRoute.Sitemap = POPULAR_QUERIES.map((q) => ({
    url:             `${SITE_URL}?q=${encodeURIComponent(q)}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticRoutes, ...queryRoutes];
}