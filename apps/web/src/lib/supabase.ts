import { createClient } from '@supabase/supabase-js';
import { DATABASE_CONFIG } from './env';

// Database types
export interface Agency {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  banner_image_url?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  rating?: number;
  review_count?: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface AgencyReview {
  id: string;
  agency_id: string;
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

// Create Supabase client
function createSupabaseClient() {
  if (!DATABASE_CONFIG.supabase.enabled) {
    throw new Error(
      'Supabase configuration is incomplete. Please check your environment variables.'
    );
  }

  return createClient(
    DATABASE_CONFIG.supabase.url!,
    DATABASE_CONFIG.supabase.anonKey!,
    {
      auth: {
        persistSession: false, // We're not using auth in this example
      },
    }
  );
}

// Export the client (will throw if not configured)
export const supabase = createSupabaseClient();

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
  return DATABASE_CONFIG.supabase.enabled;
}
