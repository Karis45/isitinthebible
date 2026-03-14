// app/sitemap.ts
import { MetadataRoute } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SITE_URL = "https://isitinthebible.vercel.app";

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

function queryToSlug(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── Static pages ───────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                      lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/about`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/methodology`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Dynamic topic pages from Firestore ────────────────────────────────────
  let topicPages: MetadataRoute.Sitemap = [];

  // Guard: skip Firestore entirely if env vars are not configured
  const firebaseConfigured =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

  if (!firebaseConfigured) {
    console.warn("[sitemap] Firebase env vars not set — skipping dynamic topic pages.");
    return staticPages;
  }

  try {
    const db   = getDb();
    const snap = await db
      .collection("query_cache")
      .select("queryRaw", "cachedAt", "hitCount")
      .get();

    topicPages = snap.docs
      .map((doc) => {
        const data = doc.data();
        const slug = queryToSlug(data.queryRaw ?? "");
        const hits = data.hitCount ?? 0;
        if (!slug) return null;
        return {
          url:             `${SITE_URL}/topic/${slug}`,
          lastModified:    data.cachedAt?.toDate() ?? new Date(),
          changeFrequency: "monthly" as const,
          priority:        Math.min(0.9, 0.5 + hits * 0.01),
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

  } catch (err) {
    console.error("[sitemap] Failed to load topic pages:", err);
  }

  return [...staticPages, ...topicPages];
}
