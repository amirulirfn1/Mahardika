/**
 * =============================================================================
 * Mahardika Platform - Sign In Actions
 * Server actions for authentication handling
 * =============================================================================
 */

'use server';

import { authService, authUtils, AuthError } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface SignInResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Sign in action for server-side authentication
 */
export async function signInAction(
  email: string,
  password: string
): Promise<SignInResult> {
  try {
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    // Attempt to sign in
    const { user, error } = await authService.signIn({ email, password });

    if (error) {
      return {
        success: false,
        error: authUtils.formatError(error),
      };
    }

    if (!user) {
      return {
        success: false,
        error: 'Authentication failed. Please check your credentials.',
      };
    }

    // Revalidate the current page to update any cached data
    revalidatePath('/');

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Sign out action
 */
export async function signOutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await authService.signOut();

    if (error) {
      return {
        success: false,
        error: authUtils.formatError(error),
      };
    }

    // Revalidate the current page
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign out.',
    };
  }
}

/**
 * Get current user action
 */
export async function getCurrentUserAction(): Promise<{ user: any | null; error?: string }> {
  try {
    const { user, error } = await authService.getCurrentUser();

    if (error) {
      return {
        user: null,
        error: authUtils.formatError(error),
      };
    }

    return { user };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      user: null,
      error: 'Failed to get current user.',
    };
  }
}

/**
 * Check authentication status
 */
export async function checkAuthAction(): Promise<{ isAuthenticated: boolean; user?: any }> {
  try {
    const isAuthenticated = await authUtils.isAuthenticated();
    
    if (isAuthenticated) {
      const { user } = await authService.getCurrentUser();
      return { isAuthenticated: true, user };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error('Check auth error:', error);
    return { isAuthenticated: false };
  }
}

/**
 * Redirect to dashboard based on user type
 */
export async function redirectToDashboardAction(user: any): Promise<void> {
  try {
    const userType = authUtils.getUserType(user);
    
    switch (userType) {
      case 'customer':
        redirect('/customer/dashboard');
        break;
      case 'agency':
        redirect('/agency/dashboard');
        break;
      default:
        redirect('/dashboard');
    }
  } catch (error) {
    console.error('Redirect error:', error);
    redirect('/dashboard');
  }
}

/**
 * Handle authentication error and return user-friendly message
 */
export async function handleAuthError(error: AuthError): Promise<string> {
  return authUtils.formatError(error);
} 