/**
 * =============================================================================
 * Mahardika Platform - Supabase Client for Web App
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { createClient } from '@supabase/supabase-js';
import { DATABASE_CONFIG } from './env';

// Types for authentication
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    first_name?: string;
    last_name?: string;
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

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create Supabase client with enhanced configuration
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Authentication service
export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabaseClient.auth.signUp({
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
          user: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return {
        user: authData.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return {
        user: authData.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Get the current user session
   */
  async getCurrentUser(): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return {
        user: user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Get the current session
   */
  async getSession(): Promise<{ session: any | null; error: AuthError | null }> {
    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession();

      if (error) {
        return {
          session: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return {
        session,
        error: null,
      };
    } catch (error) {
      return {
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Reset password for email
   */
  async resetPassword(email: string, redirectTo?: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.name,
          },
        };
      }

      return {
        user: data.user as AuthUser,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },
};

// Database service for user profiles
export const userService = {
  /**
   * Create or update user profile
   */
  async upsertProfile(userId: string, profile: any): Promise<{ data: any | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.code,
          },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<{ data: any | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return { data: null, error: null };
        }
        return {
          data: null,
          error: {
            message: error.message,
            status: error.status,
            code: error.code,
          },
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },
};

// Utility functions
export const authUtils = {
  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { user } = await authService.getCurrentUser();
    return !!user;
  },

  /**
   * Get user type from metadata
   */
  getUserType(user: AuthUser): 'customer' | 'agency' | 'unknown' {
    return (user.user_metadata?.user_type as 'customer' | 'agency') || 'unknown';
  },

  /**
   * Format auth error for display
   */
  formatError(error: AuthError): string {
    switch (error.code) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.';
      case 'Email not confirmed':
        return 'Please check your email and confirm your account before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  },
};

// Export the main client for direct use
export default supabaseClient; 