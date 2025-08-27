import { test, expect } from "@playwright/test";

test("@smoke can navigate marketing and toggle theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#home-hero")).toContainText("Mahardika");

  await page.getByRole("link", { name: "Features" }).click();
  await expect(page.getByRole("heading", { name: "Features" })).toBeVisible();

  await page.getByRole("link", { name: /Mahardika/i }).click();
  await expect(page.locator("#home-hero")).toBeVisible();

  await page.locator("#theme-toggle").click();
});



