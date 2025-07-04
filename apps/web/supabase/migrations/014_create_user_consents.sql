-- =============================================================================
-- Mahardika Platform - User Consents Table
-- GDPR/CCPA Compliance - Track user consent for data processing
-- =============================================================================
-- Create user_consents table
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    -- 'marketing', 'analytics', 'functional', 'necessary'
    granted BOOLEAN NOT NULL DEFAULT false,
    granted_at TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    -- Consent expiration date (optional)
    version TEXT NOT NULL DEFAULT '1.0',
    -- Privacy policy/consent version
    metadata JSONB DEFAULT '{}',
    -- Additional context (IP, user agent, etc)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for performance
CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_type ON user_consents(consent_type);
CREATE INDEX idx_user_consents_granted ON user_consents(granted)
WHERE granted = true;
CREATE INDEX idx_user_consents_version ON user_consents(version);
CREATE INDEX idx_user_consents_expires_at ON user_consents(expires_at)
WHERE expires_at IS NOT NULL;
-- Create unique constraint to prevent duplicate active consents
CREATE UNIQUE INDEX idx_user_consents_unique_active ON user_consents(user_id, consent_type, version)
WHERE withdrawn_at IS NULL;
-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_user_consents_updated_at BEFORE
UPDATE ON user_consents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
-- =============================================================================
-- CONSENT POLICIES - Users can only manage their own consents
-- =============================================================================
-- Users can only see their own consents
CREATE POLICY "user_consents_select_policy" ON user_consents FOR
SELECT USING (user_id = auth.uid());
-- Users can create their own consents
CREATE POLICY "user_consents_insert_policy" ON user_consents FOR
INSERT WITH CHECK (user_id = auth.uid());
-- Users can update their own consents (mainly for withdrawing consent)
CREATE POLICY "user_consents_update_policy" ON user_consents FOR
UPDATE USING (user_id = auth.uid());
-- Prevent deletion - consents should be withdrawn, not deleted for audit trail
CREATE POLICY "user_consents_delete_policy" ON user_consents FOR DELETE USING (false);
-- =============================================================================
-- ADMIN POLICIES - Allow admins to view consents for compliance reporting
-- =============================================================================
-- Create function to check if user is admin/staff
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$ BEGIN RETURN (
        SELECT EXISTS (
                SELECT 1
                FROM users
                WHERE id = auth.uid()
                    AND role IN ('admin', 'staff', 'owner')
            )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Admin policy for viewing consents (for compliance reporting)
CREATE POLICY "admin_user_consents_select_policy" ON user_consents FOR
SELECT USING (is_admin_user());
-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================
-- Function to grant consent (updated to support expiration)
CREATE OR REPLACE FUNCTION grant_user_consent(
        p_consent_type TEXT,
        p_version TEXT DEFAULT '1.0',
        p_metadata JSONB DEFAULT '{}',
        p_expires_at TIMESTAMPTZ DEFAULT NULL
    ) RETURNS UUID AS $$
DECLARE consent_id UUID;
BEGIN -- Insert new consent record
INSERT INTO user_consents (
        user_id,
        consent_type,
        granted,
        granted_at,
        expires_at,
        version,
        metadata
    )
VALUES (
        auth.uid(),
        p_consent_type,
        true,
        NOW(),
        p_expires_at,
        p_version,
        p_metadata
    )
RETURNING id INTO consent_id;
RETURN consent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to withdraw consent
CREATE OR REPLACE FUNCTION withdraw_user_consent(
        p_consent_type TEXT,
        p_version TEXT DEFAULT '1.0'
    ) RETURNS BOOLEAN AS $$ BEGIN -- Update existing consent to withdrawn
UPDATE user_consents
SET granted = false,
    withdrawn_at = NOW(),
    updated_at = NOW()
WHERE user_id = auth.uid()
    AND consent_type = p_consent_type
    AND version = p_version
    AND withdrawn_at IS NULL;
RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to check if user has granted specific consent (updated to check expiration)
CREATE OR REPLACE FUNCTION has_user_consent(
        p_user_id UUID,
        p_consent_type TEXT,
        p_version TEXT DEFAULT '1.0'
    ) RETURNS BOOLEAN AS $$ BEGIN RETURN (
        SELECT EXISTS (
                SELECT 1
                FROM user_consents
                WHERE user_id = p_user_id
                    AND consent_type = p_consent_type
                    AND version = p_version
                    AND granted = true
                    AND withdrawn_at IS NULL
                    AND (
                        expires_at IS NULL
                        OR expires_at > NOW()
                    )
            )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to get expired consents for cleanup
CREATE OR REPLACE FUNCTION get_expired_consents() RETURNS TABLE (
        id UUID,
        user_id UUID,
        consent_type TEXT,
        expires_at TIMESTAMPTZ
    ) AS $$ BEGIN RETURN QUERY
SELECT uc.id,
    uc.user_id,
    uc.consent_type,
    uc.expires_at
FROM user_consents uc
WHERE uc.granted = true
    AND uc.withdrawn_at IS NULL
    AND uc.expires_at IS NOT NULL
    AND uc.expires_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Function to automatically expire consents (for background job)
CREATE OR REPLACE FUNCTION expire_outdated_consents() RETURNS INTEGER AS $$
DECLARE affected_count INTEGER;
BEGIN
UPDATE user_consents
SET granted = false,
    withdrawn_at = NOW(),
    updated_at = NOW(),
    metadata = metadata || jsonb_build_object('expired_automatically', true)
WHERE granted = true
    AND withdrawn_at IS NULL
    AND expires_at IS NOT NULL
    AND expires_at <= NOW();
GET DIAGNOSTICS affected_count = ROW_COUNT;
RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- =============================================================================
-- SAMPLE DATA (for development/testing)
-- =============================================================================
-- Note: This will only work if there are existing users in auth.users
-- In production, consents should be collected through the UI
COMMENT ON TABLE user_consents IS 'Tracks user consent for GDPR/CCPA compliance';
COMMENT ON COLUMN user_consents.consent_type IS 'Type of consent: marketing, analytics, functional, necessary';
COMMENT ON COLUMN user_consents.granted IS 'Whether consent was granted (true) or withdrawn (false)';
COMMENT ON COLUMN user_consents.expires_at IS 'Optional expiration date for consent';
COMMENT ON COLUMN user_consents.version IS 'Version of privacy policy when consent was given';
COMMENT ON COLUMN user_consents.metadata IS 'Additional context like IP address, user agent, etc.';