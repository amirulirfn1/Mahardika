/**
 * =============================================================================
 * Mahardika Platform - Supabase Client Wrapper
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DatabaseResponse, PaginatedResponse } from './types';

// =============================================================================
// CLIENT CONFIGURATION
// =============================================================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
      flowType?: 'pkce' | 'implicit';
    };
    realtime?: {
      params?: {
        eventsPerSecond?: number;
      };
    };
  };
}

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    first_name?: string;
    last_name?: string;
    user_type?: 'customer' | 'agency';
  };
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  user_type: 'customer' | 'agency';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

// =============================================================================
// SUPABASE CLIENT WRAPPER
// =============================================================================

export class MahardikaSupabaseClient {
  private client: SupabaseClient;

  constructor(config: SupabaseConfig) {
    // Validate configuration
    if (!config.url || !config.anonKey) {
      throw new Error(
        'Missing Supabase configuration: url and anonKey are required'
      );
    }

    // Create client with enhanced defaults
    this.client = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        ...config.options?.auth,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
        ...config.options?.realtime,
      },
    });
  }

  // =============================================================================
  // AUTHENTICATION METHODS
  // =============================================================================

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<DatabaseResponse<AuthUser>> {
    try {
      const { data: authData, error } = await this.client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            user_type: data.user_type,
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' ') || '',
          },
        },
      });

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return {
        data: authData.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<DatabaseResponse<AuthUser>> {
    try {
      const { data: authData, error } =
        await this.client.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return {
        data: authData.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<DatabaseResponse<AuthUser>> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return {
        data: user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<DatabaseResponse<AuthSession>> {
    try {
      const {
        data: { session },
        error,
      } = await this.client.auth.getSession();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return {
        data: session as AuthSession,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
    redirectTo?: string
  ): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo:
          redirectTo ||
          `${globalThis.location?.origin || ''}/auth/reset-password`,
      });

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(
    newPassword: string
  ): Promise<DatabaseResponse<AuthUser>> {
    try {
      const { data, error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      return {
        data: data.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.getCurrentUser();
    return data !== null;
  }

  /**
   * Get user type from user metadata
   */
  getUserType(user: AuthUser): 'customer' | 'agency' | 'unknown' {
    return user.user_metadata?.user_type || 'unknown';
  }

  /**
   * Format auth error for user display
   */
  formatAuthError(error: AuthError): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials':
        'Invalid email or password. Please try again.',
      'Email not confirmed':
        'Please check your email and click the confirmation link.',
      'User not found': 'No account found with this email address.',
      'Invalid email': 'Please enter a valid email address.',
      'Password should be at least 6 characters':
        'Password must be at least 6 characters long.',
    };

    return (
      errorMessages[error.message] ||
      error.message ||
      'An unexpected error occurred'
    );
  }

  /**
   * Get the raw Supabase client (for advanced usage)
   */
  getClient(): SupabaseClient {
    return this.client;
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Mahardika Supabase client instance
 */
export function createMahardikaSupabaseClient(
  config: SupabaseConfig
): MahardikaSupabaseClient {
  return new MahardikaSupabaseClient(config);
}

// Export the client class as default
export { MahardikaSupabaseClient as default };
