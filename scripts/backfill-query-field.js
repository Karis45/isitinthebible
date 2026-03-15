// scripts/backfill-query-field.js
// Run with: node scripts/backfill-query-field.js

require("dotenv").config({ path: ".env.local" });

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

function slugToQuery(slug) {
  return decodeURIComponent(slug).replace(/-/g, " ").trim();
}

async function backfill() {
  const snap = await db.collection("query_cache").get();
  console.log(`Found ${snap.docs.length} documents.\n`);

  let updated = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const result = data && data.result;

    if (!result) {
      console.log(`  SKIP (no result field): ${doc.id}`);
      skipped++;
      continue;
    }

    if (result.query) {
      console.log(`  SKIP (already set): ${doc.id} → "${result.query}"`);
      skipped++;
      continue;
    }

    // Derive human-readable query from the document ID (slug)
    const query = slugToQuery(doc.id);
    console.log(`  UPDATE: ${doc.id} → "${query}"`);

    await doc.ref.update({ "result.query": query });
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

backfill().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});