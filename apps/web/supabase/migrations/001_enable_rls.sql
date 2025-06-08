-- =============================================================================
-- Mahardika Platform - Row Level Security (RLS) Policies
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Enable Row Level Security on all tenant-aware tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Get current user's agency ID
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT agency_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is agency owner/admin
CREATE OR REPLACE FUNCTION is_agency_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('owner', 'admin')
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user role within agency
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- AGENCY POLICIES
-- =============================================================================

-- Users can only see their own agency
CREATE POLICY "agencies_select_policy" ON agencies
  FOR SELECT USING (
    id = get_user_agency_id()
  );

-- Only agency owners can update agency settings
CREATE POLICY "agencies_update_policy" ON agencies
  FOR UPDATE USING (
    id = get_user_agency_id() AND
    get_user_role() = 'owner'
  );

-- Only super admins can create new agencies (handled at application level)
CREATE POLICY "agencies_insert_policy" ON agencies
  FOR INSERT WITH CHECK (false);

-- Prevent agency deletion via RLS (handle at application level with proper checks)
CREATE POLICY "agencies_delete_policy" ON agencies
  FOR DELETE USING (false);

-- =============================================================================
-- USER POLICIES
-- =============================================================================

-- Users can see other users in their agency
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- Only admins can create new users in their agency
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id() AND
    is_agency_admin()
  );

-- Users can update their own profile, admins can update any user in their agency
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (
    (id = auth.uid()) OR 
    (agency_id = get_user_agency_id() AND is_agency_admin())
  );

-- Only admins can delete users in their agency (except themselves)
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE USING (
    agency_id = get_user_agency_id() AND
    is_agency_admin() AND
    id != auth.uid()
  );

-- =============================================================================
-- CUSTOMER POLICIES
-- =============================================================================

-- Users can only see customers from their agency
CREATE POLICY "customers_select_policy" ON customers
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- Users can create customers in their agency
CREATE POLICY "customers_insert_policy" ON customers
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Users can update customers in their agency
CREATE POLICY "customers_update_policy" ON customers
  FOR UPDATE USING (
    agency_id = get_user_agency_id()
  );

-- Only admins can delete customers
CREATE POLICY "customers_delete_policy" ON customers
  FOR DELETE USING (
    agency_id = get_user_agency_id() AND
    is_agency_admin()
  );

-- =============================================================================
-- POLICY POLICIES (Insurance Policies)
-- =============================================================================

-- Users can only see policies from their agency
CREATE POLICY "policies_select_policy" ON policies
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- Users can create policies in their agency
CREATE POLICY "policies_insert_policy" ON policies
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Users can update policies in their agency
CREATE POLICY "policies_update_policy" ON policies
  FOR UPDATE USING (
    agency_id = get_user_agency_id()
  );

-- Only admins can delete policies
CREATE POLICY "policies_delete_policy" ON policies
  FOR DELETE USING (
    agency_id = get_user_agency_id() AND
    is_agency_admin()
  );

-- =============================================================================
-- REVIEW POLICIES
-- =============================================================================

-- Users can see reviews for their agency
CREATE POLICY "reviews_select_policy" ON reviews
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- Reviews are typically created by customers (handled at application level)
-- But allow agency users to create reviews for testing/admin purposes
CREATE POLICY "reviews_insert_policy" ON reviews
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Agency users can update reviews (e.g., add responses)
CREATE POLICY "reviews_update_policy" ON reviews
  FOR UPDATE USING (
    agency_id = get_user_agency_id()
  );

-- Only admins can delete reviews
CREATE POLICY "reviews_delete_policy" ON reviews
  FOR DELETE USING (
    agency_id = get_user_agency_id() AND
    is_agency_admin()
  );

-- =============================================================================
-- ANALYTICS POLICIES
-- =============================================================================

-- Users can see analytics for their agency
CREATE POLICY "analytics_select_policy" ON analytics
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- System can insert analytics data
CREATE POLICY "analytics_insert_policy" ON analytics
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Prevent updates and deletes of analytics data
CREATE POLICY "analytics_update_policy" ON analytics
  FOR UPDATE USING (false);

