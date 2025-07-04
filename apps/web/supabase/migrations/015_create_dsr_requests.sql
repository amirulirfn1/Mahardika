-- =============================================================================
-- Mahardika Platform - Data Subject Request (DSR) Table
-- GDPR/CCPA Compliance - Track and manage data subject requests
-- =============================================================================
-- Create DSR requests table
CREATE TABLE dsr_requests (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('export', 'delete', 'rectify')),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT,
    data_types JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'in_progress',
            'completed',
            'rejected',
            'cancelled'
        )
    ),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    verification_document_url TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    completed_at TIMESTAMPTZ,
    rejected_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for performance
CREATE INDEX idx_dsr_requests_status ON dsr_requests(status);
CREATE INDEX idx_dsr_requests_type ON dsr_requests(type);
CREATE INDEX idx_dsr_requests_email ON dsr_requests(email);
CREATE INDEX idx_dsr_requests_priority ON dsr_requests(priority);
CREATE INDEX idx_dsr_requests_created_at ON dsr_requests(created_at);
CREATE INDEX idx_dsr_requests_assigned_to ON dsr_requests(assigned_to)
WHERE assigned_to IS NOT NULL;
-- Create composite index for dashboard queries
CREATE INDEX idx_dsr_requests_status_priority ON dsr_requests(status, priority, created_at);
-- Add trigger for updated_at
CREATE TRIGGER trigger_dsr_requests_updated_at BEFORE
UPDATE ON dsr_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security
ALTER TABLE dsr_requests ENABLE ROW LEVEL SECURITY;
-- =============================================================================
-- DSR POLICIES - Restrict access based on user roles
-- =============================================================================
-- Create function to check if user is admin/staff
CREATE OR REPLACE FUNCTION is_dsr_admin() RETURNS BOOLEAN AS $$ BEGIN RETURN (
        SELECT EXISTS (
                SELECT 1
                FROM users
                WHERE id = auth.uid()
                    AND role IN ('admin', 'staff', 'owner', 'dpo') -- Data Protection Officer
            )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Admin/Staff can view all DSR requests
CREATE POLICY "dsr_requests_admin_select_policy" ON dsr_requests FOR
SELECT USING (is_dsr_admin());
-- Admin/Staff can update DSR requests
CREATE POLICY "dsr_requests_admin_update_policy" ON dsr_requests FOR
UPDATE USING (is_dsr_admin());
-- Only system can insert DSR requests (via API)
CREATE POLICY "dsr_requests_insert_policy" ON dsr_requests FOR
INSERT WITH CHECK (true);
-- Controlled via API authentication
-- Prevent deletion - maintain audit trail
CREATE POLICY "dsr_requests_delete_policy" ON dsr_requests FOR DELETE USING (false);
-- =============================================================================
-- DSR HELPER FUNCTIONS
-- =============================================================================
-- Function to update DSR request status
CREATE OR REPLACE FUNCTION update_dsr_status(
        p_request_id TEXT,
        p_status TEXT,
        p_notes TEXT DEFAULT NULL,
        p_assigned_to UUID DEFAULT NULL
    ) RETURNS BOOLEAN AS $$ BEGIN -- Validate status
    IF p_status NOT IN (
        'pending',
        'in_progress',
        'completed',
        'rejected',
        'cancelled'
    ) THEN RAISE EXCEPTION 'Invalid status: %',
    p_status;
END IF;
-- Update the request
UPDATE dsr_requests
SET status = p_status,
    resolution_notes = COALESCE(p_notes, resolution_notes),
    assigned_to = COALESCE(p_assigned_to, assigned_to),
    completed_at = CASE
        WHEN p_status IN ('completed', 'rejected', 'cancelled') THEN NOW()
        ELSE completed_at
    END,
    rejected_reason = CASE
        WHEN p_status = 'rejected' THEN p_notes
        ELSE rejected_reason
    END,
    updated_at = NOW()
WHERE id = p_request_id;
RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to get DSR statistics
CREATE OR REPLACE FUNCTION get_dsr_statistics(
        p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
        p_end_date TIMESTAMPTZ DEFAULT NOW()
    ) RETURNS JSONB AS $$
DECLARE result JSONB;
BEGIN
SELECT jsonb_build_object(
        'total_requests',
        COUNT(*),
        'pending',
        COUNT(*) FILTER (
            WHERE status = 'pending'
        ),
        'in_progress',
        COUNT(*) FILTER (
            WHERE status = 'in_progress'
        ),
        'completed',
        COUNT(*) FILTER (
            WHERE status = 'completed'
        ),
        'rejected',
        COUNT(*) FILTER (
            WHERE status = 'rejected'
        ),
        'by_type',
        jsonb_object_agg(type, type_count),
        'average_completion_days',
        ROUND(
            AVG(
                EXTRACT(
                    DAYS
                    FROM completed_at - created_at
                )
            ),
            2
        ) FILTER (
            WHERE status = 'completed'
        )
    ) INTO result
FROM (
        SELECT status,
            type,
            created_at,
            completed_at,
            COUNT(*) OVER (PARTITION BY type) as type_count
        FROM dsr_requests
        WHERE created_at BETWEEN p_start_date AND p_end_date
    ) sub;
RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to check if DSR request is overdue
CREATE OR REPLACE FUNCTION is_dsr_overdue(
        p_request_id TEXT,
        p_max_days INTEGER DEFAULT 30
    ) RETURNS BOOLEAN AS $$ BEGIN RETURN (
        SELECT created_at < NOW() - (p_max_days || ' days')::INTERVAL
            AND status IN ('pending', 'in_progress')
        FROM dsr_requests
        WHERE id = p_request_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- =============================================================================
-- STORAGE BUCKET FOR DSR DOCUMENTS
-- =============================================================================
-- Create storage bucket for DSR verification documents
INSERT INTO storage.buckets (
        id,
        name,
        public,
        file_size_limit,
        allowed_mime_types
    )
VALUES (
        'dsr-documents',
        'dsr-documents',
        false,
        -- Private bucket
        5242880,
        -- 5MB limit
        ARRAY ['image/jpeg', 'image/png', 'application/pdf']
    ) ON CONFLICT (id) DO NOTHING;
-- Create storage policies for DSR documents
CREATE POLICY "DSR documents - Admin upload" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'dsr-documents'
        AND is_dsr_admin()
    );
CREATE POLICY "DSR documents - Admin view" ON storage.objects FOR
SELECT USING (
        bucket_id = 'dsr-documents'
        AND is_dsr_admin()
    );
CREATE POLICY "DSR documents - Admin delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'dsr-documents'
    AND is_dsr_admin()
);
-- =============================================================================
-- AUDIT LOG FOR DSR ACTIONS
-- =============================================================================
-- Create audit log for DSR actions
CREATE TABLE dsr_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL REFERENCES dsr_requests(id),
    action TEXT NOT NULL,
    -- 'created', 'status_changed', 'assigned', 'document_uploaded', etc.
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
-- Index for audit log queries
CREATE INDEX idx_dsr_audit_log_request_id ON dsr_audit_log(request_id);
CREATE INDEX idx_dsr_audit_log_performed_at ON dsr_audit_log(performed_at);
-- Enable RLS for audit log
ALTER TABLE dsr_audit_log ENABLE ROW LEVEL SECURITY;
-- Admin can view audit logs
CREATE POLICY "dsr_audit_log_admin_select_policy" ON dsr_audit_log FOR
SELECT USING (is_dsr_admin());
-- Only system can insert audit logs
CREATE POLICY "dsr_audit_log_insert_policy" ON dsr_audit_log FOR
INSERT WITH CHECK (true);
-- Prevent updates/deletes to maintain integrity
CREATE POLICY "dsr_audit_log_no_update_policy" ON dsr_audit_log FOR
UPDATE USING (false);
CREATE POLICY "dsr_audit_log_no_delete_policy" ON dsr_audit_log FOR DELETE USING (false);
-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE dsr_requests IS 'Data Subject Request tracking for GDPR/CCPA compliance';
COMMENT ON COLUMN dsr_requests.type IS 'Type of request: export, delete, or rectify';
COMMENT ON COLUMN dsr_requests.priority IS 'Processing priority based on request type and urgency';
COMMENT ON COLUMN dsr_requests.metadata IS 'Additional context like IP, user agent, etc.';
COMMENT ON COLUMN dsr_requests.data_types IS 'Array of data types requested for processing';
COMMENT ON TABLE dsr_audit_log IS 'Audit trail for all DSR request actions';
COMMENT ON FUNCTION update_dsr_status IS 'Update DSR request status with proper validation';
COMMENT ON FUNCTION get_dsr_statistics IS 'Get DSR processing statistics for reporting';