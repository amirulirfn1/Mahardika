-- 009_create_vehicles_table.sql
-- Migration: Create vehicles table and agency-scoped RLS policies
-- =============================================================================
-- VEHICLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_no TEXT NOT NULL UNIQUE,
    brand TEXT,
    model TEXT,
    year INTEGER CHECK (
        year >= 1900
        AND year <= EXTRACT(
            YEAR
            FROM CURRENT_DATE
        ) + 1
    ),
    color TEXT,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_no ON vehicles(plate_no);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency_id ON vehicles(agency_id);
-- Trigger to update updated_at timestamp
CREATE TRIGGER trigger_vehicles_updated_at BEFORE
UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
-- Users can view vehicles within their agency
CREATE POLICY "vehicles_select_policy" ON vehicles FOR
SELECT USING (agency_id = get_user_agency_id());
-- Users can insert vehicles within their agency
CREATE POLICY "vehicles_insert_policy" ON vehicles FOR
INSERT WITH CHECK (agency_id = get_user_agency_id());
-- Users can update vehicles within their agency
CREATE POLICY "vehicles_update_policy" ON vehicles FOR
UPDATE USING (agency_id = get_user_agency_id());
-- Only agency admins can delete vehicles
CREATE POLICY "vehicles_delete_policy" ON vehicles FOR DELETE USING (
    agency_id = get_user_agency_id()
    AND is_agency_admin()
);