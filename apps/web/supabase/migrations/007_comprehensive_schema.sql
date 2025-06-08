-- =============================================================================
-- Mahardika Platform - Comprehensive Database Schema
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS AND TYPES
-- =============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'agency_owner', 'agent', 'customer', 'support');

-- Agency status
CREATE TYPE agency_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- Customer status
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'suspended');

-- Order status
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'CLEARED', 'CANCELLED', 'REFUNDED');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');

-- Review status
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Insurance types
CREATE TYPE insurance_type AS ENUM ('auto', 'home', 'life', 'health', 'business', 'travel', 'marine', 'cyber');

-- Policy status
CREATE TYPE policy_status AS ENUM ('active', 'expired', 'cancelled', 'pending', 'suspended');

-- Claim status
CREATE TYPE claim_status AS ENUM ('submitted', 'under_review', 'approved', 'denied', 'paid', 'closed');

-- =============================================================================
-- USERS TABLE (Authentication and Basic Info)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role user_role DEFAULT 'customer',
  
  -- Profile Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  
  -- Authentication
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMPTZ,
  
  -- Account Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  
  -- Metadata
  profile_data JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- =============================================================================
-- AGENCIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Basic Information
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  
  -- Contact Information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website_url VARCHAR(255),
  
  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Media
  logo_url VARCHAR(500),
  banner_image_url VARCHAR(500),
  images TEXT[],
  
  -- Business Information
  license_number VARCHAR(100),
  tax_id VARCHAR(50),
  business_type VARCHAR(100),
  years_in_business INTEGER,
  
  -- Ratings and Reviews
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Insurance Types Offered
  insurance_types insurance_type[],
  
  -- Status and Verification
  status agency_status DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Subscription/Plan
  plan_type VARCHAR(50) DEFAULT 'basic',
  plan_expires_at TIMESTAMPTZ,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Metadata
  business_data JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for agencies
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON agencies(slug);
CREATE INDEX IF NOT EXISTS idx_agencies_status ON agencies(status);
CREATE INDEX IF NOT EXISTS idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX IF NOT EXISTS idx_agencies_rating ON agencies(rating);
CREATE INDEX IF NOT EXISTS idx_agencies_insurance_types ON agencies USING gin(insurance_types);

-- =============================================================================
-- CUSTOMERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personal Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(50),
  occupation VARCHAR(100),
  
  -- Address Information
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(100),
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  marketing_consent BOOLEAN DEFAULT false,
  communication_preferences JSONB DEFAULT '{}',
  
  -- Status
  status customer_status DEFAULT 'active',
  
  -- Customer Lifecycle
  lifetime_value DECIMAL(12,2) DEFAULT 0,
  total_policies INTEGER DEFAULT 0,
  total_claims INTEGER DEFAULT 0,
  
  -- Metadata
  profile_data JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- =============================================================================
-- INSURANCE POLICIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Relationships
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Policy Details
  insurance_type insurance_type NOT NULL,
  policy_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Coverage
  coverage_amount DECIMAL(15,2),
  deductible DECIMAL(10,2),
  premium_amount DECIMAL(10,2) NOT NULL,
  premium_frequency VARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, semi-annual, annual
  
  -- Dates
  effective_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  
  -- Status
  status policy_status DEFAULT 'pending',
  
  -- Beneficiaries (for life insurance)
  beneficiaries JSONB DEFAULT '[]',
  
  -- Policy Details (flexible for different insurance types)
  policy_details JSONB DEFAULT '{}',
  
  -- Financial
  total_paid DECIMAL(12,2) DEFAULT 0,
  outstanding_balance DECIMAL(12,2) DEFAULT 0,
  
  -- Documents
  documents TEXT[],
  
  -- Metadata
  notes TEXT,
  policy_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for policies
