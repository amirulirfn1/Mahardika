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
const FieldValue = admin.firestore.FieldValue;

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate a random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

async function seed() {
  // 1. Tiers
  const tiers = [
    { id: "Bronze", minPoints: 0, rate: 10 },
    { id: "Silver", minPoints: 1000, rate: 12 },
    { id: "Gold", minPoints: 5000, rate: 15 },
    { id: "Platinum", minPoints: 10000, rate: 20 },
  ];
  
  console.log("🌱 Seeding tiers...");
  for (const t of tiers) {
    await db.collection("tiers").doc(t.id).set({
      minPoints: t.minPoints,
      rate: t.rate
    });
  }

  // 2. Roles
  const roles = [
    { 
      id: "admin", 
      permissions: ["*"] 
    },
    { 
      id: "staff", 
      permissions: [
        "read:policies", 
        "write:payments",
        "read:vehicles",
        "read:users"
      ] 
    },
    { 
      id: "customer", 
      permissions: [
        "read:own_policies",
        "read:own_vehicles",
        "read:own_payments"
      ] 
    },
  ];
  
  console.log("👥 Seeding roles...");
  for (const r of roles) {
    await db.collection("roles").doc(r.id).set({
      permissions: r.permissions
    });
  }

  // 3. Config
  const config = {
    defaultNotificationDays: 60, // days before renewal to start reminders
  };
  
  console.log("⚙️  Seeding config...");
  await db.collection("config").doc("notificationSettings").set(config);

  // 4. Create sample users
  console.log("👤 Seeding sample users...");
  const users = [
    {
      uid: "admin_1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      createdAt: FieldValue.serverTimestamp()
    },
    {
      uid: "staff_1",
      name: "Staff Member",
      email: "staff@example.com",
      role: "staff",
      createdAt: FieldValue.serverTimestamp()
    },
    {
      uid: "customer_1",
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      createdAt: FieldValue.serverTimestamp()
    },
    {
      uid: "customer_2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "customer",
      createdAt: FieldValue.serverTimestamp()
    }
  ];

  for (const user of users) {
    await db.collection("users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  }

  // 5. Create sample vehicles
  console.log("🚗 Seeding sample vehicles...");
  const vehicles = [
    {
      vehicleId: "v1",
      ownerUid: "customer_1",
      make: "Toyota",
      model: "Vios",
      year: 2020,
      plate: "ABC1234"
    },
    {
      vehicleId: "v2",
      ownerUid: "customer_1",
      make: "Honda",
      model: "City",
      year: 2021,
      plate: "DEF5678"
    },
    {
      vehicleId: "v3",
      ownerUid: "customer_2",
      make: "Proton",
      model: "X50",
      year: 2022,
      plate: "GHI9012"
    }
  ];

  for (const vehicle of vehicles) {
    await db.collection("vehicles").doc(vehicle.vehicleId).set({
      ownerUid: vehicle.ownerUid,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate
    });
  }

  // 6. Create sample policies
  console.log("📄 Seeding sample policies...");
  const policies = [
    {
      policyId: "p1",
      vehicleId: "v1",
      customerUid: "customer_1",
      type: "1st-party",
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2025, 0, 1),
      pdfUrl: "https://example.com/policies/p1.pdf"
    },
    {
      policyId: "p2",
      vehicleId: "v3",
      customerUid: "customer_2",
      type: "3rd-party",
      startDate: new Date(2024, 3, 15),
      endDate: new Date(2025, 3, 15),
      pdfUrl: "https://example.com/policies/p2.pdf"
    }
  ];

  for (const policy of policies) {
    await db.collection("policies").doc(policy.policyId).set({
      vehicleId: policy.vehicleId,
      customerUid: policy.customerUid,
      type: policy.type,
      startDate: policy.startDate,
      endDate: policy.endDate,
      pdfUrl: policy.pdfUrl
    });
  }

  // 7. Create sample payments
  console.log("💰 Seeding sample payments...");
  const payments = [
    {
      paymentId: "pay1",
      policyId: "p1",
      amount: 1200.50,
      paidAt: new Date(2024, 0, 5)
    },
    {
      paymentId: "pay2",
      policyId: "p1",
      amount: 1200.50,
      paidAt: new Date(2024, 6, 15)
    },
    {
      paymentId: "pay3",
      policyId: "p2",
      amount: 850.75,
      paidAt: new Date(2024, 3, 20)
    }
  ];

  for (const payment of payments) {
    await db.collection("payments").doc(payment.paymentId).set({
      policyId: payment.policyId,
      amount: payment.amount,
      paidAt: payment.paidAt
    });
  }

  // 8. Create loyalty points
  console.log("🏆 Seeding loyalty points...");
  const loyaltyPoints = [
    {
      uid: "customer_1",
      points: 1250,
      tier: "Silver"
    },
    {
      uid: "customer_2",
      points: 750,
      tier: "Bronze"
    }
  ];

  for (const lp of loyaltyPoints) {
    await db.collection("loyaltyPoints").doc(lp.uid).set({
      points: lp.points,
      tier: lp.tier
    });
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
