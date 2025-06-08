#!/bin/bash

# =============================================================================
# Mahardika Platform - Database Reset and Seed Script
# Brand Colors: Navy #0D1B2A, Gold #F4B400
# =============================================================================

set -e

# Colors for output
NAVY='\033[38;2;13;27;42m'
GOLD='\033[38;2;244;180;0m'
NC='\033[0m' # No Color

echo -e "${NAVY}==============================================================================${NC}"
echo -e "${GOLD}Mahardika Platform - Database Reset and Seed${NC}"
echo -e "${NAVY}==============================================================================${NC}"

# Change to the web app directory
cd "$(dirname "$0")/../apps/web"

echo -e "${GOLD}📧 Resetting Supabase database...${NC}"
supabase db reset --linked

echo -e "${GOLD}🌱 Seeding development data...${NC}"
node -r tsx/cjs --loader tsx/esm ../../scripts/seed_dev_data.ts

echo -e "${NAVY}==============================================================================${NC}"
echo -e "${GOLD}✅ Database reset and seed completed successfully!${NC}"
echo -e "${NAVY}==============================================================================${NC}" 