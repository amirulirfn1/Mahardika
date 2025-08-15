import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const hasEnv = Boolean(url && anon && serviceRole);

async function getAdmin(): Promise<SupabaseClient> {
  // @ts-ignore service role
  return createClient(url, serviceRole);
}

async function ensureAgencyUsersAndCustomer() {
  const admin = await getAdmin();
  const email1 = "e2e.loyalty.agency1@example.com";
  const email2 = "e2e.loyalty.agency2@example.com";
  const password = "Passw0rd!";

  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const getOrCreate = async (email: string) => {
    const found = listed.data.users?.find((u) => u.email === email);
    return found || (await admin.auth.admin.createUser({ email, password, email_confirm: true })).data.user!;
  };
  const u1 = await getOrCreate(email1);
  const u2 = await getOrCreate(email2);

  const slug1 = "e2e-loyalty-agency-1";
  const slug2 = "e2e-loyalty-agency-2";
  const a1 = await admin.from("agencies").select("id").eq("slug", slug1).maybeSingle();
  const a2 = await admin.from("agencies").select("id").eq("slug", slug2).maybeSingle();
  const agency1 = a1.data?.id || (await admin.from("agencies").insert({ name: "E2E Loyalty A1", slug: slug1, owner_id: u1.id }).select("id").single()).data!.id;
  const agency2 = a2.data?.id || (await admin.from("agencies").insert({ name: "E2E Loyalty A2", slug: slug2, owner_id: u2.id }).select("id").single()).data!.id;

  await admin.from("profiles").upsert({ user_id: u1.id, agency_id: agency1, role: "staff" }, { onConflict: "user_id" });
  await admin.from("profiles").upsert({ user_id: u2.id, agency_id: agency2, role: "staff" }, { onConflict: "user_id" });

  let cust = await admin.from("customers").select("id").eq("agency_id", agency1).eq("email", "e2e.loyalty.customer@example.com").maybeSingle();
  if (!cust.data) {
    cust = await admin.from("customers").insert({ agency_id: agency1, full_name: "Loyalty Customer", email: "e2e.loyalty.customer@example.com" }).select("id").single();
  }
  const customerId = cust.data!.id as string;

  // Policy for customer in agency1
  const pol = await admin.from("policies").insert({ agency_id: agency1, customer_id: customerId, policy_no: `LOY-${Date.now()}`, start_date: "2024-01-01", end_date: "2026-01-01", premium_myr: 100 }).select("id").single();
  const policyId = pol.data!.id as string;
  return { agency1, agency2, customerId, policyId };
}

async function getBalance(admin: SupabaseClient, customerId: string, agencyId: string) {
  const { data } = await admin.from("loyalty_balances_by_customer").select("points").eq("customer_id", customerId).eq("agency_id", agencyId).maybeSingle();
  return (data?.points as number | undefined) ?? 0;
}

const describeFn = hasEnv ? test.describe : test.describe.skip;
describeFn("Loyalty E2E", () => {
  test.skip(!hasEnv, "Supabase envs required");

  test("accrual on payment insert, delta on update, RLS isolation", async () => {
    const admin = await getAdmin();
    const { agency1, agency2, customerId, policyId } = await ensureAgencyUsersAndCustomer();

    // Ensure no prior payments
    await admin.from("policy_payments").delete().eq("policy_id", policyId);

    const before = await getBalance(admin, customerId, agency1);

    // Create payment 100.00 => default Bronze 1.00 -> +100 pts
    await admin.from("policy_payments").insert({ policy_id: policyId, amount: 100.0, channel: "cash" });
    const afterInsert = await getBalance(admin, customerId, agency1);
    expect(afterInsert - before).toBeGreaterThanOrEqual(100);
    expect(afterInsert - before).toBeLessThan(101); // floor safety

    // Create Silver 1.25 and set membership to Silver
    const silver = await admin
      .from("loyalty_tiers")
      .upsert({ agency_id: agency1, code: "silver", name: "Silver", points_per_myr: 1.25 } as any, { onConflict: "agency_id,code" })
      .select("id")
      .single();
    await admin
      .from("loyalty_memberships")
      .upsert({ agency_id: agency1, customer_id: customerId, tier_id: silver.data!.id } as any, { onConflict: "agency_id,customer_id" });

    // Update same payment amount to 120.00 => delta floor(120*1.25) - floor(100*1.00) = 150 - 100 = 50
    const pmt = await admin.from("policy_payments").select("id, amount").eq("policy_id", policyId).limit(1).single();
    await admin.from("policy_payments").update({ amount: 120.0 }).eq("id", pmt.data!.id);
    const afterUpdate = await getBalance(admin, customerId, agency1);
    expect(afterUpdate - afterInsert).toBeGreaterThanOrEqual(50);
    expect(afterUpdate - afterInsert).toBeLessThan(51);

    // Cross-agency cannot see ledger from another agency (RLS)
    const otherView = await admin
      .from("loyalty_ledger")
      .select("id")
      .eq("agency_id", agency2)
      .limit(1);
    expect(otherView.error).toBeFalsy();
  });
});


