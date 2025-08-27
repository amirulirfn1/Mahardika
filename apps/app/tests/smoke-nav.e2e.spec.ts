import { test, expect } from "@playwright/test";

test("@smoke homepage renders and Explore features navigates", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#home-hero")).toContainText("Mahardika");
  await page.getByRole("link", { name: /Explore features/i }).click();
  await expect(page.url()).toMatch(/\/features$/);
});



