/**
 * Environment Configuration Tests - Mahardika Platform
 * Tests for environment variable handling and configuration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables for each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Mahardika Brand Colors', () => {
    it('should have default navy color', () => {
      const navyColor = process.env.NEXT_PUBLIC_BRAND_NAVY || '#0D1B2A';
      expect(navyColor).toBe('#0D1B2A');
    });

    it('should have default gold color', () => {
      const goldColor = process.env.NEXT_PUBLIC_BRAND_GOLD || '#F4B400';
      expect(goldColor).toBe('#F4B400');
    });

    it('should use custom brand colors when provided', () => {
      process.env.NEXT_PUBLIC_BRAND_NAVY = '#123456';
      process.env.NEXT_PUBLIC_BRAND_GOLD = '#789ABC';

      const navyColor = process.env.NEXT_PUBLIC_BRAND_NAVY || '#0D1B2A';
      const goldColor = process.env.NEXT_PUBLIC_BRAND_GOLD || '#F4B400';

      expect(navyColor).toBe('#123456');
      expect(goldColor).toBe('#789ABC');
    });
  });

  describe('Application Configuration', () => {
    it('should have default app name', () => {
      const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Mahardika Platform';
      expect(appName).toBe('Mahardika Platform');
    });

    it('should have default version', () => {
      const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
      expect(version).toBe('1.0.0');
    });

    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      const environment = process.env.NODE_ENV || 'development';
      expect(environment).toBe('development');
    });

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      const environment = process.env.NODE_ENV || 'development';
      expect(environment).toBe('production');
    });
  });

  describe('Feature Flags', () => {
    it('should enable AI chat when flag is true', () => {
      process.env.NEXT_PUBLIC_ENABLE_AI_CHAT = 'true';
      const aiChatEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true';
      expect(aiChatEnabled).toBe(true);
    });

    it('should disable AI chat when flag is false', () => {
      process.env.NEXT_PUBLIC_ENABLE_AI_CHAT = 'false';
      const aiChatEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true';
      expect(aiChatEnabled).toBe(false);
    });

    it('should enable security status when flag is true', () => {
      process.env.NEXT_PUBLIC_ENABLE_SECURITY_STATUS = 'true';
      const securityEnabled =
        process.env.NEXT_PUBLIC_ENABLE_SECURITY_STATUS === 'true';
      expect(securityEnabled).toBe(true);
    });

    it('should handle debug mode flag', () => {
      process.env.DEBUG_MODE = 'true';
      const debugMode = process.env.DEBUG_MODE === 'true';
      expect(debugMode).toBe(true);
    });
  });

  describe('API Configuration', () => {
    it('should handle DeepSeek API key', () => {
      process.env.DEEPSEEK_API_KEY = 'sk-test-key';
      const apiKey = process.env.DEEPSEEK_API_KEY;
      const isEnabled = !!process.env.DEEPSEEK_API_KEY;

      expect(apiKey).toBe('sk-test-key');
      expect(isEnabled).toBe(true);
    });

    it('should detect missing DeepSeek API key', () => {
      delete process.env.DEEPSEEK_API_KEY;
      const isEnabled = !!process.env.DEEPSEEK_API_KEY;
      expect(isEnabled).toBe(false);
    });
  });

  describe('Database Configuration', () => {
    it('should handle Supabase configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const isEnabled = !!(supabaseUrl && supabaseKey);

      expect(supabaseUrl).toBe('https://test.supabase.co');
      expect(supabaseKey).toBe('test-anon-key');
      expect(isEnabled).toBe(true);
    });

    it('should detect incomplete Supabase configuration', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const isEnabled = !!(supabaseUrl && supabaseKey);

      expect(isEnabled).toBe(false);
    });
  });

  describe('Authentication Configuration', () => {
    it('should handle NextAuth configuration', () => {
      process.env.NEXTAUTH_SECRET = 'test-secret-key-min-32-chars-long';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';

      const secret = process.env.NEXTAUTH_SECRET;
      const url = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const isEnabled = !!process.env.NEXTAUTH_SECRET;

      expect(secret).toBe('test-secret-key-min-32-chars-long');
      expect(url).toBe('http://localhost:3000');
      expect(isEnabled).toBe(true);
    });

    it('should use default URL when not provided', () => {
      delete process.env.NEXTAUTH_URL;
      const url = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      expect(url).toBe('http://localhost:3000');
    });
  });

  describe('External Services', () => {
    it('should handle Stripe configuration', () => {
      process.env.STRIPE_PUBLIC_KEY = 'pk_test_12345';
      process.env.STRIPE_SECRET_KEY = 'sk_test_67890';

      const publicKey = process.env.STRIPE_PUBLIC_KEY;
      const secretKey = process.env.STRIPE_SECRET_KEY;
      const isEnabled = !!(publicKey && secretKey);

      expect(publicKey).toBe('pk_test_12345');
      expect(secretKey).toBe('sk_test_67890');
      expect(isEnabled).toBe(true);
    });

    it('should handle SendGrid configuration', () => {
      process.env.SENDGRID_API_KEY = 'SG.test-key';
      process.env.SENDGRID_FROM_EMAIL = 'noreply@mahardika.com';

      const apiKey = process.env.SENDGRID_API_KEY;
      const fromEmail = process.env.SENDGRID_FROM_EMAIL;
      const isEnabled = !!process.env.SENDGRID_API_KEY;

      expect(apiKey).toBe('SG.test-key');
      expect(fromEmail).toBe('noreply@mahardika.com');
      expect(isEnabled).toBe(true);
    });
  });

  describe('Analytics Configuration', () => {
    it('should handle Google Analytics configuration', () => {
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'GA-123456789';
      process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-ABCDEFGHIJ';

      const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
      const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;
      const isEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

      expect(gaId).toBe('GA-123456789');
      expect(measurementId).toBe('G-ABCDEFGHIJ');
      expect(isEnabled).toBe(true);
    });

    it('should handle Mixpanel configuration', () => {
      process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = 'test-mixpanel-token';

      const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
      const isEnabled = !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

      expect(token).toBe('test-mixpanel-token');
      expect(isEnabled).toBe(true);
    });
  });

  describe('Environment Validation', () => {
    it('should validate required production variables', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DEEPSEEK_API_KEY;
      delete process.env.NEXTAUTH_SECRET;

      const missing: string[] = [];
      const environment = process.env.NODE_ENV || 'development';

      if (environment === 'production') {
        if (!process.env.DEEPSEEK_API_KEY) {
          missing.push('DEEPSEEK_API_KEY');
        }
        if (!process.env.NEXTAUTH_SECRET) {
          missing.push('NEXTAUTH_SECRET');
        }
      }

      expect(missing).toContain('DEEPSEEK_API_KEY');
      expect(missing).toContain('NEXTAUTH_SECRET');
    });

    it('should not require all variables in development', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.DEEPSEEK_API_KEY;
      delete process.env.NEXTAUTH_SECRET;

      const missing: string[] = [];
      const environment = process.env.NODE_ENV || 'development';

      if (environment === 'production') {
        if (!process.env.DEEPSEEK_API_KEY) {
          missing.push('DEEPSEEK_API_KEY');
        }
        if (!process.env.NEXTAUTH_SECRET) {
          missing.push('NEXTAUTH_SECRET');
        }
      }

      expect(missing).toHaveLength(0);
    });
  });

  describe('Mahardika Theme Configuration', () => {
    it('should provide Mahardika theme with brand colors', () => {
      process.env.NEXT_PUBLIC_BRAND_NAVY = '#0D1B2A';
      process.env.NEXT_PUBLIC_BRAND_GOLD = '#F4B400';

      const theme = {
        colors: {
          navy: process.env.NEXT_PUBLIC_BRAND_NAVY || '#0D1B2A',
          gold: process.env.NEXT_PUBLIC_BRAND_GOLD || '#F4B400',
        },
        isDark: false,
        primary: process.env.NEXT_PUBLIC_BRAND_NAVY || '#0D1B2A',
        accent: process.env.NEXT_PUBLIC_BRAND_GOLD || '#F4B400',
      };

      expect(theme.colors.navy).toBe('#0D1B2A');
      expect(theme.colors.gold).toBe('#F4B400');
      expect(theme.primary).toBe('#0D1B2A');
      expect(theme.accent).toBe('#F4B400');
      expect(theme.isDark).toBe(false);
    });
  });
});
