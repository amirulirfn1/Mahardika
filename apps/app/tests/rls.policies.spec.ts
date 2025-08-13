import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { describe, it, beforeAll, expect } from "vitest";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").toString();
const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").toString();
const serviceRole = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").toString();
const hasEnv = Boolean(url && anon && serviceRole);
const ds = hasEnv ? describe : describe.skip;

async function createUser(admin: SupabaseClient, email: string, password: string) {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  return data.user!;
}

ds("RLS for policies and storage", () => {
  let admin: SupabaseClient;
  let a1: SupabaseClient;
  let a2: SupabaseClient;
  let agency1: string;
  let agency2: string;
  let policyId: string;

  beforeAll(async () => {
    admin = createClient(url, serviceRole);
    a1 = createClient(url, anon);
    a2 = createClient(url, anon);

    const email1 = `user1_${Date.now()}@example.com`;
    const email2 = `user2_${Date.now()}@example.com`;
    const password = "Passw0rd!";

    const u1 = await createUser(admin, email1, password);
    const u2 = await createUser(admin, email2, password);

    const { data: ag1 } = await admin
      .from("agencies")
      .insert({ name: "A1", slug: `a1_${Date.now()}`, owner_id: u1.id })
      .select("id")
      .single();
    const { data: ag2 } = await admin
      .from("agencies")
      .insert({ name: "A2", slug: `a2_${Date.now()}`, owner_id: u2.id })
      .select("id")
      .single();
    agency1 = ag1!.id;
    agency2 = ag2!.id;

    await admin.from("profiles").insert({ user_id: u1.id, agency_id: agency1, role: "staff" });
    await admin.from("profiles").insert({ user_id: u2.id, agency_id: agency2, role: "staff" });

    await a1.auth.signInWithPassword({ email: email1, password });
    await a2.auth.signInWithPassword({ email: email2, password });

    const { data: pol } = await admin
      .from("policies")
      .insert({ agency_id: agency1, customer_id: (await seedCustomer(admin, agency1)), policy_no: `P-${Date.now()}`, start_date: new Date().toISOString(), end_date: new Date().toISOString(), premium_myr: 1 })
      .select("id")
      .single();
    policyId = pol!.id;
  });

  it("denies cross-agency SELECT on policies", async () => {
    const { data } = await a2.from("policies").select("id").eq("id", policyId).maybeSingle();
    expect(data).toBeNull();
  });

  it("allows same-agency signed URL and denies cross-agency", async () => {
    // Upload a dummy small PDF as agency1
    const blob = new Blob(["%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<<>>\nendobj\n"], { type: "application/pdf" });
    const path = `${agency1}/${policyId}.pdf`;
    const { error: upErr } = await a1.storage.from("policy-pdfs").upload(path, blob, { upsert: true, contentType: "application/pdf", metadata: { agency_id: agency1, table_ref: "policies", row_id: policyId } });
    expect(upErr).toBeNull();
    const { data: s1, error: s1e } = await a1.storage.from("policy-pdfs").createSignedUrl(path, 60);
    expect(s1e).toBeNull();
    expect(s1!.signedUrl).toBeTruthy();
    const { data: s2, error: s2e } = await a2.storage.from("policy-pdfs").createSignedUrl(path, 60);
    // Cross-agency should be denied by storage RLS at sign URL creation time
    expect(s2e).toBeTruthy();
    expect(s2).toBeNull();
  });
});

async function seedCustomer(client: SupabaseClient, agency: string) {
  const { data } = await client
    .from("customers")
    .insert({ agency_id: agency, full_name: "C", email: `c_${Date.now()}@e.com` })
    .select("id")
    .single();
  return data!.id as string;
}


