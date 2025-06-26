/**
 * =============================================================================
 * Mahardika Platform - Agency Utility Functions
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { supabase } from '@/lib/supabase';
import {
  Agency,
  AgencyProfile,
  CreateAgencyRequest,
  UpdateAgencyRequest,
  AgencySearchParams,
  AgencyListResponse,
  AgencyResponse,
  AgencyProfileResponse,
  AgencyValidationError,
  AgencyNotFoundError,
  DuplicateSlugError,
  AGENCY_CONSTANTS,
} from '@/lib/types/agency';

/**
 * Validates agency data
 */
export function validateAgencyData(data: Partial<CreateAgencyRequest>): void {
  const errors: { field: string; message: string; code: string }[] = [];

  // Name validation
  if (!data.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Agency name is required',
      code: 'REQUIRED',
    });
  } else if (data.name.length > AGENCY_CONSTANTS.MAX_NAME_LENGTH) {
    errors.push({
      field: 'name',
      message: `Agency name must be ${AGENCY_CONSTANTS.MAX_NAME_LENGTH} characters or less`,
      code: 'MAX_LENGTH',
    });
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.push({
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED',
    });
  } else if (!AGENCY_CONSTANTS.EMAIL_PATTERN.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
      code: 'INVALID_FORMAT',
    });
  }

  // Phone validation
  if (!data.phone?.trim()) {
    errors.push({
      field: 'phone',
      message: 'Phone number is required',
      code: 'REQUIRED',
    });
  } else if (!AGENCY_CONSTANTS.PHONE_PATTERN.test(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number',
      code: 'INVALID_FORMAT',
    });
  }

  // Slug validation (if provided)
  if (data.slug && !validateSlugFormat(data.slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      code: 'INVALID_FORMAT',
    });
  }

  // Tagline validation
  if (
    data.tagline &&
    data.tagline.length > AGENCY_CONSTANTS.MAX_TAGLINE_LENGTH
  ) {
    errors.push({
      field: 'tagline',
      message: `Tagline must be ${AGENCY_CONSTANTS.MAX_TAGLINE_LENGTH} characters or less`,
      code: 'MAX_LENGTH',
    });
  }

  // About markdown validation
  if (
    data.about_md &&
    data.about_md.length > AGENCY_CONSTANTS.MAX_ABOUT_LENGTH
  ) {
    errors.push({
      field: 'about_md',
      message: `About section must be ${AGENCY_CONSTANTS.MAX_ABOUT_LENGTH} characters or less`,
      code: 'MAX_LENGTH',
    });
  }

  // URL validations
  if (
    data.hero_image_url &&
    !AGENCY_CONSTANTS.URL_PATTERN.test(data.hero_image_url)
  ) {
    errors.push({
      field: 'hero_image_url',
      message: 'Hero image URL must be a valid HTTP/HTTPS URL',
      code: 'INVALID_FORMAT',
    });
  }

  if (data.website && !AGENCY_CONSTANTS.URL_PATTERN.test(data.website)) {
    errors.push({
      field: 'website',
      message: 'Website URL must be a valid HTTP/HTTPS URL',
      code: 'INVALID_FORMAT',
    });
  }

  if (data.logo_url && !AGENCY_CONSTANTS.URL_PATTERN.test(data.logo_url)) {
    errors.push({
      field: 'logo_url',
      message: 'Logo URL must be a valid HTTP/HTTPS URL',
      code: 'INVALID_FORMAT',
    });
  }

  // Throw first error if any
  if (errors.length > 0) {
    const firstError = errors[0];
    throw new AgencyValidationError(
      firstError.message,
      firstError.field,
      firstError.code
    );
  }
}

/**
 * Validates slug format
 */
export function validateSlugFormat(slug: string): boolean {
  return (
    slug.length >= AGENCY_CONSTANTS.MIN_SLUG_LENGTH &&
    slug.length <= AGENCY_CONSTANTS.MAX_SLUG_LENGTH &&
    AGENCY_CONSTANTS.SLUG_PATTERN.test(slug)
  );
}

/**
 * Generates a slug from agency name
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, AGENCY_CONSTANTS.MAX_SLUG_LENGTH);
}

/**
 * Checks if a slug is available
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  try {
    let query = supabase
      .from('agencies')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.length === 0;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
}

/**
 * Generates a unique slug
 */
export async function generateUniqueSlug(
  baseName: string,
  excludeId?: string
): Promise<string> {
  let baseSlug = generateSlugFromName(baseName);

  if (!baseSlug || baseSlug.length < AGENCY_CONSTANTS.MIN_SLUG_LENGTH) {
    baseSlug = 'agency';
  }

  let finalSlug = baseSlug;
  let counter = 1;

  while (!(await isSlugAvailable(finalSlug, excludeId))) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;

    // Prevent infinite loop
    if (counter > 9999) {
      finalSlug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return finalSlug;
}

/**
 * Fetches agency by ID
 */
export async function getAgencyById(id: string): Promise<Agency> {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AgencyNotFoundError(id);
      }
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof AgencyNotFoundError) {
      throw error;
    }
    console.error('Error fetching agency by ID:', error);
    throw new Error('Failed to fetch agency');
  }
}

/**
 * Fetches agency by slug
 */
export async function getAgencyBySlug(slug: string): Promise<Agency> {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AgencyNotFoundError(slug);
      }
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof AgencyNotFoundError) {
      throw error;
    }
    console.error('Error fetching agency by slug:', error);
    throw new Error('Failed to fetch agency');
  }
}

/**
 * Fetches agency profile with stats and reviews
 */
