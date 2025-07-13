/**
 * =============================================================================
 * Mahardika Platform - Supabase Database Types
 * Generated from Database Schema - Comprehensive Type Definitions
 * =============================================================================
 */

// =============================================================================
// ENUMS
// =============================================================================

export type UserRole =
  | 'admin'
  | 'agency_owner'
  | 'agent'
  | 'customer'
  | 'support';
export type AgencyStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type CustomerStatus = 'active' | 'inactive' | 'suspended';
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'CLEARED'
  | 'CANCELLED'
  | 'REFUNDED';
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type InsuranceType =
  | 'auto'
  | 'home'
  | 'life'
  | 'health'
  | 'business'
  | 'travel'
  | 'marine'
  | 'cyber';
export type PolicyStatus =
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'pending'
  | 'suspended';
export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'paid'
  | 'closed';
export type DSRType = 'export' | 'delete' | 'rectify';
export type DSRStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'cancelled';
export type DSRPriority = 'low' | 'normal' | 'high' | 'urgent';

// =============================================================================
// BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// USER TYPES
// =============================================================================

export interface User extends BaseEntity {
  email: string;
  password_hash?: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  email_verified: boolean;
  email_verified_at?: string;
  password_reset_token?: string;
  password_reset_expires?: string;
  is_active: boolean;
  last_login_at?: string;
  profile_data: Record<string, any>;
  preferences: Record<string, any>;
}

// =============================================================================
// AGENCY TYPES
// =============================================================================

export interface Agency extends BaseEntity {
  owner_id?: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  logo_url?: string;
  banner_image_url?: string;
  images?: string[];
  license_number?: string;
  tax_id?: string;
  business_type?: string;
  years_in_business?: number;
  rating: number;
  review_count: number;
  insurance_types?: InsuranceType[];
  status: AgencyStatus;
  verified: boolean;
  verified_at?: string;
  plan_type: string;
  plan_expires_at?: string;
  meta_title?: string;
  meta_description?: string;
  business_data: Record<string, any>;
  settings: Record<string, any>;
}

// =============================================================================
// CUSTOMER TYPES
// =============================================================================

export interface Customer extends BaseEntity {
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  occupation?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  preferred_language: string;
  marketing_consent: boolean;
  communication_preferences: Record<string, any>;
  status: CustomerStatus;
  lifetime_value: number;
  total_policies: number;
  total_claims: number;
  profile_data: Record<string, any>;
  notes?: string;
}

// =============================================================================
// POLICY TYPES
// =============================================================================

export interface Policy extends BaseEntity {
  policy_number: string;
  customer_id: string;
  agency_id: string;
  vehicle_id?: string;
  insurance_type: InsuranceType;
  product_name: string;
  coverage_details: Record<string, any>;
  premium_amount: number;
  coverage_amount: number;
  deductible: number;
  start_date: string;
  end_date: string;
  status: PolicyStatus;
  auto_renew: boolean;
  payment_frequency: string;
  terms_conditions: Record<string, any>;
  policy_data: Record<string, any>;
  pdf_url?: string;
}

// =============================================================================
// VEHICLE TYPES
// =============================================================================

export interface Vehicle extends BaseEntity {
  customer_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  license_plate?: string;
  color?: string;
  fuel_type?: string;
  transmission?: string;
  engine_size?: string;
  mileage?: number;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  usage_type?: string;
  storage_location?: string;
  modifications?: string[];
  vehicle_data: Record<string, any>;
}

// =============================================================================
// CLAIMS TYPES
// =============================================================================

export interface Claim extends BaseEntity {
  claim_number: string;
  policy_id: string;
  customer_id: string;
  claim_type: string;
  incident_date: string;
  reported_date: string;
  description: string;
  estimated_amount?: number;
  approved_amount?: number;
  paid_amount?: number;
  status: ClaimStatus;
  adjuster_notes?: string;
  settlement_date?: string;
  claim_data: Record<string, any>;
}

// =============================================================================
// ORDER TYPES
// =============================================================================

export interface Order extends BaseEntity {
  order_number: string;
  customer_id: string;
  agency_id: string;
  product_id?: string;
  total_amount: number;
  currency: string;
  state: OrderStatus;
  payment_method?: string;
  special_instructions?: string;
  metadata: Record<string, any>;
  proof_url?: string;
}

