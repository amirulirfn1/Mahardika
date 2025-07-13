/**
 * =============================================================================
 * Mahardika Platform - Security Tests
 * Playwright tests for CSRF protection and session security
 * =============================================================================
 */

import { test, expect, type Page } from '@playwright/test';

const TEST_BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Security Tests', () => {
  test.describe('CSRF Protection', () => {
    test('should reject POST requests without CSRF token', async ({ page }) => {
      // Test signup endpoint without CSRF token
      const response = await page.request.post(
        `${TEST_BASE_URL}/api/auth/signup`,
        {
          data: {
            email: 'test@example.com',
            password: 'SecurePassword123!@#',
            name: 'Test User',
            user_type: 'customer',
          },
        }
      );

      expect(response.status()).toBe(403);
      const responseBody = await response.json();
      expect(responseBody.error).toMatch(/CSRF/i);
    });

    test('should reject POST requests with invalid CSRF token', async ({
      page,
    }) => {
      const response = await page.request.post(
        `${TEST_BASE_URL}/api/auth/signup`,
        {
          headers: {
            'x-csrf-token': 'invalid-token',
          },
          data: {
            email: 'test@example.com',
            password: 'SecurePassword123!@#',
            name: 'Test User',
            user_type: 'customer',
          },
        }
      );

      expect(response.status()).toBe(403);
      const responseBody = await response.json();
      expect(responseBody.error).toMatch(/CSRF/i);
    });

    test('should accept requests with valid CSRF token from cookie and header', async ({
      page,
    }) => {
      // First, visit a page to get CSRF token set in cookie
      await page.goto(`${TEST_BASE_URL}/auth/sign-up`);

      // Get CSRF token from cookie
      const cookies = await page.context().cookies();
      const csrfCookie = cookies.find(cookie => cookie.name === 'csrf-token');

      if (csrfCookie) {
        const response = await page.request.post(
          `${TEST_BASE_URL}/api/auth/signup`,
          {
            headers: {
              'x-csrf-token': csrfCookie.value,
              Cookie: `csrf-token=${csrfCookie.value}`,
            },
            data: {
              email: `test-${Date.now()}@example.com`,
              password: 'SecurePassword123!@#',
              name: 'Test User',
              user_type: 'customer',
            },
          }
        );

        // Should not be rejected for CSRF (might fail for other reasons like duplicate email)
        expect(response.status()).not.toBe(403);
        if (response.status() === 403) {
          const responseBody = await response.json();
          expect(responseBody.error).not.toMatch(/CSRF/i);
        }
      }
    });

    test('should protect payment proof upload', async ({ page }) => {
      const response = await page.request.post(
        `${TEST_BASE_URL}/api/payments/proof`,
        {
          multipart: {
            file: {
              name: 'test.jpg',
              mimeType: 'image/jpeg',
              buffer: Buffer.from('fake-image-data'),
            },
            orderId: 'test-order-123',
          },
        }
      );

      expect(response.status()).toBe(403);
      const responseBody = await response.json();
      expect(responseBody.error).toMatch(/CSRF/i);
    });

    test('should protect checkout endpoint', async ({ page }) => {
      const response = await page.request.post(
        `${TEST_BASE_URL}/api/checkout`,
        {
          data: {
            customerId: 'test-customer',
            items: [
              {
                productId: 'test-product',
                quantity: 1,
                price: 10.0,
              },
            ],
          },
        }
      );

      expect(response.status()).toBe(403);
      const responseBody = await response.json();
      expect(responseBody.error).toMatch(/CSRF/i);
    });
  });

  test.describe('Password Policy', () => {
    test('should reject weak passwords', async ({ page }) => {
      // Get CSRF token first
      await page.goto(`${TEST_BASE_URL}/auth/sign-up`);
      const cookies = await page.context().cookies();
      const csrfCookie = cookies.find(cookie => cookie.name === 'csrf-token');

      if (csrfCookie) {
        const weakPasswords = [
          'weak',
          '12345678',
          'password',
          'Password1',
          'Pass123',
          'simplepass',
        ];

        for (const password of weakPasswords) {
          const response = await page.request.post(
            `${TEST_BASE_URL}/api/auth/signup`,
            {
              headers: {
                'x-csrf-token': csrfCookie.value,
                Cookie: `csrf-token=${csrfCookie.value}`,
              },
              data: {
                email: `test-${Date.now()}@example.com`,
                password: password,
                name: 'Test User',
                user_type: 'customer',
              },
            }
          );

          expect(response.status()).toBe(400);
          const responseBody = await response.json();
          expect(responseBody.error).toMatch(/password/i);
        }
      }
    });

    test('should accept strong passwords', async ({ page }) => {
      // Get CSRF token first
      await page.goto(`${TEST_BASE_URL}/auth/sign-up`);
      const cookies = await page.context().cookies();
      const csrfCookie = cookies.find(cookie => cookie.name === 'csrf-token');

      if (csrfCookie) {
        const strongPassword = 'MyVerySecure@Password123!';

        const response = await page.request.post(
          `${TEST_BASE_URL}/api/auth/signup`,
          {
            headers: {
              'x-csrf-token': csrfCookie.value,
              Cookie: `csrf-token=${csrfCookie.value}`,
            },
            data: {
              email: `test-strong-${Date.now()}@example.com`,
              password: strongPassword,
              name: 'Test User',
              user_type: 'customer',
            },
          }
        );

        // Should not fail due to password policy
        if (response.status() === 400) {
          const responseBody = await response.json();
          expect(responseBody.error).not.toMatch(
            /password.*security.*requirements/i
          );
        }
      }
    });
  });

  test.describe('Session Security', () => {
    test('should set secure session cookies', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/auth/sign-in`);

      const cookies = await page.context().cookies();

      // Check for secure cookie attributes
      cookies.forEach(cookie => {
        if (
          cookie.name.includes('supabase') ||
          cookie.name.includes('auth') ||
          cookie.name === 'csrf-token'
        ) {
          expect(cookie.httpOnly).toBeTruthy();
          expect(cookie.sameSite).toBe('Strict');

          // In production, should be secure
          if (process.env.NODE_ENV === 'production') {
            expect(cookie.secure).toBeTruthy();
          }
        }
      });
    });

    test('should expire sessions after 24 hours', async ({ page }) => {
      // This test verifies that session cookies have the correct maxAge
      await page.goto(`${TEST_BASE_URL}/auth/sign-in`);

      const cookies = await page.context().cookies();
      const sessionCookies = cookies.filter(
        cookie =>
          cookie.name.includes('supabase') || cookie.name.includes('auth')
      );

      sessionCookies.forEach(cookie => {
        // Check that session cookies have appropriate expiry (within 24 hours)
        const maxAge = 24 * 60 * 60; // 24 hours in seconds
        const cookieExpiry = Math.floor(
          (cookie.expires || 0) - Date.now() / 1000
        );

        expect(cookieExpiry).toBeLessThanOrEqual(maxAge + 60); // Allow 1 minute tolerance
      });
    });

    test('should require authentication for protected routes', async ({
      page,
    }) => {
      // Test that protected routes redirect to sign-in or return 401
      const protectedRoutes = [
        '/dashboard',
        '/customer/policies',
        '/agency/dashboard',
      ];

      for (const route of protectedRoutes) {
        const response = await page.goto(`${TEST_BASE_URL}${route}`);

        // Should either redirect to sign-in or return 401/403
        if (response) {
          const status = response.status();
          const url = response.url();

          expect(
            status === 401 ||
              status === 403 ||
              url.includes('/auth/sign-in') ||
              url.includes('/auth/')
          ).toBeTruthy();
        }
      }
    });
  });

  test.describe('Content Security Policy', () => {
    test('should set CSP headers', async ({ page }) => {
      const response = await page.goto(`${TEST_BASE_URL}/`);

      if (response) {
        const headers = response.headers();
        expect(headers['content-security-policy']).toBeDefined();

        const csp = headers['content-security-policy'];
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain("object-src 'none'");
        expect(csp).toContain("base-uri 'self'");
      }
    });

    test('should set other security headers', async ({ page }) => {
      const response = await page.goto(`${TEST_BASE_URL}/`);

      if (response) {
        const headers = response.headers();

        expect(headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['x-xss-protection']).toBe('1; mode=block');
        expect(headers['strict-transport-security']).toContain('max-age=');
        expect(headers['referrer-policy']).toBe('origin-when-cross-origin');
      }
    });
  });

  test.describe('Input Validation', () => {
    test('should validate email format in signup', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/auth/sign-up`);
      const cookies = await page.context().cookies();
      const csrfCookie = cookies.find(cookie => cookie.name === 'csrf-token');

      if (csrfCookie) {
        const invalidEmails = [
          'invalid-email',
          '@domain.com',
          'user@',
          'user.domain',
          '',
        ];

        for (const email of invalidEmails) {
          const response = await page.request.post(
            `${TEST_BASE_URL}/api/auth/signup`,
            {
              headers: {
                'x-csrf-token': csrfCookie.value,
                Cookie: `csrf-token=${csrfCookie.value}`,
              },
              data: {
                email: email,
                password: 'ValidPassword123!@#',
                name: 'Test User',
                user_type: 'customer',
              },
            }
          );

          expect(response.status()).toBe(400);
          const responseBody = await response.json();
          expect(responseBody.error).toMatch(/validation|email/i);
        }
      }
    });
  });
});