CREATE INDEX IF NOT EXISTS idx_policies_policy_number ON policies(policy_number);
CREATE INDEX IF NOT EXISTS idx_policies_customer_id ON policies(customer_id);
CREATE INDEX IF NOT EXISTS idx_policies_agency_id ON policies(agency_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_insurance_type ON policies(insurance_type);

-- =============================================================================
-- CLAIMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Relationships
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Claim Details
  claim_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  incident_date DATE NOT NULL,
  reported_date DATE DEFAULT CURRENT_DATE,
  
  -- Financial
  claimed_amount DECIMAL(15,2) NOT NULL,
  approved_amount DECIMAL(15,2),
  paid_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Status and Processing
  status claim_status DEFAULT 'submitted',
  adjuster_id UUID REFERENCES users(id),
  
  -- Investigation
  investigation_notes TEXT,
  police_report_number VARCHAR(100),
  
  -- Documents
  documents TEXT[],
  photos TEXT[],
  
  -- Metadata
  claim_data JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create indexes for claims
CREATE INDEX IF NOT EXISTS idx_claims_claim_number ON claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_claims_policy_id ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_customer_id ON claims(customer_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- =============================================================================
-- ORDERS TABLE (for purchasing policies)
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Relationships
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  
  -- Order Details
  state order_status DEFAULT 'PENDING',
  
  -- Financial
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment
  payment_method VARCHAR(50),
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  
  -- Review System
  review_token UUID UNIQUE,
  review_token_expires_at TIMESTAMPTZ,
  review_sent_at TIMESTAMPTZ,
  
  -- Metadata
  order_data JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_agency_id ON orders(agency_id);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state);

-- =============================================================================
-- ORDER ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Product Details
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_sku VARCHAR(100),
  insurance_type insurance_type,
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Coverage Details
  coverage_details JSONB DEFAULT '{}',
  
  -- Metadata
  product_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  
  -- Review Details
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Moderation
  status review_status DEFAULT 'pending',
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMPTZ,
  
  -- Agency Response
  response_by UUID REFERENCES users(id),
  response_text TEXT,
  response_at TIMESTAMPTZ,
  
  -- Source and Verification
  review_source VARCHAR(50) DEFAULT 'direct',
  review_token UUID,
  verified_purchase BOOLEAN DEFAULT false,
  
  -- Metadata
  review_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_agency_id ON reviews(agency_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- =============================================================================
-- PRODUCTS TABLE (Insurance Products/Templates)
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Product Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) NOT NULL,
  sku VARCHAR(100),
  insurance_type insurance_type NOT NULL,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Coverage Template
  coverage_template JSONB DEFAULT '{}',
  pricing_factors JSONB DEFAULT '{}',
  
  -- Product Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Categories and Tags
  category VARCHAR(100),
  subcategory VARCHAR(100),
  tags TEXT[],
  
  -- Media
  image_url VARCHAR(500),
  images TEXT[],
  brochure_url VARCHAR(500),
  
  -- Inventory (if applicable)
  track_inventory BOOLEAN DEFAULT false,
  inventory_qty INTEGER DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Requirements
  age_min INTEGER,
  age_max INTEGER,
  requirements JSONB DEFAULT '{}',
  
  -- Metadata
  product_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(agency_id, slug)
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_agency_id ON products(agency_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_insurance_type ON products(insurance_type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- =============================================================================
-- PAYMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Payment Details
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(50) NOT NULL, -- premium, claim, refund, etc.
  
  -- Payment Method
  payment_method VARCHAR(50) NOT NULL,
  card_last_four VARCHAR(4),
  
  -- External IDs
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  external_transaction_id VARCHAR(255),
  
  -- Status
  status payment_status DEFAULT 'pending',
  
  -- Dates
  due_date DATE,
  paid_at TIMESTAMPTZ,
  
  -- Metadata
  payment_data JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_payment_number ON payments(payment_number);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_policy_id ON payments(policy_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =============================================================================
-- DOCUMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships (polymorphic)
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  
  -- Document Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  -- Security
  is_sensitive BOOLEAN DEFAULT false,
  access_level VARCHAR(50) DEFAULT 'private',
  
  -- Processing
  is_processed BOOLEAN DEFAULT false,
  virus_scanned BOOLEAN DEFAULT false,
  virus_scan_result VARCHAR(50),
  
  -- Metadata
  document_data JSONB DEFAULT '{}',
  tags TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes for documents
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_agency_id ON documents(agency_id);
CREATE INDEX IF NOT EXISTS idx_documents_policy_id ON documents(policy_id);
CREATE INDEX IF NOT EXISTS idx_documents_claim_id ON documents(claim_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);

-- =============================================================================
-- NOTIFICATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipients
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Notification Details
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(100) NOT NULL,
  
  -- Channels
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Related Entity (polymorphic)
  related_entity_type VARCHAR(100),
  related_entity_id UUID,
  
  -- Metadata
  notification_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =============================================================================
-- AUDIT LOG TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id UUID,
  
  -- Metadata
  audit_data JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number(agency_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    base_number TEXT;
    order_number TEXT;
    counter INTEGER;
    agency_prefix TEXT;
BEGIN
    -- Get agency slug for prefix (first 3 chars, uppercase)
    SELECT UPPER(LEFT(slug, 3)) INTO agency_prefix
    FROM agencies 
    WHERE id = agency_id_param;
    
    IF agency_prefix IS NULL THEN
        agency_prefix := 'ORD';
    END IF;
    
    -- Generate base number with timestamp
    base_number := agency_prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
    
    -- Find next sequential number for today
    SELECT COALESCE(MAX(CAST(RIGHT(order_number, 4) AS INTEGER)), 0) + 1 
    INTO counter
    FROM orders 
    WHERE order_number LIKE base_number || '%'
    AND agency_id = agency_id_param;
    
    -- Format final order number
    order_number := base_number || LPAD(counter::TEXT, 4, '0');
    
    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate policy number
CREATE OR REPLACE FUNCTION generate_policy_number(agency_id_param UUID, insurance_type_param insurance_type)
RETURNS TEXT AS $$
DECLARE
    base_number TEXT;
    policy_number TEXT;
    counter INTEGER;
    agency_prefix TEXT;
    type_prefix TEXT;
BEGIN
    -- Get agency slug for prefix
    SELECT UPPER(LEFT(slug, 2)) INTO agency_prefix
    FROM agencies 
    WHERE id = agency_id_param;
    
    IF agency_prefix IS NULL THEN
        agency_prefix := 'AG';
    END IF;
    
    -- Get insurance type prefix
    type_prefix := CASE insurance_type_param
        WHEN 'auto' THEN 'AUTO'
        WHEN 'home' THEN 'HOME'
        WHEN 'life' THEN 'LIFE'
        WHEN 'health' THEN 'HLTH'
        WHEN 'business' THEN 'BIZ'
        WHEN 'travel' THEN 'TRVL'
        WHEN 'marine' THEN 'MAR'
        WHEN 'cyber' THEN 'CYB'
        ELSE 'GEN'
    END;
    
    -- Generate base number
    base_number := agency_prefix || '-' || type_prefix || '-' || TO_CHAR(NOW(), 'YYYY') || '-';
    
    -- Find next sequential number for this year and type
    SELECT COALESCE(MAX(CAST(RIGHT(policy_number, 6) AS INTEGER)), 0) + 1 
    INTO counter
    FROM policies 
    WHERE policy_number LIKE base_number || '%'
    AND agency_id = agency_id_param
    AND insurance_type = insurance_type_param;
    
    -- Format final policy number
    policy_number := base_number || LPAD(counter::TEXT, 6, '0');
    
    RETURN policy_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Add updated_at triggers for all tables
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_claims_updated_at
    BEFORE UPDATE ON claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order numbers
CREATE OR REPLACE FUNCTION auto_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number(NEW.agency_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_order_number();

-- Auto-generate policy numbers
CREATE OR REPLACE FUNCTION auto_generate_policy_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.policy_number IS NULL OR NEW.policy_number = '' THEN
        NEW.policy_number := generate_policy_number(NEW.agency_id, NEW.insurance_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_policy_number
    BEFORE INSERT ON policies
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_policy_number();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on specific needs)
-- Allow users to see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow public access to active agencies
CREATE POLICY "Public can view active agencies" ON agencies
    FOR SELECT USING (status = 'active');

-- Agency owners can manage their agencies
CREATE POLICY "Agency owners can manage their agencies" ON agencies
    FOR ALL USING (auth.uid() = owner_id);

-- =============================================================================
-- INITIAL DATA AND CONSTRAINTS
-- =============================================================================

-- Add some basic constraints that weren't covered above
ALTER TABLE policies ADD CONSTRAINT check_premium_amount_positive 
    CHECK (premium_amount > 0);

ALTER TABLE claims ADD CONSTRAINT check_claimed_amount_positive 
    CHECK (claimed_amount > 0);

ALTER TABLE orders ADD CONSTRAINT check_total_amount_positive 
    CHECK (total_amount > 0);

ALTER TABLE products ADD CONSTRAINT check_base_price_positive 
    CHECK (base_price > 0);

-- Add comment for documentation
COMMENT ON DATABASE postgres IS 'Mahardika Insurance Platform Database - Comprehensive schema for insurance agencies, policies, customers, and claims management';

-- =============================================================================
-- SCHEMA COMPLETE
-- ============================================================================= 