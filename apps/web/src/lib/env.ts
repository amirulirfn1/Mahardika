/**
 * Environment Variables Configuration - Mahardika Platform
 * Centralized environment variable handling with type safety
 */

// Mahardika Brand Colors
export const MAHARDIKA_COLORS = {
  navy: process.env.NEXT_PUBLIC_BRAND_NAVY || '#0D1B2A',
  gold: process.env.NEXT_PUBLIC_BRAND_GOLD || '#F4B400',
} as const;

// Application Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Mahardika Platform',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
} as const;

// API Configuration
export const API_CONFIG = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    enabled: !!process.env.DEEPSEEK_API_KEY,
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  aiChat: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  securityStatus: process.env.NEXT_PUBLIC_ENABLE_SECURITY_STATUS === 'true',
  debugMode: process.env.DEBUG_MODE === 'true',
} as const;

// Database Configuration (if available)
export const DATABASE_CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    enabled: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  },
  databaseUrl: process.env.DATABASE_URL,
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    enabled: !!process.env.NEXTAUTH_SECRET,
  },
} as const;

// External Services Configuration
export const EXTERNAL_SERVICES = {
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    enabled: !!(process.env.STRIPE_PUBLIC_KEY && process.env.STRIPE_SECRET_KEY),
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    enabled: !!process.env.SENDGRID_API_KEY,
  },
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  googleAnalytics: {
    id: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    measurementId: process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
    enabled: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    enabled: !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  },
  vercel: {
    analyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    enabled: !!process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  },
} as const;

// Type definitions for better TypeScript support
export type MahardikaColors = typeof MAHARDIKA_COLORS;
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof FEATURE_FLAGS;

/**
 * Validates required environment variables for the application
 * @returns Array of missing required environment variables
 */
export function validateEnvironment(): string[] {
  const missing: string[] = [];

  // Check required variables based on environment
  if (APP_CONFIG.environment === 'production') {
    if (!API_CONFIG.deepseek.apiKey) {
      missing.push('DEEPSEEK_API_KEY');
    }
    if (!AUTH_CONFIG.nextAuth.secret) {
      missing.push('NEXTAUTH_SECRET');
    }
  }

  return missing;
}

/**
 * Gets environment variable with fallback and type checking
 * @param key Environment variable key
 * @param fallback Fallback value
 * @returns Environment variable value or fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = process.env[key];
  return value !== undefined ? value : fallback;
}

/**
 * Checks if application is running in development mode
 */
export function isDevelopment(): boolean {
  return APP_CONFIG.environment === 'development';
}

/**
 * Checks if application is running in production mode
 */
export function isProduction(): boolean {
  return APP_CONFIG.environment === 'production';
}

/**
 * Gets Mahardika brand theme colors
 */
export function getMahardikaTheme() {
  return {
    colors: MAHARDIKA_COLORS,
    isDark: false, // Default theme setting
    primary: MAHARDIKA_COLORS.navy,
    accent: MAHARDIKA_COLORS.gold,
  };
}

/**
 * Environment summary for debugging and logging
 */
export function getEnvironmentSummary() {
  return {
    app: APP_CONFIG,
    features: FEATURE_FLAGS,
    services: {
      deepseek: API_CONFIG.deepseek.enabled,
      supabase: DATABASE_CONFIG.supabase.enabled,
      stripe: EXTERNAL_SERVICES.stripe.enabled,
      analytics: ANALYTICS_CONFIG.googleAnalytics.enabled,
    },
    branding: MAHARDIKA_COLORS,
  };
}

// Export all configurations for easy access
export default {
  colors: MAHARDIKA_COLORS,
  app: APP_CONFIG,
  api: API_CONFIG,
  features: FEATURE_FLAGS,
  database: DATABASE_CONFIG,
  auth: AUTH_CONFIG,
  external: EXTERNAL_SERVICES,
  analytics: ANALYTICS_CONFIG,
  validateEnvironment,
  getEnvVar,
  isDevelopment,
  isProduction,
  getMahardikaTheme,
  getEnvironmentSummary,
};
