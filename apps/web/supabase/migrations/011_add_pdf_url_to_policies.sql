-- 011_add_pdf_url_to_policies.sql
-- Migration: Add pdf_url column to policies table
ALTER TABLE policies
ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500);