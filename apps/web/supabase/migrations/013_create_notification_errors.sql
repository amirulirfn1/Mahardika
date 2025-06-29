-- 013_create_notification_errors.sql
-- Table to log WhatsApp (and other) send failures
CREATE TABLE IF NOT EXISTS notification_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID,
    channel TEXT NOT NULL,
    -- 'whatsapp', 'email', etc.
    payload JSONB,
    error JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notification_errors ENABLE ROW LEVEL SECURITY;
-- Allow agency users to see their own errors
CREATE POLICY "notification_errors_select" ON notification_errors FOR
SELECT USING (agency_id = get_user_agency_id());