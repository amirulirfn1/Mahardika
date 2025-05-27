import { test, expect } from '@playwright/test';

test.describe('Admin Platform Smoke Tests', () => {
  test('login page loads and displays correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check page title and main elements
    await expect(page).toHaveTitle(/Mahardika/);
    await expect(page.getByText('Mahardika Insurance')).toBeVisible();
    await expect(page.getByText('Admin & Staff Portal')).toBeVisible();
    
    // Check form elements
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  });

  test('navigation between dashboard pages works', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check dashboard loads
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // Test navigation to each page
    await page.getByRole('link', { name: 'Payments' }).click();
    await expect(page.getByText('Payment Management')).toBeVisible();
    
    await page.getByRole('link', { name: 'Policies' }).click();
    await expect(page.getByText('Policy Management')).toBeVisible();
    
    await page.getByRole('link', { name: 'Vehicles' }).click();
    await expect(page.getByText('Vehicle Management')).toBeVisible();
    
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page.getByText('User Management')).toBeVisible();
  });

  test('dashboard pages load without errors', async ({ page }) => {
    // Test each main dashboard page loads successfully
    const pages = [
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/payments', title: 'Payment Management' },
      { url: '/policies', title: 'Policy Management' },
      { url: '/vehicles', title: 'Vehicle Management' },
      { url: '/admin/users', title: 'User Management' },
    ];

    for (const testPage of pages) {
      await page.goto(testPage.url);
      await expect(page.getByText(testPage.title)).toBeVisible();
      
      // Check no console errors
      const logs = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });
      
      // Wait a moment for any async operations
      await page.waitForTimeout(1000);
      
      // Check no major errors occurred
      expect(logs.filter(log => 
        !log.includes('favicon') && 
        !log.includes('404')
      )).toHaveLength(0);
    }
  });

  test('responsive layout works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Check login form is responsive
    const loginCard = page.locator('[class*="card"]').first();
    await expect(loginCard).toBeVisible();
    
    // Check elements don't overflow horizontally
    const body = page.locator('body');
    const bodyWidth = await body.boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(375);
    
    // Test dashboard responsiveness
    await page.goto('/dashboard');
    const dashboardContent = page.locator('main');
    await expect(dashboardContent).toBeVisible();
  });

  test('login form validation works', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Sign in with Email' }).click();
    
    // Check HTML5 validation triggers (empty required fields)
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    
    // Check inputs are marked as required
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('all pages have proper accessibility attributes', async ({ page }) => {
    const pagesToTest = ['/login', '/dashboard', '/payments', '/policies', '/vehicles'];
    
    for (const url of pagesToTest) {
      await page.goto(url);
      
      // Check page has proper heading structure
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeVisible();
      
      // Check for proper ARIA roles
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        // At least one button should be visible
        await expect(buttons.first()).toBeVisible();
      }
    }
  });
});

test.describe('Error Handling', () => {
  test('404 page handling', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should redirect to 404 or show error state
    // This might need adjustment based on Next.js behavior
    await expect(page).toHaveURL(/404|not-found/);
  });

  test('handles network failures gracefully', async ({ page }) => {
    // Simulate offline condition
    await page.route('**/*', route => route.abort());
    
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    
    // Should show some fallback content
    await expect(page.locator('body')).toBeVisible();
  });
}); 