export interface OrderItem extends BaseEntity {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_data: Record<string, any>;
}

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export interface Product extends BaseEntity {
  agency_id: string;
  slug: string;
  name: string;
  description?: string;
  short_description?: string;
  insurance_type: InsuranceType;
  category?: string;
  tags?: string[];
  base_premium: number;
  coverage_amount: number;
  deductible_options?: number[];
  coverage_details: Record<string, any>;
  features?: string[];
  benefits?: string[];
  exclusions?: string[];
  terms_conditions: Record<string, any>;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  product_data: Record<string, any>;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export interface Payment extends BaseEntity {
  payment_number: string;
  customer_id: string;
  order_id?: string;
  policy_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: PaymentStatus;
  gateway_transaction_id?: string;
  gateway_response: Record<string, any>;
  processed_at?: string;
  notes?: string;
  payment_data: Record<string, any>;
}

// =============================================================================
// REVIEW TYPES
// =============================================================================

export interface Review extends BaseEntity {
  agency_id: string;
  customer_id: string;
  policy_id?: string;
  rating: number;
  title?: string;
  content?: string;
  status: ReviewStatus;
  is_verified: boolean;
  helpful_votes: number;
  response?: string;
  responded_at?: string;
  review_data: Record<string, any>;
}

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export interface Document extends BaseEntity {
  customer_id?: string;
  agency_id?: string;
  policy_id?: string;
  claim_id?: string;
  document_type: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  is_public: boolean;
  expiry_date?: string;
  document_data: Record<string, any>;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export interface Notification extends BaseEntity {
  user_id?: string;
  customer_id?: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  expires_at?: string;
}

// =============================================================================
// AUDIT LOG TYPES
// =============================================================================

export interface AuditLog extends BaseEntity {
  user_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  metadata: Record<string, any>;
}

// =============================================================================
// DSR (Data Subject Request) TYPES
// =============================================================================

export interface DSRRequest {
  id: string;
  type: DSRType;
  email: string;
  full_name: string;
  description?: string;
  data_types: string[];
  status: DSRStatus;
  priority: DSRPriority;
  verification_document_url?: string;
  assigned_to?: string;
  resolution_notes?: string;
  completed_at?: string;
  rejected_reason?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DSRAuditLog {
  id: string;
  request_id: string;
  action: string;
  performed_by?: string;
  details?: Record<string, any>;
  performed_at: string;
}

// =============================================================================
// USER CONSENT TYPES
// =============================================================================

export interface UserConsent {
  id: string;
  user_id?: string;
  email: string;
  consent_type: string;
  granted: boolean;
  granted_at?: string;
  withdrawn_at?: string;
  ip_address?: string;
  user_agent?: string;
  version: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Database response types
export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: DatabaseError | null;
}

// Filter and sort types
export interface BaseFilters {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AgencyFilters extends BaseFilters {
  status?: AgencyStatus;
  insurance_types?: InsuranceType[];
  verified?: boolean;
  rating_min?: number;
}

export interface CustomerFilters extends BaseFilters {
  status?: CustomerStatus;
  email?: string;
  phone?: string;
}

export interface PolicyFilters extends BaseFilters {
  customer_id?: string;
  agency_id?: string;
  status?: PolicyStatus;
  insurance_type?: InsuranceType;
  start_date?: string;
  end_date?: string;
}

// =============================================================================
// FUNCTION RESPONSE TYPES
// =============================================================================

export interface DSRStatistics {
  total_requests: number;
  pending: number;
  in_progress: number;
  completed: number;
  rejected: number;
  by_type: Record<DSRType, number>;
  average_completion_days: number;
}

// =============================================================================
// TABLE TYPES (for joins and relationships)
// =============================================================================

export interface AgencyWithOwner extends Agency {
  owner?: User;
}

export interface PolicyWithCustomer extends Policy {
  customer?: Customer;
  agency?: Agency;
  vehicle?: Vehicle;
}

export interface OrderWithItems extends Order {
  order_items?: OrderItem[];
  customer?: Customer;
  agency?: Agency;
}

export interface ClaimWithPolicy extends Claim {
  policy?: Policy;
  customer?: Customer;
}

export interface ReviewWithCustomer extends Review {
  customer?: Customer;
  agency?: Agency;
}
