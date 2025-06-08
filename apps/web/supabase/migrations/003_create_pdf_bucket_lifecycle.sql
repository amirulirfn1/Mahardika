-- =============================================================================
-- Mahardika Platform - PDF Storage Bucket with Lifecycle Rules
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Enable the storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create the policy-pdfs bucket for storing insurance policy documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'policy-pdfs',
  'policy-pdfs',
  false, -- Private bucket
  52428800, -- 50MB file size limit
  ARRAY['application/pdf']::text[] -- Only PDF files allowed
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE POLICIES FOR PDF BUCKET
-- =============================================================================

-- Policy: Users can upload PDFs to their own agency folder
CREATE POLICY "agency_pdf_upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'policy-pdfs' AND
  (storage.foldername(name))[1] = (
    SELECT agency_id::text
    FROM users 
    WHERE id = auth.uid()
  )
);

-- Policy: Users can view PDFs from their own agency
CREATE POLICY "agency_pdf_view" ON storage.objects
FOR SELECT USING (
  bucket_id = 'policy-pdfs' AND
  (storage.foldername(name))[1] = (
    SELECT agency_id::text
    FROM users 
    WHERE id = auth.uid()
  )
);

-- Policy: Agency admins can delete PDFs from their agency
CREATE POLICY "agency_pdf_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'policy-pdfs' AND
  (storage.foldername(name))[1] = (
    SELECT agency_id::text
    FROM users 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- =============================================================================
-- LIFECYCLE MANAGEMENT FUNCTIONS
-- =============================================================================

-- Function to get files older than 18 months
CREATE OR REPLACE FUNCTION get_expired_policy_pdfs()
RETURNS TABLE (
  bucket_id text,
  name text,
  created_at timestamptz,
  age_months interval
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    o.name,
    o.created_at,
    AGE(NOW(), o.created_at) as age_months
  FROM storage.objects o
  WHERE o.bucket_id = 'policy-pdfs'
    AND o.created_at < NOW() - INTERVAL '18 months'
  ORDER BY o.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete expired policy PDFs
CREATE OR REPLACE FUNCTION delete_expired_policy_pdfs()
RETURNS TABLE (
  deleted_count integer,
  deleted_files text[],
  total_size_mb numeric
) AS $$
DECLARE
  expired_files RECORD;
  deleted_file_names text[] := ARRAY[]::text[];
  deleted_size_bytes bigint := 0;
  deleted_file_count integer := 0;
BEGIN
  -- Get expired files and delete them
  FOR expired_files IN 
    SELECT o.bucket_id, o.name, o.metadata->>'size' as size_bytes
    FROM storage.objects o
    WHERE o.bucket_id = 'policy-pdfs'
      AND o.created_at < NOW() - INTERVAL '18 months'
  LOOP
    -- Delete the file
    DELETE FROM storage.objects 
    WHERE bucket_id = expired_files.bucket_id 
      AND name = expired_files.name;
    
    -- Track deleted file
    deleted_file_names := array_append(deleted_file_names, expired_files.name);
    deleted_size_bytes := deleted_size_bytes + COALESCE(expired_files.size_bytes::bigint, 0);
    deleted_file_count := deleted_file_count + 1;
  END LOOP;

  -- Return summary
  RETURN QUERY SELECT 
    deleted_file_count,
    deleted_file_names,
    ROUND((deleted_size_bytes::numeric / 1024 / 1024), 2) as total_size_mb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to audit PDF lifecycle events
CREATE OR REPLACE FUNCTION audit_pdf_lifecycle(
  action_type text,
  file_name text,
  file_size_bytes bigint DEFAULT NULL,
  agency_id_param uuid DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    agency_id,
    action,
    resource,
    resource_id,
    user_id,
    metadata,
    created_at
  ) VALUES (
    COALESCE(agency_id_param, (
      SELECT agency_id 
      FROM users 
      WHERE id = auth.uid()
    )),
    action_type,
    'policy_pdf',
    file_name,
    auth.uid(),
    jsonb_build_object(
      'file_name', file_name,
      'file_size_bytes', file_size_bytes,
      'lifecycle_action', action_type,
      'timestamp', NOW()
    ),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- AUTOMATED CLEANUP TRIGGER
-- =============================================================================

-- Function to automatically audit file uploads
CREATE OR REPLACE FUNCTION trigger_audit_pdf_upload()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.bucket_id = 'policy-pdfs' THEN
    PERFORM audit_pdf_lifecycle(
      'pdf_uploaded',
      NEW.name,
      (NEW.metadata->>'size')::bigint,
      ((string_to_array(NEW.name, '/'))[1])::uuid
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically audit file deletions
CREATE OR REPLACE FUNCTION trigger_audit_pdf_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.bucket_id = 'policy-pdfs' THEN
    PERFORM audit_pdf_lifecycle(
      'pdf_deleted',
      OLD.name,
      (OLD.metadata->>'size')::bigint,
      ((string_to_array(OLD.name, '/'))[1])::uuid
    );
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic auditing
DROP TRIGGER IF EXISTS audit_pdf_upload_trigger ON storage.objects;
CREATE TRIGGER audit_pdf_upload_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_audit_pdf_upload();

DROP TRIGGER IF EXISTS audit_pdf_delete_trigger ON storage.objects;
CREATE TRIGGER audit_pdf_delete_trigger
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_audit_pdf_delete();

-- =============================================================================
-- CRON JOB SETUP FOR LIFECYCLE MANAGEMENT
-- =============================================================================

-- Create a function to be called by external cron job
CREATE OR REPLACE FUNCTION run_pdf_lifecycle_cleanup()
RETURNS jsonb AS $$
DECLARE
  cleanup_result RECORD;
  expired_files_count integer;
  result jsonb;
BEGIN
  -- Log cleanup start
  INSERT INTO audit_logs (
    action,
    resource,
    metadata,
    created_at
  ) VALUES (
    'pdf_lifecycle_cleanup_started',
    'system',
    jsonb_build_object(
      'cleanup_started_at', NOW(),
      'retention_months', 18
    ),
    NOW()
  );

  -- Get count of expired files before cleanup
  SELECT COUNT(*) INTO expired_files_count
  FROM storage.objects o
  WHERE o.bucket_id = 'policy-pdfs'
    AND o.created_at < NOW() - INTERVAL '18 months';

  -- Perform cleanup
  SELECT * INTO cleanup_result
  FROM delete_expired_policy_pdfs()
  LIMIT 1;

  -- Build result
  result := jsonb_build_object(
    'success', true,
    'timestamp', NOW(),
    'expired_files_found', expired_files_count,
    'files_deleted', cleanup_result.deleted_count,
    'total_size_mb', cleanup_result.total_size_mb,
    'deleted_files', cleanup_result.deleted_files
  );

  -- Log cleanup completion
  INSERT INTO audit_logs (
    action,
    resource,
    metadata,
    created_at
  ) VALUES (
    'pdf_lifecycle_cleanup_completed',
    'system',
    result,
    NOW()
  );

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Log cleanup error
  INSERT INTO audit_logs (
    action,
    resource,
    metadata,
    created_at
  ) VALUES (
    'pdf_lifecycle_cleanup_error',
    'system',
    jsonb_build_object(
      'error_message', SQLERRM,
      'error_state', SQLSTATE,
      'cleanup_failed_at', NOW()
    ),
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- HELPER FUNCTIONS FOR MONITORING
-- =============================================================================

-- Function to get storage statistics
CREATE OR REPLACE FUNCTION get_pdf_storage_stats()
RETURNS TABLE (
  total_files integer,
  total_size_mb numeric,
  files_expiring_soon integer,
  files_expired integer,
  oldest_file_date timestamptz,
  newest_file_date timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::integer as total_files,
    ROUND((SUM(COALESCE((metadata->>'size')::bigint, 0))::numeric / 1024 / 1024), 2) as total_size_mb,
    COUNT(CASE 
      WHEN created_at < NOW() - INTERVAL '15 months' 
       AND created_at >= NOW() - INTERVAL '18 months' 
      THEN 1 
    END)::integer as files_expiring_soon,
    COUNT(CASE 
      WHEN created_at < NOW() - INTERVAL '18 months' 
      THEN 1 
    END)::integer as files_expired,
    MIN(created_at) as oldest_file_date,
    MAX(created_at) as newest_file_date
  FROM storage.objects
  WHERE bucket_id = 'policy-pdfs';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION get_expired_policy_pdfs() IS 'Returns policy PDF files older than 18 months for lifecycle management';
COMMENT ON FUNCTION delete_expired_policy_pdfs() IS 'Deletes policy PDF files older than 18 months and returns cleanup summary';
COMMENT ON FUNCTION audit_pdf_lifecycle(text, text, bigint, uuid) IS 'Audits PDF lifecycle events for compliance tracking';
COMMENT ON FUNCTION run_pdf_lifecycle_cleanup() IS 'Main function for automated PDF lifecycle cleanup - call via cron';
COMMENT ON FUNCTION get_pdf_storage_stats() IS 'Returns comprehensive storage statistics for PDF bucket monitoring';

-- Grant necessary permissions for RLS policies
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated; 