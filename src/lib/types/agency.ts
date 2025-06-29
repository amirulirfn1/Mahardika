import { colors } from "@mahardika/ui";
/**
 * =============================================================================
 * Mahardika Platform - Agency Types and Interfaces
 * Brand Colors: Navy colors.navy, Gold colors.gold
 * =============================================================================
 */

export interface Agency {
  id: string;
  name: string;
  slug: string;
  hero_image_url?: string;
  tagline?: string;
  about_md?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logo_url?: string;
  business_hours?: BusinessHours;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface AgencyStats {
  total_customers: number;
  active_policies: number;
  total_reviews: number;
  average_rating: number;
  monthly_revenue: number;
  growth_rate: number;
}

export interface AgencyProfile extends Agency {
  stats?: AgencyStats;
  recent_reviews?: Review[];
  featured_policies?: PolicyType[];
}

export interface Review {
  id: string;
  agency_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PolicyType {
  id: string;
  name: string;
  description: string;
  base_premium: number;
  coverage_amount: number;
  is_popular: boolean;
}

// Form types for creating/updating agencies
export interface CreateAgencyRequest {
  name: string;
  slug?: string; // Optional, will be auto-generated if not provided
  hero_image_url?: string;
  tagline?: string;
  about_md?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logo_url?: string;
  business_hours?: BusinessHours;
}

export interface UpdateAgencyRequest extends Partial<CreateAgencyRequest> {
  id: string;
}

// Validation schemas
export interface AgencyValidation {
  name: {
    required: true;
    minLength: 2;
    maxLength: 100;
  };
  slug: {
    pattern: RegExp;
    minLength: 2;
    maxLength: 100;
    unique: true;
  };
  tagline: {
    maxLength: 200;
  };
  about_md: {
    maxLength: 10000;
  };
  email: {
    required: true;
    pattern: RegExp;
  };
  phone: {
    required: true;
    pattern: RegExp;
  };
  hero_image_url: {
    pattern: RegExp;
  };
  website: {
    pattern: RegExp;
  };
  logo_url: {
    pattern: RegExp;
  };
}

// API response types
export interface AgencyListResponse {
  agencies: Agency[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface AgencyResponse {
  agency: Agency;
  success: boolean;
  message?: string;
}

export interface AgencyProfileResponse {
  profile: AgencyProfile;
  success: boolean;
  message?: string;
}

// Search and filter types
export interface AgencySearchParams {
  query?: string;
  is_active?: boolean;
  has_hero_image?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface AgencyFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
  has_hero: 'all' | 'yes' | 'no';
  has_tagline: 'all' | 'yes' | 'no';
}

// Utility types
export type AgencySlug = string;
export type AgencyId = string;

// Constants and defaults
export const AGENCY_CONSTANTS = {
  SLUG_PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s-]+$/,
  URL_PATTERN: /^https?:\/\/.+/,
  MAX_NAME_LENGTH: 100,
  MAX_SLUG_LENGTH: 100,
  MAX_TAGLINE_LENGTH: 200,
  MAX_ABOUT_LENGTH: 10000,
  MIN_SLUG_LENGTH: 2,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: '9:00 AM - 5:00 PM',
  tuesday: '9:00 AM - 5:00 PM',
  wednesday: '9:00 AM - 5:00 PM',
  thursday: '9:00 AM - 5:00 PM',
  friday: '9:00 AM - 5:00 PM',
  saturday: 'Closed',
  sunday: 'Closed',
};

// Error types
export class AgencyValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'AgencyValidationError';
  }
}

export class AgencyNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Agency not found: ${identifier}`);
    this.name = 'AgencyNotFoundError';
  }
}

export class DuplicateSlugError extends Error {
  constructor(slug: string) {
    super(`Agency slug already exists: ${slug}`);
    this.name = 'DuplicateSlugError';
  }
}
