-- 010_add_vehicle_fk_to_policies.sql
-- Migration: Link vehicles to policies (nullable)
ALTER TABLE policies
ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id) ON DELETE
SET NULL;
-- Index
CREATE INDEX IF NOT EXISTS idx_policies_vehicle_id ON policies(vehicle_id);