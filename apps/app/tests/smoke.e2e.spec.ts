import { test, expect } from '@playwright/test';

test('@smoke home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Get started/i)).toBeVisible();
});

test('@smoke policies list loads', async ({ page }) => {
  await page.goto('/dashboard/agency/policies');
  await expect(page.getByRole('heading', { name: 'Policies' })).toBeVisible();
});


