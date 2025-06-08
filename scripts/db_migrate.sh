#!/bin/bash

# =============================================================================
# Mahardika Platform - Database Migration Script
# Brand Colors: Navy #0D1B2A, Gold #F4B400
# =============================================================================

set -e  # Exit on any error

# ANSI color codes for output formatting
NAVY='\033[38;2;13;27;42m'    # Navy #0D1B2A
GOLD='\033[38;2;244;180;0m'   # Gold #F4B400
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'                  # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WEB_APP_DIR="$PROJECT_ROOT/apps/web"

echo -e "${NAVY}=============================================================================${NC}"
echo -e "${GOLD}  🏛️  Mahardika Platform - Database Migration Manager  🏛️${NC}"
echo -e "${NAVY}=============================================================================${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GOLD}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check for pnpm
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install pnpm first."
        exit 1
    fi
    
    # Check for supabase CLI
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Some operations may be limited."
        SUPABASE_AVAILABLE=false
    else
        SUPABASE_AVAILABLE=true
    fi
    
    print_success "Dependencies checked"
}

# Function to check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    # Check if .env.local exists
    if [ ! -f "$WEB_APP_DIR/.env.local" ]; then
        print_warning ".env.local not found. Creating from template..."
        if [ -f "$PROJECT_ROOT/.env.local.example" ]; then
            cp "$PROJECT_ROOT/.env.local.example" "$WEB_APP_DIR/.env.local"
            print_success "Created .env.local from template"
            print_warning "Please update .env.local with your actual values before running migrations"
        else
            print_error ".env.local.example not found. Cannot create environment file."
            exit 1
        fi
    fi
    
    # Load environment variables
    if [ -f "$WEB_APP_DIR/.env.local" ]; then
        export $(grep -v '^#' "$WEB_APP_DIR/.env.local" | xargs)
    fi
    
    # Check for required DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL not set in environment variables"
        print_error "Please set DATABASE_URL in your .env.local file"
        exit 1
    fi
    
    print_success "Environment configuration checked"
}

# Function to run Prisma migrations
run_prisma_migration() {
    print_status "Running Prisma database migration..."
    
    # Change to web app directory
    cd "$WEB_APP_DIR"
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    pnpm dlx prisma generate
    
    # Run database migration
    print_status "Applying database schema changes..."
    pnpm dlx prisma migrate dev --name "mahardika_multitenant_schema"
    
    # Verify migration status
    print_status "Checking migration status..."
    pnpm dlx prisma migrate status
    
    print_success "Prisma migration completed"
}

# Function to run Supabase migrations
run_supabase_migration() {
    if [ "$SUPABASE_AVAILABLE" = false ]; then
        print_warning "Supabase CLI not available, skipping Supabase migrations"
        return
    fi
    
    print_status "Running Supabase database push..."
    
    # Check if supabase is initialized
    if [ ! -f "$WEB_APP_DIR/supabase/config.toml" ]; then
        print_warning "Supabase not initialized. Run 'supabase init' first if using Supabase."
        return
    fi
    
    # Push database changes to Supabase
    cd "$WEB_APP_DIR"
    supabase db push
    
    print_success "Supabase migration completed"
}

# Function to seed database with initial data
seed_database() {
    print_status "Seeding database with initial data..."
    
    cd "$WEB_APP_DIR"
    
    # Check if seed script exists
    if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
        pnpm dlx prisma db seed
        print_success "Database seeded successfully"
    else
        print_warning "No seed script found. Skipping database seeding."
    fi
}

# Function to validate database connection
validate_connection() {
    print_status "Validating database connection..."
    
    cd "$WEB_APP_DIR"
    
    # Test database connection using Prisma
    if pnpm dlx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection validated"
    else
        print_error "Database connection failed"
        print_error "Please check your DATABASE_URL and ensure the database is accessible"
        exit 1
    fi
}

# Function to backup database (if needed)
backup_database() {
    print_status "Creating database backup..."
    
    BACKUP_DIR="$PROJECT_ROOT/backups"
    mkdir -p "$BACKUP_DIR"
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/mahardika_backup_$TIMESTAMP.sql"
    
    # Extract database details from DATABASE_URL
    if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
        DB_USER="${BASH_REMATCH[1]}"
        DB_HOST="${BASH_REMATCH[3]}"
        DB_PORT="${BASH_REMATCH[4]}"
        DB_NAME="${BASH_REMATCH[5]}"
        
        # Create backup using pg_dump if available
        if command -v pg_dump &> /dev/null; then
            PGPASSWORD="${BASH_REMATCH[2]}" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"
            print_success "Database backup created: $BACKUP_FILE"
        else
            print_warning "pg_dump not available. Skipping backup."
        fi
    else
        print_warning "Could not parse DATABASE_URL for backup. Skipping backup."
    fi
}

# Function to show migration summary
show_summary() {
    echo ""
    echo -e "${NAVY}=============================================================================${NC}"
    echo -e "${GOLD}  📊  Migration Summary  📊${NC}"
    echo -e "${NAVY}=============================================================================${NC}"
    echo ""
    echo -e "${GREEN}✅ Database schema applied${NC}"
    echo -e "${GREEN}✅ RLS policies configured${NC}"
    echo -e "${GREEN}✅ Multi-tenant structure ready${NC}"
    echo ""
    echo -e "${GOLD}Brand Colors Applied:${NC}"
    echo -e "  • Navy Primary: ${NAVY}#0D1B2A${NC}"
    echo -e "  • Gold Accent:  ${GOLD}#F4B400${NC}"
    echo ""
    echo -e "${GOLD}Next Steps:${NC}"
    echo -e "  1. Verify your .env.local configuration"
    echo -e "  2. Test database connections"
    echo -e "  3. Run 'pnpm run dev' to start the application"
    echo ""
}

# Main execution flow
main() {
    # Parse command line arguments
    SKIP_BACKUP=false
    SKIP_SEED=false
    FORCE=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-seed)
                SKIP_SEED=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-backup    Skip database backup"
                echo "  --skip-seed      Skip database seeding"
                echo "  --force          Force migration without confirmation"
                echo "  -h, --help       Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Confirmation prompt (unless forced)
    if [ "$FORCE" = false ]; then
        echo -e "${YELLOW}This will run database migrations for the Mahardika Platform.${NC}"
        echo -e "${YELLOW}Make sure you have a backup of your database before proceeding.${NC}"
        echo ""
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Migration cancelled by user"
            exit 0
        fi
    fi
    
    # Execute migration steps
    check_dependencies
    check_environment
    validate_connection
    
    if [ "$SKIP_BACKUP" = false ]; then
        backup_database
    fi
    
    run_prisma_migration
    run_supabase_migration
    
    if [ "$SKIP_SEED" = false ]; then
        seed_database
    fi
    
    show_summary
    
    print_success "Migration completed successfully! 🎉"
}

# Error handling
trap 'print_error "Migration failed on line $LINENO"' ERR

# Run main function
main "$@" 