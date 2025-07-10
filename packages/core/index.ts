/**
 * =============================================================================
 * Mahardika Platform - Core Package Exports
 * =============================================================================
 */

// Security exports
export { validateCSRF, generateCSRFToken } from './security/csrf';
export { createRateLimiter } from './security/rateLimit';
export { 
  validatePassword, 
  hashPassword, 
  verifyPassword, 
  generateSalt,
  getPasswordStrength 
} from './security/passwordSecurity';

// Supabase exports
export { 
  createMahardikaSupabaseClient, 
  MahardikaSupabaseClient as default 
} from './supabase/client';
export type {
  SupabaseConfig,
  AuthUser,
  AuthError,
  AuthSession,
  SignUpData,
  SignInData,
} from './supabase/client';

// Database types exports
export type {
  // Base types
  BaseEntity,
  DatabaseResponse,
  PaginatedResponse,
  BaseFilters,
  
  // Enums
  UserRole,
  AgencyStatus,
  CustomerStatus,
  OrderStatus,
  PaymentStatus,
  ReviewStatus,
  InsuranceType,
  PolicyStatus,
  ClaimStatus,
  DSRType,
  DSRStatus,
  DSRPriority,
  
  // Entity types
  User,
  Agency,
  Customer,
  Policy,
  Vehicle,
  Claim,
  Order,
  OrderItem,
  Product,
  Payment,
  Review,
  Document,
  Notification,
  AuditLog,
  DSRRequest,
  DSRAuditLog,
  UserConsent,
  
  // Filter types
  AgencyFilters,
  CustomerFilters,
  PolicyFilters,
  
  // Extended types
  AgencyWithOwner,
  PolicyWithCustomer,
  OrderWithItems,
  ClaimWithPolicy,
  ReviewWithCustomer,
  
  // Function response types
  DSRStatistics,
} from './supabase/types'; 