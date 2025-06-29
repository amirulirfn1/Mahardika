import { colors } from "@mahardika/ui";
/**
 * Environment Configuration - Mahardika Platform
 * Centralized environment variable management with type safety
 */

// Brand Colors - Fiverr-inspired
export const MAHARDIKA_COLORS = {
  primary: process.env.NEXT_PUBLIC_BRAND_PRIMARY || '#1dbf73',
  secondary: process.env.NEXT_PUBLIC_BRAND_SECONDARY || '#404145',
  accent: process.env.NEXT_PUBLIC_BRAND_ACCENT || '#62646a',
  success: process.env.NEXT_PUBLIC_BRAND_SUCCESS || '#1dbf73',
  warning: process.env.NEXT_PUBLIC_BRAND_WARNING || '#ffb33e',
  error: process.env.NEXT_PUBLIC_BRAND_ERROR || '#e4421e',

  // Legacy support (will be removed in future)
  navy: process.env.NEXT_PUBLIC_BRAND_NAVY || '#404145',
  gold: process.env.NEXT_PUBLIC_BRAND_GOLD || '#1dbf73',
} as const;

// App Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Mahardika',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Feature Flags
export const FEATURES = {
  aiChat: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true',
  marketplace: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE === 'true',
  reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  databaseUrl: process.env.DATABASE_URL || '',
  supabase: {
    enabled: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
} as const;

// AI Configuration
export const AI_CONFIG = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    enabled: Boolean(process.env.DEEPSEEK_API_KEY),
  },
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  virusScan: process.env.ENABLE_VIRUS_SCAN !== 'false',
  pdfCompression: process.env.ENABLE_PDF_COMPRESSION !== 'false',
  clamAvUrl: process.env.CLAMAV_SIGNATURES_URL || '/api/cron/updateClamSig',
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  upload: parseInt(process.env.RATE_LIMIT_UPLOAD || '10', 10),
  aiMessage: parseInt(process.env.RATE_LIMIT_AI_MESSAGE || '50', 10),
} as const;

// Email Configuration
export const EMAIL_CONFIG = {
  resendApiKey: process.env.RESEND_API_KEY || '',
  from: process.env.EMAIL_FROM || 'noreply@mahardika.com',
  enabled: Boolean(process.env.RESEND_API_KEY),
} as const;

// Payment Configuration
export const PAYMENT_CONFIG = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    enabled: Boolean(process.env.STRIPE_SECRET_KEY),
  },
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    enabled: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  },
} as const;

// Helper function to check if we're in production
export const isProduction = () => process.env.NODE_ENV === 'production';

// Helper function to check if we're in development
export const isDevelopment = () => process.env.NODE_ENV === 'development';

// Helper function to get Supabase config
export const getSupabaseConfig = () => {
  if (!DATABASE_CONFIG.supabase.enabled) {
    throw new Error(
      'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return {
    url: DATABASE_CONFIG.supabase.url,
    anonKey: DATABASE_CONFIG.supabase.anonKey,
    serviceKey: DATABASE_CONFIG.supabase.serviceKey,
  };
};

// Helper function to validate environment
export const validateEnvironment = () => {
  const errors: string[] = [];

  // Check required variables for production
  if (isProduction()) {
    if (!DATABASE_CONFIG.databaseUrl) {
      errors.push('DATABASE_URL is required in production');
    }

    if (!DATABASE_CONFIG.supabase.enabled) {
      errors.push('Supabase configuration is required in production');
    }

    if (!process.env.NEXTAUTH_SECRET) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return true;
};

// Type definitions for better TypeScript support
export type MahardikaColors = typeof MAHARDIKA_COLORS;
export type AppConfig = typeof APP_CONFIG;
export type Features = typeof FEATURES;

/**
 * ✅ SAFETY IMPROVEMENT: Safe environment variable getter with validation
 * Prevents runtime crashes from undefined environment variables
 */
export function getRequiredEnvVar(key: string, context?: string): string {
  const value = process.env[key];
  if (!value) {
    const errorMsg = `Missing required environment variable: ${key}${
      context ? ` (required for ${context})` : ''
    }`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return value;
}

/**
 * ✅ SAFETY IMPROVEMENT: Safe Supabase configuration getter
 * Validates required Supabase environment variables
 */
export function getSupabaseServiceKey(): string {
  return getRequiredEnvVar(
    'SUPABASE_SERVICE_ROLE_KEY',
    'Supabase service operations'
  );
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
 * Gets Mahardika brand theme colors
 */
export function getMahardikaTheme() {
  return {
    colors: MAHARDIKA_COLORS,
    isDark: false, // Default theme setting
    primary: MAHARDIKA_COLORS.primary,
    accent: MAHARDIKA_COLORS.accent,
  };
}

/**
 * Environment summary for debugging and logging
 */
export function getEnvironmentSummary() {
  return {
    app: APP_CONFIG,
    features: FEATURES,
    services: {
      deepseek: AI_CONFIG.deepseek.enabled,
      supabase: DATABASE_CONFIG.supabase.enabled,
      stripe: PAYMENT_CONFIG.stripe.enabled,
      analytics: ANALYTICS_CONFIG.posthog.enabled,
    },
    branding: MAHARDIKA_COLORS,
  };
}

// Export all configurations for easy access
const envConfig = {
  colors: MAHARDIKA_COLORS,
  app: APP_CONFIG,
  features: FEATURES,
  database: DATABASE_CONFIG,
  ai: AI_CONFIG,
  security: SECURITY_CONFIG,
  rateLimits: RATE_LIMITS,
  email: EMAIL_CONFIG,
  payment: PAYMENT_CONFIG,
  analytics: ANALYTICS_CONFIG,
  getRequiredEnvVar,
  getSupabaseConfig,
  getSupabaseServiceKey,
  validateEnvironment,
  getEnvVar,
  isDevelopment,
  isProduction,
  getMahardikaTheme,
  getEnvironmentSummary,
};

export default envConfig;