CREATE POLICY "analytics_delete_policy" ON analytics
  FOR DELETE USING (false);

-- =============================================================================
-- AUDIT LOG POLICIES
-- =============================================================================

-- Users can see audit logs for their agency (read-only)
CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT USING (
    agency_id = get_user_agency_id()
  );

-- System can insert audit logs
CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Prevent updates and deletes of audit logs
CREATE POLICY "audit_logs_update_policy" ON audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "audit_logs_delete_policy" ON audit_logs
  FOR DELETE USING (false);

-- =============================================================================
-- NOTIFICATION POLICIES
-- =============================================================================

-- Users can see notifications for their agency
CREATE POLICY "notifications_select_policy" ON notifications
  FOR SELECT USING (
    agency_id = get_user_agency_id() AND
    (user_id IS NULL OR user_id = auth.uid())
  );

-- System and admins can create notifications
CREATE POLICY "notifications_insert_policy" ON notifications
  FOR INSERT WITH CHECK (
    agency_id = get_user_agency_id()
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_policy" ON notifications
  FOR UPDATE USING (
    agency_id = get_user_agency_id() AND
    (user_id IS NULL OR user_id = auth.uid())
  );

-- Admins can delete notifications
CREATE POLICY "notifications_delete_policy" ON notifications
  FOR DELETE USING (
    agency_id = get_user_agency_id() AND
    is_agency_admin()
  );

-- =============================================================================
-- SYSTEM CONFIG POLICIES
-- =============================================================================

-- Public configs are readable by all authenticated users
CREATE POLICY "system_config_select_policy" ON system_config
  FOR SELECT USING (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Only super admins can modify system config
CREATE POLICY "system_config_insert_policy" ON system_config
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "system_config_update_policy" ON system_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "system_config_delete_policy" ON system_config
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =============================================================================
-- ADDITIONAL SECURITY MEASURES
-- =============================================================================

-- Create a function to validate agency context in application code
CREATE OR REPLACE FUNCTION validate_agency_access(target_agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user belongs to the target agency
  RETURN (
    SELECT COUNT(*) > 0
    FROM users 
    WHERE id = auth.uid() 
    AND agency_id = target_agency_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log access attempts (for audit purposes)
CREATE OR REPLACE FUNCTION log_access_attempt(
  resource_type TEXT,
  resource_id UUID,
  action_type TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (
    agency_id,
    action,
    resource,
    resource_id,
    user_id,
    user_email,
    user_role,
    ip_address,
    created_at
  )
  SELECT 
    u.agency_id,
    action_type,
    resource_type,
    resource_id,
    u.id,
    u.email,
    u.role,
    current_setting('request.header.x-forwarded-for', true),
    NOW()
  FROM users u
  WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS FOR MAINTENANCE
-- =============================================================================

COMMENT ON FUNCTION get_user_agency_id() IS 'Helper function to get current user agency ID - Mahardika Platform';
COMMENT ON FUNCTION is_agency_admin() IS 'Check if current user is agency admin/owner - Mahardika Platform';
COMMENT ON FUNCTION validate_agency_access(UUID) IS 'Validate user access to specific agency - Mahardika Platform';
COMMENT ON FUNCTION log_access_attempt(TEXT, UUID, TEXT) IS 'Log access attempts for audit trail - Mahardika Platform';

-- Brand color references in database comments for consistency
COMMENT ON TABLE agencies IS 'Multi-tenant agencies table - Primary: #0D1B2A, Accent: #F4B400';
COMMENT ON TABLE customers IS 'Customer management with loyalty system - Mahardika Platform';
COMMENT ON TABLE policies IS 'Insurance policy management with RLS - Mahardika Platform';
COMMENT ON TABLE reviews IS 'Review system with composite index on (agency_id, rating) - Mahardika Platform'; 