export async function getAgencyProfile(
  identifier: string
): Promise<AgencyProfile> {
  try {
    // First get the agency
    const agency = identifier.includes('-')
      ? await getAgencyBySlug(identifier)
      : await getAgencyById(identifier);

    // Fetch additional profile data in parallel
    const [reviewsData, statsData] = await Promise.all([
      // Fetch recent reviews
      supabase
        .from('reviews')
        .select('*')
        .eq('agency_id', agency.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5),

      // Fetch stats (simplified for now)
      supabase
        .from('reviews')
        .select('rating')
        .eq('agency_id', agency.id)
        .eq('is_active', true),
    ]);

    const profile: AgencyProfile = {
      ...agency,
      recent_reviews: reviewsData.data || [],
      stats: statsData.data ? calculateAgencyStats(statsData.data) : undefined,
    };

    return profile;
  } catch (error) {
    if (error instanceof AgencyNotFoundError) {
      throw error;
    }
    console.error('Error fetching agency profile:', error);
    throw new Error('Failed to fetch agency profile');
  }
}

/**
 * Calculates agency stats from review data
 */
function calculateAgencyStats(reviews: { rating: number }[]): any {
  if (reviews.length === 0) {
    return {
      total_customers: 0,
      active_policies: 0,
      total_reviews: 0,
      average_rating: 0,
      monthly_revenue: 0,
      growth_rate: 0,
    };
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    total_customers: 0, // Would need to query customers table
    active_policies: 0, // Would need to query policies table
    total_reviews: reviews.length,
    average_rating: Math.round(averageRating * 10) / 10,
    monthly_revenue: 0, // Would need to calculate from policies
    growth_rate: 0, // Would need historical data
  };
}

/**
 * Searches agencies with filters and pagination
 */
export async function searchAgencies(
  params: AgencySearchParams = {}
): Promise<AgencyListResponse> {
  try {
    const {
      query,
      is_active = true,
      has_hero_image,
      page = 1,
      limit = AGENCY_CONSTANTS.DEFAULT_PAGE_SIZE,
      sort_by = 'name',
      sort_order = 'asc',
    } = params;

    // Build the query
    let supabaseQuery = supabase
      .from('agencies')
      .select('*', { count: 'exact' });

    // Apply filters
    if (is_active !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', is_active);
    }

    if (has_hero_image !== undefined) {
      if (has_hero_image) {
        supabaseQuery = supabaseQuery.not('hero_image_url', 'is', null);
      } else {
        supabaseQuery = supabaseQuery.is('hero_image_url', null);
      }
    }

    // Text search
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,tagline.ilike.%${query}%`
      );
    }

    // Sorting
    supabaseQuery = supabaseQuery.order(sort_by, {
      ascending: sort_order === 'asc',
    });

    // Pagination
    const from = (page - 1) * limit;
    supabaseQuery = supabaseQuery.range(from, from + limit - 1);

    const { data, error, count } = await supabaseQuery;

    if (error) {
      throw error;
    }

    const total = count || 0;
    const hasMore = from + limit < total;

    return {
      agencies: data || [],
      total,
      page,
      limit,
      has_more: hasMore,
    };
  } catch (error) {
    console.error('Error searching agencies:', error);
    throw new Error('Failed to search agencies');
  }
}

/**
 * Creates a new agency
 */
export async function createAgency(data: CreateAgencyRequest): Promise<Agency> {
  try {
    // Validate data
    validateAgencyData(data);

    // Generate slug if not provided, or check availability
    if (!data.slug) {
      data.slug = await generateUniqueSlug(data.name);
    } else if (!(await isSlugAvailable(data.slug))) {
      throw new DuplicateSlugError(data.slug);
    }

    const { data: agency, error } = await supabase
      .from('agencies')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return agency;
  } catch (error) {
    if (
      error instanceof AgencyValidationError ||
      error instanceof DuplicateSlugError
    ) {
      throw error;
    }
    console.error('Error creating agency:', error);
    throw new Error('Failed to create agency');
  }
}

/**
 * Updates an existing agency
 */
export async function updateAgency(data: UpdateAgencyRequest): Promise<Agency> {
  try {
    const { id, ...updateData } = data;

    // Validate data
    validateAgencyData(updateData);

    // Check if slug is being updated and is available
    if (updateData.slug && !(await isSlugAvailable(updateData.slug, id))) {
      throw new DuplicateSlugError(updateData.slug);
    }

    const { data: agency, error } = await supabase
      .from('agencies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AgencyNotFoundError(id);
      }
      throw error;
    }

    return agency;
  } catch (error) {
    if (
      error instanceof AgencyValidationError ||
      error instanceof DuplicateSlugError ||
      error instanceof AgencyNotFoundError
    ) {
      throw error;
    }
    console.error('Error updating agency:', error);
    throw new Error('Failed to update agency');
  }
}

/**
 * Formats agency data for display
 */
export function formatAgencyForDisplay(agency: Agency) {
  return {
    ...agency,
    display_name: agency.name,
    profile_url: `/agencies/${agency.slug}`,
    logo_url: agency.logo_url || '/images/default-agency-logo.png',
    hero_image_url: agency.hero_image_url || '/images/default-hero.jpg',
    formatted_phone: formatPhoneNumber(agency.phone),
    business_hours_formatted: formatBusinessHours(agency.business_hours),
  };
}

/**
 * Formats phone number for display
 */
function formatPhoneNumber(phone: string): string {
  // Simple phone formatting - can be enhanced based on requirements
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
  }

  return phone; // Return original if format not recognized
}

/**
 * Formats business hours for display
 */
function formatBusinessHours(hours?: any): string[] {
  if (!hours) return [];

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return days.map(
    (day, index) => `${dayNames[index]}: ${hours[day] || 'Closed'}`
  );
}
