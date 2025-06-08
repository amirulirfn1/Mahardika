-- =============================================================================
-- Mahardika Platform - Add Agency Branding Columns
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Add new columns to agencies table for branding and content
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS tagline VARCHAR(200),
ADD COLUMN IF NOT EXISTS about_md TEXT;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON agencies(slug);

-- Add constraint to ensure slug is URL-friendly
ALTER TABLE agencies 
ADD CONSTRAINT agencies_slug_format 
CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- Add constraint for hero image URL format
ALTER TABLE agencies 
ADD CONSTRAINT agencies_hero_image_url_format 
CHECK (hero_image_url IS NULL OR hero_image_url ~ '^https?://');

-- Add constraint for tagline length
ALTER TABLE agencies 
ADD CONSTRAINT agencies_tagline_length 
CHECK (tagline IS NULL OR LENGTH(tagline) <= 200);

-- Add constraint for about_md length (reasonable limit for markdown content)
ALTER TABLE agencies 
ADD CONSTRAINT agencies_about_md_length 
CHECK (about_md IS NULL OR LENGTH(about_md) <= 10000);

-- Update existing agencies with default slugs if they don't have one
DO $$
DECLARE
    agency_record RECORD;
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER;
BEGIN
    -- Loop through agencies without slugs
    FOR agency_record IN 
        SELECT id, name FROM agencies WHERE slug IS NULL
    LOOP
        -- Generate base slug from name
        base_slug := LOWER(TRIM(agency_record.name));
        -- Replace spaces and special characters with hyphens
        base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
        -- Remove leading/trailing hyphens
        base_slug := TRIM(BOTH '-' FROM base_slug);
        -- Ensure it's not empty
        IF base_slug = '' THEN
            base_slug := 'agency';
        END IF;
        
        -- Check if slug exists and make it unique
        final_slug := base_slug;
        counter := 1;
        
        WHILE EXISTS (SELECT 1 FROM agencies WHERE slug = final_slug) LOOP
            final_slug := base_slug || '-' || counter::TEXT;
            counter := counter + 1;
        END LOOP;
        
        -- Update the agency with the generated slug
        UPDATE agencies 
        SET slug = final_slug 
        WHERE id = agency_record.id;
        
        RAISE NOTICE 'Generated slug "%" for agency "%"', final_slug, agency_record.name;
    END LOOP;
END $$;

-- Make slug NOT NULL after populating existing records
ALTER TABLE agencies ALTER COLUMN slug SET NOT NULL;

-- =============================================================================
-- RLS POLICIES UPDATE
-- =============================================================================

-- The existing RLS policies will automatically apply to the new columns
-- since they're part of the agencies table.

-- Add function to validate agency slug format
CREATE OR REPLACE FUNCTION validate_agency_slug(input_slug TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if slug matches the required format
  RETURN input_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND 
         LENGTH(input_slug) >= 2 AND 
         LENGTH(input_slug) <= 100;
END;
$$ LANGUAGE plpgsql;

-- Add function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_agency_slug(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER;
BEGIN
    -- Generate base slug from name
    base_slug := LOWER(TRIM(base_name));
    -- Replace spaces and special characters with hyphens
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9]+', '-', 'g');
    -- Remove leading/trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    -- Ensure it's not empty
    IF base_slug = '' OR LENGTH(base_slug) < 2 THEN
        base_slug := 'agency';
    END IF;
    
    -- Truncate if too long
    IF LENGTH(base_slug) > 90 THEN
        base_slug := LEFT(base_slug, 90);
        base_slug := TRIM(BOTH '-' FROM base_slug);
    END IF;
    
    -- Check if slug exists and make it unique
    final_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM agencies WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter::TEXT;
        counter := counter + 1;
        -- Prevent infinite loop
        IF counter > 9999 THEN
            final_slug := base_slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug if not provided
CREATE OR REPLACE FUNCTION auto_generate_agency_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- If slug is not provided or empty, generate one from name
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_unique_agency_slug(NEW.name);
    ELSE
        -- Validate provided slug
        IF NOT validate_agency_slug(NEW.slug) THEN
            RAISE EXCEPTION 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS trigger_auto_generate_agency_slug ON agencies;
CREATE TRIGGER trigger_auto_generate_agency_slug
    BEFORE INSERT ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_agency_slug();

-- Create trigger for UPDATE operations (only if slug is being changed)
CREATE OR REPLACE FUNCTION update_agency_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if slug is being updated
    IF NEW.slug IS DISTINCT FROM OLD.slug THEN
        -- If slug is being set to NULL or empty, regenerate
        IF NEW.slug IS NULL OR NEW.slug = '' THEN
            NEW.slug := generate_unique_agency_slug(NEW.name);
        ELSE
            -- Validate new slug
            IF NOT validate_agency_slug(NEW.slug) THEN
                RAISE EXCEPTION 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.';
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_agency_slug ON agencies;
CREATE TRIGGER trigger_update_agency_slug
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_agency_slug();

-- =============================================================================
-- ADDITIONAL INDEXES
-- =============================================================================

-- Create partial index for active agencies' slugs (most common lookups)
CREATE INDEX IF NOT EXISTS idx_agencies_slug_active 
ON agencies(slug) 
WHERE is_active = true;

-- Create index for text search on tagline and about_md
CREATE INDEX IF NOT EXISTS idx_agencies_text_search 
ON agencies USING gin(to_tsvector('english', COALESCE(tagline, '') || ' ' || COALESCE(about_md, '')));

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON COLUMN agencies.slug IS 'URL-friendly unique identifier for agency (auto-generated from name if not provided)';
COMMENT ON COLUMN agencies.hero_image_url IS 'URL to hero image for agency profile page';
COMMENT ON COLUMN agencies.tagline IS 'Short marketing tagline for the agency (max 200 characters)';
COMMENT ON COLUMN agencies.about_md IS 'Markdown content for agency about section (max 10,000 characters)';

COMMENT ON FUNCTION validate_agency_slug(TEXT) IS 'Validates agency slug format - Mahardika Platform';
COMMENT ON FUNCTION generate_unique_agency_slug(TEXT) IS 'Generates unique agency slug from name - Mahardika Platform';
COMMENT ON FUNCTION auto_generate_agency_slug() IS 'Trigger function to auto-generate agency slugs - Mahardika Platform';
COMMENT ON FUNCTION update_agency_slug() IS 'Trigger function to validate agency slug updates - Mahardika Platform';

-- Update table comment with new columns info
COMMENT ON TABLE agencies IS 'Multi-tenant agencies table with branding columns - Primary: #0D1B2A, Accent: #F4B400'; 