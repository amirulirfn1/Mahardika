import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

test.skip(!(url && anon), "Supabase envs required");

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

test("create payment and list; cross-agency denied", async ({ page, context }) => {
  const email1 = "e2e.agency1@example.com";
  const email2 = "e2e.agency2@example.com";
  const password = "Passw0rd!";

  await signInAndSetCookies(page, email1, password);

  // Create a new policy to attach payment to
  await page.goto("/dashboard/agency/policies/new");
  const policyNo = `PAY-${Date.now()}`;
  await page.getByLabel("Policy No").fill(policyNo);
  await page.getByLabel("Premium (MYR)").fill("9.99");
  await page.getByLabel("Start Date").fill("2024-01-01");
  await page.getByLabel("End Date").fill("2025-01-01");
  await page.getByLabel("Customer").selectOption({ index: 1 });
  await page.getByRole("button", { name: /create|save/i }).click();

  await page.waitForURL(/\/dashboard\/agency\/policies\//);
  const detailUrl = page.url();

  // Navigate to payments and create one
  await page.getByRole("link", { name: /Manage/ }).click();
  await page.waitForURL(/\/payments$/);
  await page.getByLabel("Amount").fill("12.34");
  await page.getByLabel("Channel").selectOption("cash");
  await page.getByLabel("Reference").fill("E2E-REF");
  await page.getByRole("button", { name: /Add Payment/i }).click();

  // Payment appears in list
  await expect(page.getByText("12.34")).toBeVisible();

  // Cross-agency denial: try opening this payments page as the other user
  const page2 = await context.newPage();
  await signInAndSetCookies(page2, email2, password);
  await page2.goto(page.url());
  const denied = await page2.getByText(/not found|unauthorized|forbidden/i).first().isVisible().catch(() => false);
  expect(denied || page2.url() !== page.url()).toBeTruthy();
});


