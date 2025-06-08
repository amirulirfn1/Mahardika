#!/bin/bash

# =============================================================================
# Mahardika Platform - RLS (Row Level Security) Linter
# Brand Colors: Navy #0D1B2A, Gold #F4B400
# =============================================================================

set -e

# Colors for output
NAVY='\033[38;2;13;27;42m'
GOLD='\033[38;2;244;180;0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${NAVY}==============================================================================${NC}"
echo -e "${GOLD}Mahardika Platform - Row Level Security (RLS) Linter${NC}"
echo -e "${NAVY}==============================================================================${NC}"

# Change to the web app directory
cd "$(dirname "$0")/../apps/web"

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Error: Supabase CLI is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Install it with: npm install -g supabase@latest${NC}"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo -e "${RED}❌ Error: Not in a Supabase project directory${NC}"
    echo -e "${YELLOW}Run 'supabase init' first${NC}"
    exit 1
fi

echo -e "${GOLD}📊 Inspecting RLS policies...${NC}"

# Create temporary file for policy inspection output
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Run supabase inspect policies and capture output
if ! supabase inspect policies > "$TEMP_FILE" 2>&1; then
    echo -e "${RED}❌ Error: Failed to inspect policies${NC}"
    echo -e "${YELLOW}Make sure Supabase is linked and running${NC}"
    cat "$TEMP_FILE"
    exit 1
fi

# Define tenant-aware tables that MUST have RLS enabled
TENANT_TABLES=(
    "agencies"
    "users"
    "customers"
    "policies"
    "reviews"
    "analytics"
    "audit_logs"
    "notifications"
)

# Define required policy types for tenant isolation
REQUIRED_POLICIES=(
    "select"
    "insert"
    "update"
    "delete"
)

# Arrays to track issues
MISSING_RLS=()
MISSING_POLICIES=()
WEAK_POLICIES=()

echo -e "${GOLD}🔍 Checking RLS status for tenant-aware tables...${NC}"

# Check each tenant table
for table in "${TENANT_TABLES[@]}"; do
    echo -n "  Checking table: $table... "
    
    # Check if RLS is enabled
    if grep -q "ALTER TABLE $table ENABLE ROW LEVEL SECURITY" "$TEMP_FILE" || \
       grep -q "RLS enabled: true" "$TEMP_FILE" | grep -q "$table"; then
        echo -e "${GREEN}✓ RLS enabled${NC}"
    else
        echo -e "${RED}✗ RLS missing${NC}"
        MISSING_RLS+=("$table")
        continue
    fi
    
    # Check for required policies
    for policy_type in "${REQUIRED_POLICIES[@]}"; do
        policy_pattern="${table}_${policy_type}_policy"
        if ! grep -q "$policy_pattern" "$TEMP_FILE"; then
            MISSING_POLICIES+=("$table.$policy_type")
        fi
    done
    
    # Check for tenant isolation in policies
    if grep -q "$table" "$TEMP_FILE"; then
        # Check if policies include agency_id tenant isolation
        if ! grep -A 10 -B 2 "$table" "$TEMP_FILE" | grep -q "agency_id\|get_user_agency_id"; then
            WEAK_POLICIES+=("$table")
        fi
    fi
done

echo ""
echo -e "${GOLD}🔒 Checking for tenant isolation patterns...${NC}"

# Check for required helper functions
REQUIRED_FUNCTIONS=(
    "get_user_agency_id"
    "is_agency_admin"
    "get_user_role"
    "validate_agency_access"
)

MISSING_FUNCTIONS=()

for func in "${REQUIRED_FUNCTIONS[@]}"; do
    echo -n "  Checking function: $func... "
    if grep -q "FUNCTION $func" "$TEMP_FILE"; then
        echo -e "${GREEN}✓ Found${NC}"
    else
        echo -e "${RED}✗ Missing${NC}"
        MISSING_FUNCTIONS+=("$func")
    fi
done

echo ""
echo -e "${GOLD}📋 Security Analysis Report${NC}"
echo -e "${NAVY}==============================================================================${NC}"

# Report findings
EXIT_CODE=0

if [ ${#MISSING_RLS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Tables missing RLS:${NC}"
    for table in "${MISSING_RLS[@]}"; do
        echo -e "   • ${RED}$table${NC}"
    done
    echo ""
    EXIT_CODE=1
fi

if [ ${#MISSING_POLICIES[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required policies:${NC}"
    for policy in "${MISSING_POLICIES[@]}"; do
        echo -e "   • ${RED}$policy${NC}"
    done
    echo ""
    EXIT_CODE=1
fi

if [ ${#WEAK_POLICIES[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Tables with potentially weak tenant isolation:${NC}"
    for table in "${WEAK_POLICIES[@]}"; do
        echo -e "   • ${YELLOW}$table${NC} (check for agency_id filtering)"
    done
    echo ""
    EXIT_CODE=1
fi

if [ ${#MISSING_FUNCTIONS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing security helper functions:${NC}"
    for func in "${MISSING_FUNCTIONS[@]}"; do
        echo -e "   • ${RED}$func${NC}"
    done
    echo ""
    EXIT_CODE=1
fi

# Check for common security anti-patterns
echo -e "${GOLD}🚨 Checking for security anti-patterns...${NC}"

ANTI_PATTERNS=()

# Check for policies that allow everything
if grep -q "USING (true)" "$TEMP_FILE"; then
    ANTI_PATTERNS+=("Found policies with 'USING (true)' - overly permissive")
fi

# Check for policies without tenant filtering
if grep -q "FOR ALL" "$TEMP_FILE" && ! grep -q "agency_id" "$TEMP_FILE"; then
    ANTI_PATTERNS+=("Found policies without tenant filtering")
fi

# Check for disabled RLS
if grep -q "DISABLE ROW LEVEL SECURITY" "$TEMP_FILE"; then
    ANTI_PATTERNS+=("Found tables with RLS explicitly disabled")
fi

if [ ${#ANTI_PATTERNS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Security anti-patterns detected:${NC}"
    for pattern in "${ANTI_PATTERNS[@]}"; do
        echo -e "   • ${RED}$pattern${NC}"
    done
    echo ""
    EXIT_CODE=1
fi

# Summary
echo -e "${NAVY}==============================================================================${NC}"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All RLS checks passed! Tenant isolation is properly configured.${NC}"
    echo -e "${GOLD}🛡️  Tables protected: ${#TENANT_TABLES[@]}${NC}"
    echo -e "${GOLD}🔑 Security functions: ${#REQUIRED_FUNCTIONS[@]}${NC}"
else
    echo -e "${RED}❌ RLS lint check FAILED!${NC}"
    echo -e "${YELLOW}Please fix the issues above to ensure proper tenant isolation.${NC}"
    echo ""
    echo -e "${GOLD}💡 Helpful commands:${NC}"
    echo -e "   • View full policy details: ${YELLOW}supabase inspect policies --verbose${NC}"
    echo -e "   • Apply migrations: ${YELLOW}supabase db reset${NC}"
    echo -e "   • Check specific table: ${YELLOW}supabase inspect policies --table=TABLE_NAME${NC}"
fi

echo -e "${NAVY}==============================================================================${NC}"

# Additional security recommendations
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GOLD}🔒 Security Recommendations:${NC}"
    echo -e "   • Regularly audit RLS policies with this script"
    echo -e "   • Test policies with different user roles"
    echo -e "   • Monitor failed policy violations in logs"
    echo -e "   • Keep security functions up to date"
    echo ""
fi

exit $EXIT_CODE 