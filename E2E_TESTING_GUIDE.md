# End-to-End Testing Guide

## Overview

This guide covers the baseline E2E tests for the Mahardika Insurance Admin Platform using Playwright.

## Setup

Playwright is already configured. To run tests:

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests with UI mode (recommended for development)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed
```

## Test Coverage

### Smoke Tests (`e2e/smoke.spec.ts`)

- ✅ Login page loads and displays correctly
- ✅ Navigation between dashboard pages works
- ✅ Dashboard pages load without errors
- ✅ Responsive layout works on mobile viewport
- ✅ Login form validation works
- ✅ All pages have proper accessibility attributes
- ✅ 404 page handling
- ✅ Network failure handling

## Cross-Role Testing Scenarios

### Admin Role Tests

```typescript
// TODO: Implement when authentication is complete
test("admin can manage users", async ({ page }) => {
  // Login as admin
  // Navigate to users page
  // Create, edit, delete user
  // Verify permissions
});

test("admin can view all policies", async ({ page }) => {
  // Login as admin
  // Navigate to policies
  // Verify all policies visible
  // Test policy filters/search
});
```

### Staff Role Tests

```typescript
// TODO: Implement when authentication is complete
test("staff can process payments", async ({ page }) => {
  // Login as staff
  // Navigate to payments
  // Process payment
  // Generate invoice
});

test("staff can manage vehicles", async ({ page }) => {
  // Login as staff
  // Add new vehicle
  // Update vehicle details
  // Associate with policy
});
```

### Customer Portal Tests

```typescript
// TODO: Implement when customer portal is ready
test("customer can view policies and download cover note", async ({ page }) => {
  // Login as customer
  // View policy list
  // Select policy
  // Download cover note PDF
  // Verify PDF content
});
```

## Running Tests in CI/CD

### GitHub Actions Integration

Add to `.github/workflows/test.yml`:

```yaml
- name: Run Playwright tests
  run: |
    cd apps/admin-web
    pnpm test:e2e
```

### Test Reports

- HTML reports generated in `playwright-report/`
- Screenshots and videos in `test-results/`
- Traces available for debugging failed tests

## Test Data Management

### Environment Setup

```bash
# Local development
cp .env.example .env.local
# Set test database credentials
```

### Test Database

- Use separate test database
- Seed with minimal test data
- Clean up after tests

## Best Practices

### Writing Tests

1. **Use data-testid for stable selectors**

   ```typescript
   await page.getByTestId("user-form-submit").click();
   ```

2. **Wait for network requests**

   ```typescript
   await page.waitForResponse(/\/api\/users/);
   ```

3. **Test user flows, not implementation**
   ```typescript
   // Good: Test complete user journey
   await login("admin@example.com");
   await createUser({ name: "Test User" });
   await verifyUserExists("Test User");
   ```

### Debugging Tests

```bash
# Run single test with debugging
pnpm test:e2e --debug smoke.spec.ts

# Generate and view trace
pnpm test:e2e --trace on
```

## Performance Testing

```typescript
test("page loads within acceptable time", async ({ page }) => {
  const start = Date.now();
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

## Accessibility Testing

```typescript
test("pages are accessible", async ({ page }) => {
  await page.goto("/login");

  // Check color contrast
  // Verify keyboard navigation
  // Test screen reader compatibility
  // Validate ARIA labels
});
```

## Future Enhancements

### Integration Tests

- Supabase authentication flows
- Database operations
- Email sending (when implemented)
- File uploads/downloads

### Visual Regression Testing

```typescript
test("visual regression - login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveScreenshot("login-page.png");
});
```

### API Testing

```typescript
test("API endpoints work correctly", async ({ request }) => {
  const response = await request.get("/api/users");
  expect(response.status()).toBe(200);
});
```

## Maintenance

### Regular Tasks

1. Update test data when schema changes
2. Review and update selectors
3. Add tests for new features
4. Monitor test execution times
5. Update browser versions

### Monthly Reviews

- Analyze test coverage reports
- Review flaky tests
- Update testing strategy
- Performance baseline updates
