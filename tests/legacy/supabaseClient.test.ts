/**
 * =============================================================================
 * Mahardika Platform - Supabase Client Tests
 * Unit tests for authentication and user services
 * =============================================================================
 */

// Mock environment variables before importing the module
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
};

Object.defineProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL', {
  value: mockEnv.NEXT_PUBLIC_SUPABASE_URL,
  writable: true,
});

Object.defineProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', {
  value: mockEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  writable: true,
});

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}));

// Now import the module after mocking
import { authService, userService, authUtils, AuthUser, AuthError } from '@/lib/supabaseClient';

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authService', () => {
    describe('signUp', () => {
      it('should successfully sign up a new user', async () => {
        const mockUser: AuthUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            name: 'Test User',
            user_type: 'customer',
            first_name: 'Test',
            last_name: 'User',
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signUp.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        const result = await authService.signUp({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          user_type: 'customer',
        });

        expect(result.user).toEqual(mockUser);
        expect(result.error).toBeNull();
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              name: 'Test User',
              user_type: 'customer',
              first_name: 'Test',
              last_name: 'User',
            },
          },
        });
      });

      it('should handle sign up errors', async () => {
        const mockError = {
          message: 'User already registered',
          status: 400,
          name: 'User already registered',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signUp.mockResolvedValue({
          data: { user: null },
          error: mockError,
        });

        const result = await authService.signUp({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          user_type: 'customer',
        });

        expect(result.user).toBeNull();
        expect(result.error).toEqual({
          message: 'User already registered',
          status: 400,
          code: 'User already registered',
        });
      });

      it('should handle unexpected errors', async () => {
        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signUp.mockRejectedValue(new Error('Network error'));

        const result = await authService.signUp({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          user_type: 'customer',
        });

        expect(result.user).toBeNull();
        expect(result.error?.message).toBe('Network error');
      });
    });

    describe('signIn', () => {
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

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        const result = await authService.signIn({
          email: 'test@example.com',
          password: 'password123',
        });

        expect(result.user).toEqual(mockUser);
        expect(result.error).toBeNull();
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      it('should handle sign in errors', async () => {
        const mockError = {
          message: 'Invalid login credentials',
          status: 400,
          name: 'Invalid login credentials',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: { user: null },
          error: mockError,
        });

        const result = await authService.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

        expect(result.user).toBeNull();
        expect(result.error).toEqual({
          message: 'Invalid login credentials',
          status: 400,
          code: 'Invalid login credentials',
        });
      });
    });

    describe('signOut', () => {
      it('should successfully sign out a user', async () => {
        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signOut.mockResolvedValue({
          error: null,
        });

        const result = await authService.signOut();

        expect(result.error).toBeNull();
        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      });

      it('should handle sign out errors', async () => {
        const mockError = {
          message: 'Sign out failed',
          status: 500,
          name: 'Sign out failed',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.signOut.mockResolvedValue({
          error: mockError,
        });

        const result = await authService.signOut();

        expect(result.error).toEqual({
          message: 'Sign out failed',
          status: 500,
          code: 'Sign out failed',
        });
      });
    });

    describe('getCurrentUser', () => {
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

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        const result = await authService.getCurrentUser();

        expect(result.user).toEqual(mockUser);
        expect(result.error).toBeNull();
      });

      it('should handle no current user', async () => {
        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: null,
        });

        const result = await authService.getCurrentUser();

        expect(result.user).toBeNull();
        expect(result.error).toBeNull();
      });
    });
  });

  describe('userService', () => {
    describe('upsertProfile', () => {
      it('should create or update user profile successfully', async () => {
        const mockProfile = {
          id: 'profile-id',
          user_id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          user_type: 'customer',
          status: 'active',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        const mockUpsert = mockSupabase.from().upsert().select().single;
        mockUpsert.mockResolvedValue({
          data: mockProfile,
          error: null,
        });

        const result = await userService.upsertProfile('user-id', {
          name: 'Test User',
          email: 'test@example.com',
          user_type: 'customer',
          status: 'active',
        });

        expect(result.data).toEqual(mockProfile);
        expect(result.error).toBeNull();
      });

      it('should handle profile creation errors', async () => {
        const mockError = {
          message: 'Database error',
          status: 500,
          code: 'PGRST_ERROR',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        const mockUpsert = mockSupabase.from().upsert().select().single;
        mockUpsert.mockResolvedValue({
          data: null,
          error: mockError,
        });

        const result = await userService.upsertProfile('user-id', {
          name: 'Test User',
          email: 'test@example.com',
          user_type: 'customer',
        });

        expect(result.data).toBeNull();
        expect(result.error).toEqual({
          message: 'Database error',
          status: 500,
          code: 'PGRST_ERROR',
        });
      });
    });

    describe('getProfile', () => {
      it('should get user profile successfully', async () => {
        const mockProfile = {
          id: 'profile-id',
          user_id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          user_type: 'customer',
          status: 'active',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        const mockSelect = mockSupabase.from().select().eq().single;
        mockSelect.mockResolvedValue({
          data: mockProfile,
          error: null,
        });

        const result = await userService.getProfile('user-id');

        expect(result.data).toEqual(mockProfile);
        expect(result.error).toBeNull();
      });

      it('should handle profile not found', async () => {
        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        const mockSelect = mockSupabase.from().select().eq().single;
        mockSelect.mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        });

        const result = await userService.getProfile('user-id');

        expect(result.data).toBeNull();
        expect(result.error).toBeNull();
      });
    });
  });

  describe('authUtils', () => {
    describe('isAuthenticated', () => {
      it('should return true when user is authenticated', async () => {
        const mockUser: AuthUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {},
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        const result = await authUtils.isAuthenticated();

        expect(result).toBe(true);
      });

      it('should return false when user is not authenticated', async () => {
        const { createClient } = require('@supabase/supabase-js');
        const mockSupabase = createClient();
        mockSupabase.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: null,
        });

        const result = await authUtils.isAuthenticated();

        expect(result).toBe(false);
      });
    });

    describe('getUserType', () => {
      it('should return customer type', () => {
        const user: AuthUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            user_type: 'customer',
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const result = authUtils.getUserType(user);

        expect(result).toBe('customer');
      });

      it('should return agency type', () => {
        const user: AuthUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            user_type: 'agency',
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const result = authUtils.getUserType(user);

        expect(result).toBe('agency');
      });

      it('should return unknown when no user type', () => {
        const user: AuthUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {},
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        };

        const result = authUtils.getUserType(user);

        expect(result).toBe('unknown');
      });
    });

    describe('formatError', () => {
      it('should format invalid login credentials error', () => {
        const error: AuthError = {
          message: 'Invalid login credentials',
          code: 'Invalid login credentials',
        };

        const result = authUtils.formatError(error);

        expect(result).toBe('Invalid email or password. Please try again.');
      });

      it('should format email not confirmed error', () => {
        const error: AuthError = {
          message: 'Email not confirmed',
          code: 'Email not confirmed',
        };

        const result = authUtils.formatError(error);

        expect(result).toBe('Please check your email and confirm your account before signing in.');
      });

      it('should format user already registered error', () => {
        const error: AuthError = {
          message: 'User already registered',
          code: 'User already registered',
        };

        const result = authUtils.formatError(error);

        expect(result).toBe('An account with this email already exists. Please sign in instead.');
      });

      it('should format password length error', () => {
        const error: AuthError = {
          message: 'Password should be at least 6 characters',
          code: 'Password should be at least 6 characters',
        };

        const result = authUtils.formatError(error);

        expect(result).toBe('Password must be at least 6 characters long.');
      });

      it('should return original message for unknown errors', () => {
        const error: AuthError = {
          message: 'Unknown error occurred',
        };

        const result = authUtils.formatError(error);

        expect(result).toBe('Unknown error occurred');
      });

      it('should return default message when no error message', () => {
        const error: AuthError = {};

        const result = authUtils.formatError(error);

        expect(result).toBe('An unexpected error occurred. Please try again.');
      });
    });
  });
}); 