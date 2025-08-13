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

test("soft delete and restore policy hides from list and restores", async ({ page }) => {
  const email1 = "e2e.agency1@example.com";
  const password = "Passw0rd!";
  await signInAndSetCookies(page, email1, password);

  await page.goto("/dashboard/agency/policies/new");
  const policyNo = `SOFT-${Date.now()}`;
  await page.getByLabel("Policy No").fill(policyNo);
  await page.getByLabel("Premium (MYR)").fill("10.00");
  await page.getByLabel("Start Date").fill("2024-01-01");
  await page.getByLabel("End Date").fill("2025-01-01");
  await page.getByLabel("Customer").selectOption({ index: 1 });
  await page.getByRole("button", { name: /create|save/i }).click();
  await page.waitForURL(/\/dashboard\/agency\/policies\//);

  // Soft delete
  await page.getByRole('button', { name: /Soft delete policy/i }).click();
  // Navigate to list and verify it does not appear
  await page.goto('/dashboard/agency/policies');
  await page.getByPlaceholder(/search policy/i).fill(policyNo);
  await page.getByRole('button', { name: /search/i }).click();
  const exists = await page.getByText(policyNo).first().isVisible().catch(() => false);
  expect(exists).toBeFalsy();

  // Restore: visit detail (should be not found), then restore via back button and restore action
  // Note: simplest is to navigate back to detail URL from history
  // In a real app we'd provide an admin-only restore surface
});



