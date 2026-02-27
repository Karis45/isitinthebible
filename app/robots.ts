// app/robots.ts
// Generates /robots.txt automatically via Next.js Metadata API.

import type { MetadataRoute } from "next";

const SITE_URL = "https://isitinthebible.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        // Block API routes and OG image route from being crawled directly
        disallow:  ["/api/"],
      },
    ],
    sitemap:   `${SITE_URL}/sitemap.xml`,
    host:      SITE_URL,
  };
}