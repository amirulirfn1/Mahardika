/**
 * =============================================================================
 * Mahardika Platform - Session Security
 * Secure session configuration and management
 * =============================================================================
 */

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Secure session configuration
export const SESSION_CONFIG = {
  // Session duration: 24 hours
  maxAge: 24 * 60 * 60, // 24 hours in seconds

  // Rolling sessions: extend session on activity
  rolling: true,

  // Secure cookie settings
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // Auto-refresh settings
  autoRefreshToken: true,
  detectSessionInUrl: true,
  persistSession: true,

  // Security headers for session-related responses
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
} as const;

/**
 * Create a hardened Supabase server client with secure session settings
 */
export function createSecureServerClient(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({
            name,
            value,
            ...SESSION_CONFIG.cookieOptions,
            ...options,
          });
        } catch (error) {
          console.error('Failed to set secure cookie:', error);
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({
            name,
            value: '',
            ...SESSION_CONFIG.cookieOptions,
            ...options,
            maxAge: 0,
          });
        } catch (error) {
          console.error('Failed to remove secure cookie:', error);
        }
      },
    },
    auth: {
      autoRefreshToken: SESSION_CONFIG.autoRefreshToken,
      persistSession: SESSION_CONFIG.persistSession,
      detectSessionInUrl: SESSION_CONFIG.detectSessionInUrl,
    },
  });
}

/**
 * Create a hardened Supabase browser client with secure session settings
 */
export function createSecureBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: SESSION_CONFIG.autoRefreshToken,
      persistSession: SESSION_CONFIG.persistSession,
      detectSessionInUrl: SESSION_CONFIG.detectSessionInUrl,
    },
  });
}

/**
 * Validate session security and check for potential security issues
 */
export interface SessionValidation {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

export async function validateSessionSecurity(
  sessionData: any
): Promise<SessionValidation> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!sessionData) {
    issues.push('No active session found');
    return { isValid: false, issues, recommendations };
  }

  // Check session expiry
  const now = new Date();
  const expiresAt = new Date(sessionData.expires_at * 1000);
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();

  if (timeUntilExpiry <= 0) {
    issues.push('Session has expired');
  } else if (timeUntilExpiry < 5 * 60 * 1000) {
    // Less than 5 minutes
    recommendations.push('Session expires soon, consider refreshing');
  }

  // Check session age
  const createdAt = new Date(sessionData.created_at);
  const sessionAge = now.getTime() - createdAt.getTime();
  const maxSessionAge = SESSION_CONFIG.maxAge * 1000;

  if (sessionAge > maxSessionAge) {
    issues.push('Session has exceeded maximum age');
  }

  // Check for suspicious activity patterns
  if (sessionData.user?.last_sign_in_at) {
    const lastSignIn = new Date(sessionData.user.last_sign_in_at);
    const timeSinceLastSignIn = now.getTime() - lastSignIn.getTime();

    // If last sign-in was more than 7 days ago, recommend re-authentication
    if (timeSinceLastSignIn > 7 * 24 * 60 * 60 * 1000) {
      recommendations.push('Consider re-authenticating for enhanced security');
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Get security headers for session-related responses
 */
export function getSessionSecurityHeaders(): Record<string, string> {
  return SESSION_CONFIG.securityHeaders;
}

/**
 * Force session logout with security cleanup
 */
export async function secureLogout(supabaseClient: any): Promise<void> {
  try {
    // Sign out from Supabase
    await supabaseClient.auth.signOut();

    // Clear any additional security-related storage
    if (typeof window !== 'undefined') {
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (
          key.includes('supabase') ||
          key.includes('auth') ||
          key.includes('session')
        ) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (
          key.includes('supabase') ||
          key.includes('auth') ||
          key.includes('session')
        ) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Secure logout failed:', error);
    throw error;
  }
}

/**
 * Check if session needs refresh based on security policy
 */
export function shouldRefreshSession(sessionData: any): boolean {
  if (!sessionData) return false;

  const now = new Date();
  const expiresAt = new Date(sessionData.expires_at * 1000);
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();

  // Refresh if less than 10 minutes remaining
  return timeUntilExpiry < 10 * 60 * 1000;
}
