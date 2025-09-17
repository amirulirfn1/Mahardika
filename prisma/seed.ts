import { PrismaClient, Prisma, Role, LoyaltyTier, PolicyStatus, AgencySubscription, PointsSource } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.info("Seeding Mahardika demo data...");

  const seedPassword = process.env.SEED_USER_PASSWORD ?? "Mahardika123!";
  const passwordHash = await hash(seedPassword, 12);

  const agency = await prisma.agency.upsert({
    where: { slug: "demo-agency" },
    update: {
      name: "Mahardika Demo Agency",
      address: "12 Jalan Demo, Kuala Lumpur",
      phone: "+60 12-345 6789",
      email: "info@demoagency.my",
      subscription: AgencySubscription.PRO,
      staffLimit: 5,
    },
    create: {
      name: "Mahardika Demo Agency",
      slug: "demo-agency",
      address: "12 Jalan Demo, Kuala Lumpur",
      phone: "+60 12-345 6789",
      email: "info@demoagency.my",
      subscription: AgencySubscription.PRO,
      staffLimit: 5,
    },
  });

  const adminEmail = "admin@mahardika.io";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Mahardika Admin",
      role: Role.PLATFORM_ADMIN,
      passwordHash,
    },
    create: {
      name: "Mahardika Admin",
      email: adminEmail,
      role: Role.PLATFORM_ADMIN,
      locale: "en",
      passwordHash,
    },
  });

  const ownerEmail = "owner@demoagency.my";
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      name: "Demo Agency Owner",
      role: Role.AGENCY_OWNER,
      agencyId: agency.id,
      passwordHash,
    },
    create: {
      name: "Demo Agency Owner",
      email: ownerEmail,
      role: Role.AGENCY_OWNER,
      agencyId: agency.id,
      locale: "en",
      passwordHash,
    },
  });

  const agentEmail = "agent@demoagency.my";
  await prisma.user.upsert({
    where: { email: agentEmail },
    update: {
      name: "Demo Agent",
      role: Role.AGENT,
      agencyId: agency.id,
      passwordHash,
    },
    create: {
      name: "Demo Agent",
      email: agentEmail,
      role: Role.AGENT,
      agencyId: agency.id,
      locale: "en",
      passwordHash,
    },
  });

  const customerEmail = "customer@demoagency.my";
  const customerPhone = "+60 19-111 2222";
  const nationalId = "900101-14-1234";
  const seedPoints = 1063;

  const customer = await prisma.customer.upsert({
    where: {
      agencyId_email: {
        agencyId: agency.id,
        email: customerEmail,
      },
    },
    update: {
      name: "Amirudin Customer",
      phone: customerPhone,
      nationalId,
      tier: LoyaltyTier.SILVER,
      notes: "Seeded Mahardika customer used for Playwright smoke flows.",
      points: seedPoints,
    },
    create: {
      name: "Amirudin Customer",
      email: customerEmail,
      phone: customerPhone,
      nationalId,
      tier: LoyaltyTier.SILVER,
      notes: "Seeded Mahardika customer used for Playwright smoke flows.",
      points: seedPoints,
      agencyId: agency.id,
    },
  });

  const policyId = "seed-policy-motor";
  const policyPremium = new Prisma.Decimal("850.50");

  const policy = await prisma.policy.upsert({
    where: { id: policyId },
    update: {
      agencyId: agency.id,
      customerId: customer.id,
      provider: "Etiqa Takaful",
      product: "Motor",
      policyNumber: "POL-MAH-0001",
      startDate: new Date("2025-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-01T00:00:00.000Z"),
      premiumRm: policyPremium,
      status: PolicyStatus.ACTIVE,
      createdById: owner.id,
    },
    create: {
      id: policyId,
      agencyId: agency.id,
      customerId: customer.id,
      provider: "Etiqa Takaful",
      product: "Motor",
      policyNumber: "POL-MAH-0001",
      startDate: new Date("2025-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-01T00:00:00.000Z"),
      premiumRm: policyPremium,
      status: PolicyStatus.ACTIVE,
      createdById: owner.id,
    },
  });

  const paymentId = "seed-payment-motor-1";
  await prisma.policyPayment.upsert({
    where: { id: paymentId },
    update: {
      policyId: policy.id,
      amountRm: policyPremium,
      paidAt: new Date("2025-01-05T03:00:00.000Z"),
      method: "bank_transfer",
      referenceNote: "Initial premium payment",
      createdById: owner.id,
    },
    create: {
      id: paymentId,
      policyId: policy.id,
      amountRm: policyPremium,
      paidAt: new Date("2025-01-05T03:00:00.000Z"),
      method: "bank_transfer",
      referenceNote: "Initial premium payment",
      createdById: owner.id,
    },
  });

  const pointsTxId = "seed-points-transaction-1";
  await prisma.pointsTransaction.upsert({
    where: { id: pointsTxId },
    update: {
      customerId: customer.id,
      policyId: policy.id,
      source: PointsSource.purchase,
      amountPoints: seedPoints,
      amountRm: policyPremium,
      note: "Seeded from initial policy purchase.",
    },
    create: {
      id: pointsTxId,
      customerId: customer.id,
      policyId: policy.id,
      source: PointsSource.purchase,
      amountPoints: seedPoints,
      amountRm: policyPremium,
      note: "Seeded from initial policy purchase.",
    },
  });

  console.info("Mahardika demo data seeded.");
  console.info("Seed logins:");
  console.info(`  Platform admin: ${adminEmail} / ${seedPassword}`);
  console.info(`  Agency owner: ${ownerEmail} / ${seedPassword}`);
  console.info(`  Agent: ${agentEmail} / ${seedPassword}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
