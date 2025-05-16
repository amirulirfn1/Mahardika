/**
 * Seed initial Firestore collections for Mahardika.
 * Usage: node scripts/seedDatabase.js
 */

import admin from "firebase-admin";
import fs from "fs";

// Initialize with service account key
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  // 1. Tiers
  const tiers = [
    { id: "Bronze", minPoints: 0, rate: 10 },
    { id: "Silver", minPoints: 1000, rate: 12 },
    { id: "Gold", minPoints: 5000, rate: 15 },
    { id: "Platinum", minPoints: 10000, rate: 20 },
  ];
  for (const t of tiers) {
    await db.collection("tiers").doc(t.id).set(t);
  }

  // 2. Roles
  const roles = [
    { id: "admin", permissions: ["*"] },
    { id: "staff", permissions: ["read:policies", "write:payments"] },
    { id: "customer", permissions: ["read:own_policies"] },
  ];
  for (const r of roles) {
    await db.collection("roles").doc(r.id).set(r);
  }

  // 3. Config
  const config = {
    defaultNotificationDays: 60, // days before renewal to start reminders
  };
  await db.collection("config").doc("notificationSettings").set(config);

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
