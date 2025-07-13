/**
 * =============================================================================
 * Mahardika Platform - Sign In Actions Tests
 * Unit tests for authentication server actions
 * =============================================================================
 */

import {
  signInAction,
  signOutAction,
  getCurrentUserAction,
  checkAuthAction,
  redirectToDashboardAction,
  handleAuthError,
  SignInResult,
} from '@/app/(auth)/signin/actions';
import {
  authService,
  authUtils,
  AuthUser,
  AuthError,
} from '@/lib/supabaseClient';

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  authService: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
  },
  authUtils: {
    isAuthenticated: jest.fn(),
    getUserType: jest.fn(),
    formatError: jest.fn(),
  },
}));

// Mock Next.js functions
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Sign In Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInAction', () => {
    it('should successfully sign in a user', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          user_type: 'customer',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authService.signIn as jest.Mock).mockResolvedValue({
        user: mockUser,
        error: null,
      });

      const result = await signInAction('test@example.com', 'password123');

      expect(result).toEqual({
        success: true,
        user: mockUser,
      });
      expect(authService.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle missing email and password', async () => {
      const result = await signInAction('', '');

      expect(result).toEqual({
        success: false,
        error: 'Email and password are required',
      });
      expect(authService.signIn).not.toHaveBeenCalled();
    });

    it('should handle authentication errors', async () => {
      const mockError: AuthError = {
        message: 'Invalid login credentials',
        status: 400,
        code: 'Invalid login credentials',
      };

      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        error: mockError,
      });

      (authUtils.formatError as jest.Mock).mockReturnValue(
        'Invalid email or password. Please try again.'
      );

      const result = await signInAction('test@example.com', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: 'Invalid email or password. Please try again.',
      });
      expect(authUtils.formatError).toHaveBeenCalledWith(mockError);
    });

    it('should handle no user returned', async () => {
      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        error: null,
      });

      const result = await signInAction('test@example.com', 'password123');

      expect(result).toEqual({
        success: false,
        error: 'Authentication failed. Please check your credentials.',
      });
    });

    it('should handle unexpected errors', async () => {
      (authService.signIn as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await signInAction('test@example.com', 'password123');

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      });
    });
  });

  describe('signOutAction', () => {
    it('should successfully sign out a user', async () => {
      (authService.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await signOutAction();

      expect(result).toEqual({
        success: true,
      });
      expect(authService.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const mockError: AuthError = {
        message: 'Sign out failed',
        status: 500,
        code: 'Sign out failed',
      };

      (authService.signOut as jest.Mock).mockResolvedValue({
        error: mockError,
      });

      (authUtils.formatError as jest.Mock).mockReturnValue('Sign out failed');

      const result = await signOutAction();

      expect(result).toEqual({
        success: false,
        error: 'Sign out failed',
      });
      expect(authUtils.formatError).toHaveBeenCalledWith(mockError);
    });

    it('should handle unexpected errors', async () => {
      (authService.signOut as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await signOutAction();

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred during sign out.',
      });
    });
  });

  describe('getCurrentUserAction', () => {
    it('should get current user successfully', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          user_type: 'customer',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        error: null,
      });

      const result = await getCurrentUserAction();

      expect(result).toEqual({
        user: mockUser,
      });
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });

    it('should handle get current user errors', async () => {
      const mockError: AuthError = {
        message: 'Failed to get user',
        status: 500,
        code: 'Failed to get user',
      };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        user: null,
        error: mockError,
      });

      (authUtils.formatError as jest.Mock).mockReturnValue(
        'Failed to get current user.'
      );

      const result = await getCurrentUserAction();

      expect(result).toEqual({
        user: null,
        error: 'Failed to get current user.',
      });
      expect(authUtils.formatError).toHaveBeenCalledWith(mockError);
    });

    it('should handle unexpected errors', async () => {
      (authService.getCurrentUser as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await getCurrentUserAction();

      expect(result).toEqual({
        user: null,
        error: 'Failed to get current user.',
      });
    });
  });

  describe('checkAuthAction', () => {
    it('should return authenticated user', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          user_type: 'customer',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authUtils.isAuthenticated as jest.Mock).mockResolvedValue(true);
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        error: null,
      });

      const result = await checkAuthAction();

      expect(result).toEqual({
        isAuthenticated: true,
        user: mockUser,
      });
    });

    it('should return not authenticated', async () => {
      (authUtils.isAuthenticated as jest.Mock).mockResolvedValue(false);

      const result = await checkAuthAction();

      expect(result).toEqual({
        isAuthenticated: false,
      });
    });

    it('should handle errors gracefully', async () => {
      (authUtils.isAuthenticated as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await checkAuthAction();

      expect(result).toEqual({
        isAuthenticated: false,
      });
    });
  });

  describe('redirectToDashboardAction', () => {
    it('should redirect customer to customer dashboard', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          user_type: 'customer',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authUtils.getUserType as jest.Mock).mockReturnValue('customer');

      const { redirect } = require('next/navigation');

      await redirectToDashboardAction(mockUser);

      expect(authUtils.getUserType).toHaveBeenCalledWith(mockUser);
      expect(redirect).toHaveBeenCalledWith('/customer/dashboard');
    });

    it('should redirect agency to agency dashboard', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          user_type: 'agency',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authUtils.getUserType as jest.Mock).mockReturnValue('agency');

      const { redirect } = require('next/navigation');

      await redirectToDashboardAction(mockUser);

      expect(authUtils.getUserType).toHaveBeenCalledWith(mockUser);
      expect(redirect).toHaveBeenCalledWith('/agency/dashboard');
    });

    it('should redirect unknown user type to default dashboard', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {},
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authUtils.getUserType as jest.Mock).mockReturnValue('unknown');

      const { redirect } = require('next/navigation');

      await redirectToDashboardAction(mockUser);

      expect(authUtils.getUserType).toHaveBeenCalledWith(mockUser);
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle errors and redirect to default dashboard', async () => {
      const mockUser: AuthUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {},
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      (authUtils.getUserType as jest.Mock).mockImplementation(() => {
        throw new Error('Error getting user type');
      });

      const { redirect } = require('next/navigation');

      await redirectToDashboardAction(mockUser);

      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('handleAuthError', () => {
    it('should format auth error using authUtils', () => {
      const mockError: AuthError = {
        message: 'Invalid login credentials',
        code: 'Invalid login credentials',
      };

      (authUtils.formatError as jest.Mock).mockReturnValue(
        'Invalid email or password. Please try again.'
      );

      const result = handleAuthError(mockError);

      expect(result).toBe('Invalid email or password. Please try again.');
      expect(authUtils.formatError).toHaveBeenCalledWith(mockError);
    });
  });
});
