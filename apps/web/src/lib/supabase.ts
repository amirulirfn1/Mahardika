/**
 * =============================================================================
 * Mahardika Platform - Supabase Client Instance for Web App
 * =============================================================================
 */

import { createMahardikaSupabaseClient } from '@mah/core';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Create and export the Supabase client instance
export const supabase = createMahardikaSupabaseClient({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  options: {
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
  },
});

// Export types for convenience
export type {
  SupabaseConfig,
  AuthUser,
  AuthError,
  AuthSession,
  SignUpData,
  SignInData,
  // Database types
  Agency,
  Customer,
  Policy,
  Vehicle,
  Order,
  Product,
  DatabaseResponse,
  PaginatedResponse,
} from '@mah/core';

// Helper functions for common operations
export const agencyService = {
  // Get agency by slug
  async getBySlug(slug: string): Promise<Agency | null> {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  },

  // Get all active agencies
  async getAll(): Promise<Agency[]> {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get agency reviews
  async getReviews(agencyId: string): Promise<AgencyReview[]> {
    const { data, error } = await supabase
      .from('agency_reviews')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },
};

// Mock data for development when Supabase is not available
export const mockAgencyData: Agency = {
  id: 'mock-agency-1',
  slug: 'premium-insurance-solutions',
  name: 'Premium Insurance Solutions',
  tagline: 'Your trusted partner for comprehensive insurance coverage',
  description:
    'We provide comprehensive insurance solutions for individuals and businesses. With over 20 years of experience, we offer personalized service and competitive rates across all major insurance categories.',
  banner_image_url:
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop&crop=center',
  logo_url:
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&crop=center',
  website_url: 'https://premiuminsurance.example.com',
  contact_email: 'info@premiuminsurance.example.com',
  contact_phone: '+1 (555) 123-4567',
  rating: 4.8,
  review_count: 127,
  status: 'active',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockReviewsData: AgencyReview[] = [
  {
    id: 'review-1',
    agency_id: 'mock-agency-1',
    reviewer_name: 'Sarah Johnson',
    rating: 5,
    comment:
      'Excellent service and very competitive rates. The team was professional and helped me find the perfect coverage for my family.',
    status: 'approved',
    created_at: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'review-2',
    agency_id: 'mock-agency-1',
    reviewer_name: 'Michael Chen',
    rating: 5,
    comment:
      'Outstanding customer service. They made the insurance process simple and stress-free.',
    status: 'approved',
    created_at: '2024-01-10T14:20:00.000Z',
  },
  {
    id: 'review-3',
    agency_id: 'mock-agency-1',
    reviewer_name: 'Emily Rodriguez',
    rating: 4,
    comment:
      'Great experience overall. Quick response times and knowledgeable agents.',
    status: 'approved',
    created_at: '2024-01-05T09:15:00.000Z',
  },
];

// Development helper to check if Supabase is available
export function isSupabaseConfigured(): boolean {
  return true; // Always true as we are using the core package directly
}

/**
 * Password reset functionality
 */
export const resetPassword = async (email: string, redirectTo?: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Update password after reset
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};
