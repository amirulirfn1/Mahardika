import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Skip suite if env is not provided
const hasEnv = Boolean(url && anon && serviceRole);

async function signInAndSetCookies(page: any, email: string, password: string) {
  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw error || new Error("No session");
  const { access_token, refresh_token } = data.session;
  const baseURL = new URL(process.env.E2E_BASE_URL || "http://localhost:3000");
  await page.context().addCookies([
    { name: "sb-access-token", value: access_token, url: baseURL.origin, httpOnly: true, sameSite: "Lax" },
    { name: "sb-refresh-token", value: refresh_token, url: baseURL.origin, httpOnly: true, sameSite: "Lax" },
  ]);
}

async function getAdmin(): Promise<SupabaseClient> {
  if (!hasEnv) throw new Error('Missing Supabase env');
  // @ts-ignore service role
  return createClient(url, serviceRole);
}

async function getOrCreateUser(admin: SupabaseClient, email: string, password: string) {
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const found = listed.data.users?.find((u) => u.email === email);
  if (found) return found;
  return (await admin.auth.admin.createUser({ email, password, email_confirm: true })).data.user!;
}

async function ensureBuiltInData() {
  const admin = await getAdmin();
  const email1 = "e2e.agency1@example.com";
  const email2 = "e2e.agency2@example.com";
  const password = "Passw0rd!";

  const user1 = await getOrCreateUser(admin, email1, password);
  const user2 = await getOrCreateUser(admin, email2, password);

  // Agencies
  const slug1 = "e2e-agency-1";
  const slug2 = "e2e-agency-2";
  const a1 = await admin.from("agencies").select("id, slug").eq("slug", slug1).maybeSingle();
  const a2 = await admin.from("agencies").select("id, slug").eq("slug", slug2).maybeSingle();
  const agency1 = a1.data?.id || (await admin.from("agencies").insert({ name: "E2E Agency 1", slug: slug1, owner_id: user1.id }).select("id").single()).data!.id;
  const agency2 = a2.data?.id || (await admin.from("agencies").insert({ name: "E2E Agency 2", slug: slug2, owner_id: user2.id }).select("id").single()).data!.id;

  // Profiles upsert
  await admin.from("profiles").upsert({ user_id: user1.id, agency_id: agency1, role: "staff" }, { onConflict: "user_id" });
  await admin.from("profiles").upsert({ user_id: user2.id, agency_id: agency2, role: "staff" }, { onConflict: "user_id" });

  // Ensure at least one customer in agency1
  const custEmail = "e2e.customer@example.com";
  const existing = await admin.from("customers").select("id").eq("agency_id", agency1).eq("email", custEmail).maybeSingle();
  const customerId = existing.data?.id || (await admin.from("customers").insert({ agency_id: agency1, full_name: "E2E Customer", email: custEmail }).select("id").single()).data!.id;

  return { email1, email2, password, agency1, agency2, customerId };
}

const describeFn = hasEnv ? test.describe : test.describe.skip;
describeFn("Policies E2E", () => {
  test.skip(!hasEnv, "Supabase envs required");
  test.beforeAll(async () => {
    if (!hasEnv) return;
    await ensureBuiltInData();
  });

  test("create policy with PDF, view detail and signed URL, replace PDF, search, cross-agency denied", async ({ page, context }) => {
    const { email1, password, agency2, email2 } = await ensureBuiltInData();

    await signInAndSetCookies(page, email1, password);

    // Create policy
    await page.goto("/dashboard/agency/policies/new");
    const policyNo = `E2E-${Date.now()}`;
    await page.getByLabel("Policy No").fill(policyNo);
    await page.getByLabel("Premium (MYR)").fill("1.23");
    await page.getByLabel("Start Date").fill("2023-01-01");
    await page.getByLabel("End Date").fill("2025-01-01");
    await page.getByLabel("Customer").selectOption({ index: 1 });
    await page.getByLabel("Policy PDF").setInputFiles("apps/app/tests/fixtures/policy-a.pdf");
    await page.getByRole("button", { name: /create|save/i }).click();

    await page.waitForURL(/\/dashboard\/agency\/policies\//);
    const detailUrl = page.url();
    const firstSignedUrl = (await page.getByRole("link", { name: /Open PDF/ }).getAttribute("href")) || "";
    expect(firstSignedUrl).toContain("policy-pdfs");

    // Replace PDF
    await page.getByRole("link", { name: /Edit/ }).click();
    await page.waitForURL(/\/dashboard\/agency\/policies\/.+\/edit/);
    await page.getByLabel("Policy PDF").setInputFiles("apps/app/tests/fixtures/policy-b.pdf");
    await page.getByRole("button", { name: /update|save/i }).click();
    await page.waitForURL(detailUrl);
    const secondSignedUrl = (await page.getByRole("link", { name: /Open PDF/ }).getAttribute("href")) || "";
    expect(secondSignedUrl).not.toEqual(firstSignedUrl);

    // Search by policy number
    await page.goto("/dashboard/agency/policies");
    await page.getByPlaceholder(/search policy/i).fill(policyNo);
    await page.getByRole("button", { name: /search/i }).click();
    await expect(page.getByText(policyNo)).toBeVisible();

    // Cross-agency denial
    // Switch to user2 in separate context
    const page2 = await context.newPage();
    await signInAndSetCookies(page2, email2, password);
    await page2.goto(detailUrl);
    // Expect safe redirect or not found
    const isNotFound = await page2.getByText(/not found|unauthorized/i).first().isVisible().catch(() => false);
    const stillOnDetail = /\/dashboard\/agency\/policies\//.test(page2.url());
    expect(isNotFound || !stillOnDetail).toBeTruthy();
  });
});


