-- 012_add_proof_url_to_orders.sql
-- Adds proof_url column to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS proof_url VARCHAR(500);