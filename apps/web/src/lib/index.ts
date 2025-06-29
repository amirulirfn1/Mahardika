import { colors } from "@mahardika/ui";
/**
 * =============================================================================
 * Mahardika Platform - Library Index
 * Brand Colors: Navy colors.navy, Gold colors.gold
 * =============================================================================
 */

// Environment and configuration
export * from './env';

// Supabase client and utilities
export * from './supabase';

// Type definitions
export * from './types/agency';

// Utility functions
export * from './utils/agency';

// Re-export commonly used items for convenience
export { MAHARDIKA_COLORS, DATABASE_CONFIG } from './env';
export {
  supabase,
  resetPassword,
  updatePassword,
  getCurrentUser,
  signOut,
} from './supabase';
export {
  validateAgencyData,
  validateSlugFormat,
  generateSlugFromName,
  formatAgencyForDisplay,
  isSlugAvailable,
  generateUniqueSlug,
  getAgencyById,
  getAgencyBySlug,
  getAgencyProfile,
  searchAgencies,
  createAgency,
  updateAgency,
} from './utils/agency';

export {
  AGENCY_CONSTANTS,
  DEFAULT_BUSINESS_HOURS,
  AgencyValidationError,
  AgencyNotFoundError,
  DuplicateSlugError,
} from './types/agency';

// Export types for TypeScript
export type {
  Agency,
  AgencyProfile,
  CreateAgencyRequest,
  UpdateAgencyRequest,
  AgencySearchParams,
  AgencyListResponse,
  AgencyResponse,
  AgencyProfileResponse,
  BusinessHours,
  AgencyStats,
  Review,
  PolicyType,
  AgencyFilters,
  AgencySlug,
  AgencyId,
} from './types/agency';

export * from './whatsapp';
