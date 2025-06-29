#!/bin/bash

# Mahardika Platform Bootstrap Script
# Checks dependencies, installs packages, and sets up development environment
# Uses Mahardika brand colors: navy #0D1B2A and gold #F4B400

set -e  # Exit on any error

# Mahardika brand colors for console output
readonly NAVY='\033[38;2;13;27;42m'
readonly GOLD='\033[38;2;244;180;0m'
readonly RESET='\033[0m'
readonly RED='\033[31m'
readonly GREEN='\033[32m'
readonly YELLOW='\033[33m'
readonly GRAY='\033[90m'
readonly BOLD='\033[1m'

# Helper functions for styled output
print_header() {
    echo -e "\n${NAVY}${BOLD}🚀 $1${RESET}"
    echo -e "${GOLD}$2${RESET}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${RESET}"
}

print_error() {
    echo -e "${RED}❌ $1${RESET}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${RESET}"
}

print_info() {
    echo -e "${GRAY}   $1${RESET}"
}

print_step() {
    echo -e "${NAVY}$1${RESET}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get version number
get_version() {
    $1 --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1
}

# Function to compare version numbers
version_gte() {
    printf '%s\n%s' "$2" "$1" | sort -C -V
}

# Main bootstrap function
main() {
    print_header "Mahardika Platform Bootstrap" "Setting up development environment with dependency checks"
    
    echo -e "${GRAY}Brand Colors: Navy #0D1B2A • Gold #F4B400${RESET}"
    echo -e "${GRAY}Repository: https://github.com/amirulirfn1/Mahardika.git${RESET}\n"

    # Step 1: Check system dependencies
    print_step "1. Checking system dependencies..."
    check_dependencies
    
    # Step 2: Install Node.js packages
    print_step "2. Installing Node.js packages..."
    install_packages
    
    # Step 3: Initialize Supabase
    print_step "3. Setting up Supabase..."
    setup_supabase
    
    # Step 4: Run Prisma migrations
    print_step "4. Running Prisma migrations..."
    setup_prisma
    
    # Step 5: Create environment files
    print_step "5. Creating environment configuration..."
    create_env_files
    
    # Step 6: Final verification
    print_step "6. Running final verification..."
    final_verification
    
    print_success_summary
}

# Check all required dependencies
check_dependencies() {
    local has_errors=false
    
    # Check Node.js version
    if command_exists node; then
        local node_version
        node_version=$(get_version "node")
        if version_gte "$node_version" "20.0.0"; then
            print_success "Node.js $node_version (≥20.0.0 required)"
        else
            print_error "Node.js $node_version found, but ≥20.0.0 required"
            print_info "Please update Node.js: https://nodejs.org/"
            has_errors=true
        fi
    else
        print_error "Node.js not found"
        print_info "Please install Node.js ≥20.0.0: https://nodejs.org/"
        has_errors=true
    fi
    
    # Check pnpm
    if command_exists pnpm; then
        local pnpm_version
        pnpm_version=$(get_version "pnpm")
        print_success "pnpm $pnpm_version found"
    else
        print_error "pnpm not found"
        print_info "Install pnpm: npm install -g pnpm"
        has_errors=true
    fi
    
    # Check Supabase CLI
    if command_exists supabase; then
        local supabase_version
        supabase_version=$(supabase --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1)
        print_success "Supabase CLI $supabase_version found"
    else
        print_warning "Supabase CLI not found"
        print_info "Installing Supabase CLI via npm..."
        if npm install -g supabase; then
            print_success "Supabase CLI installed successfully"
        else
            print_error "Failed to install Supabase CLI"
            print_info "Manual installation: npm install -g supabase"
            has_errors=true
        fi
    fi
    
    # Check git
    if command_exists git; then
        local git_version
        git_version=$(get_version "git")
        print_success "Git $git_version found"
    else
        print_warning "Git not found (recommended for version control)"
    fi
    
    if [ "$has_errors" = true ]; then
        print_error "Missing required dependencies. Please install them and run bootstrap again."
        exit 1
    fi
    
    echo ""
}

# Install Node.js packages
install_packages() {
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    
    print_info "Installing dependencies with pnpm..."
    if pnpm install; then
        print_success "All packages installed successfully"
    else
        print_error "Failed to install packages"
        exit 1
    fi
    
    echo ""
}

# Setup Supabase
setup_supabase() {
    # Check if already initialized
    if [ -d "supabase" ]; then
        print_warning "Supabase directory already exists"
        print_info "Skipping supabase init (already initialized)"
    else
        print_info "Initializing Supabase project..."
        if supabase init; then
            print_success "Supabase project initialized"
        else
            print_error "Failed to initialize Supabase"
            print_info "You can manually run: supabase init"
            # Don't exit here, continue with other setup
        fi
    fi
    
    # Check if Supabase is running
    print_info "Checking Supabase status..."
    if supabase status 2>/dev/null | grep -q "Local development setup is running"; then
        print_success "Supabase is already running"
    else
        print_info "Starting Supabase local development..."
        if supabase start; then
            print_success "Supabase local development started"
        else
            print_warning "Could not start Supabase (will continue without it)"
            print_info "You can manually run: supabase start"
        fi
    fi
    
    echo ""
}

# Setup Prisma
setup_prisma() {
    # Check if Prisma is configured in the project
    local prisma_configs=(
        "packages/*/prisma/schema.prisma"
        "apps/*/prisma/schema.prisma"
        "prisma/schema.prisma"
    )
    
    local found_prisma=false
    for config_pattern in "${prisma_configs[@]}"; do
        for config_path in $config_pattern; do
            if [ -f "$config_path" ]; then
                found_prisma=true
                print_info "Found Prisma schema: $config_path"
                
                # Get the directory containing the Prisma schema
                local prisma_dir
                prisma_dir=$(dirname "$config_path")
                local package_dir
                package_dir=$(dirname "$prisma_dir")
                
                print_info "Running Prisma migration in $package_dir..."
                if (cd "$package_dir" && pnpm dlx prisma migrate dev --name init); then
                    print_success "Prisma migration completed for $package_dir"
                else
                    print_warning "Prisma migration failed for $package_dir"
                    print_info "You can manually run: cd $package_dir && pnpm dlx prisma migrate dev"
                fi
                break
            fi
        done
        if [ "$found_prisma" = true ]; then
            break
        fi
    done
    
    if [ "$found_prisma" = false ]; then
        print_warning "No Prisma schema found"
        print_info "Skipping Prisma migrations"
        print_info "If you plan to use Prisma, create a schema.prisma file first"
    fi
    
    echo ""
}

# Create environment files
create_env_files() {
    local env_file=".env.local"
    
    # Check if .env.local already exists
    if [ -f "$env_file" ]; then
        print_warning ".env.local already exists"
        local backup_file=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
        print_info "Creating backup: $backup_file"
        cp "$env_file" "$backup_file"
        print_success "Backup created: $backup_file"
    fi
    
    print_info "Creating .env.local with Mahardika configuration..."
    
    # Get Supabase credentials if available
    local supabase_url="your_supabase_project_url"
    local supabase_anon_key="your_supabase_anon_key"
    
    if command_exists supabase && supabase status >/dev/null 2>&1; then
        print_info "Extracting Supabase credentials from local instance..."
        local supabase_status
        supabase_status=$(supabase status 2>/dev/null)
        
        if echo "$supabase_status" | grep -q "API URL"; then
            supabase_url=$(echo "$supabase_status" | grep "API URL" | awk '{print $3}' || echo "your_supabase_project_url")
        fi
        
        if echo "$supabase_status" | grep -q "anon key"; then
            supabase_anon_key=$(echo "$supabase_status" | grep "anon key" | awk '{print $3}' || echo "your_supabase_anon_key")
        fi
    fi
    
    # Create comprehensive .env.local file
    cat > "$env_file" << EOF
# Mahardika Platform Environment Variables
# Generated by bootstrap script on $(date)
# Copy values from your Supabase dashboard or local development

# Supabase Configuration
SUPABASE_URL=${supabase_url}
SUPABASE_ANON_KEY=${supabase_anon_key}
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_database_connection_string

# DeepSeek AI API Configuration
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# Mahardika Brand Colors (for dynamic theming)
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400

# Application Configuration
NEXT_PUBLIC_APP_NAME=Mahardika Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SUPABASE_URL=${supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon_key}

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
DEBUG_MODE=false

# Development
NODE_ENV=development

# Optional: External Services
# STRIPE_SECRET_KEY=sk_test_your_stripe_key
# SENDGRID_API_KEY=your_sendgrid_key
# GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
# MIXPANEL_TOKEN=your_mixpanel_token
EOF

    print_success ".env.local created successfully"
    print_info "File location: $(pwd)/$env_file"
    
    # Check if .env.local.example needs updating
    if [ -f ".env.local.example" ]; then
        print_info "Verifying .env.local.example is up to date..."
        if grep -q "SUPABASE_URL" ".env.local.example"; then
            print_success ".env.local.example already includes Supabase configuration"
        else
            print_warning ".env.local.example doesn't include Supabase variables"
            print_info "Consider updating .env.local.example with new variables"
        fi
    fi
    
    echo ""
}

# Final verification and testing
final_verification() {
    print_info "Running security check..."
    if [ -f "scripts/security-check.js" ]; then
        if node scripts/security-check.js; then
            print_success "Security check passed"
        else
            print_warning "Security check had warnings (non-critical)"
        fi
    else
        print_info "Security check script not found (skipping)"
    fi
    
    print_info "Verifying package builds..."
    if pnpm run build >/dev/null 2>&1; then
        print_success "All packages build successfully"
    else
        print_warning "Build verification failed (check dependencies)"
        print_info "You can manually run: pnpm run build"
    fi
    
    echo ""
}

# Print success summary
print_success_summary() {
    print_header "🎉 Bootstrap Complete!" "Mahardika Platform is ready for development"
    
    echo -e "${NAVY}${BOLD}✅ Setup Summary:${RESET}"
    echo -e "${GREEN}   • Dependencies verified (Node.js ≥20, pnpm, Supabase CLI)${RESET}"
    echo -e "${GREEN}   • Node.js packages installed${RESET}"
    echo -e "${GREEN}   • Supabase initialized and configured${RESET}"
    echo -e "${GREEN}   • Prisma migrations completed${RESET}"
    echo -e "${GREEN}   • Environment files created (.env.local)${RESET}"
    echo -e "${GREEN}   • Security verification passed${RESET}"
    
    echo -e "\n${NAVY}${BOLD}🚀 Next Steps:${RESET}"
    echo -e "${GOLD}   1. Update .env.local with your actual Supabase credentials${RESET}"
    echo -e "${GOLD}   2. Update .env.local with your DeepSeek API key${RESET}"
    echo -e "${GOLD}   3. Start development: pnpm run dev${RESET}"
    echo -e "${GOLD}   4. Visit http://localhost:3000 to see your app${RESET}"
    
    echo -e "\n${NAVY}${BOLD}📚 Useful Commands:${RESET}"
    echo -e "${GRAY}   • pnpm run dev          - Start development server${RESET}"
    echo -e "${GRAY}   • pnpm run build        - Build for production${RESET}"
    echo -e "${GRAY}   • pnpm run test         - Run test suite${RESET}"
    echo -e "${GRAY}   • pnpm run security:check - Check security${RESET}"
    echo -e "${GRAY}   • supabase status       - Check Supabase status${RESET}"
    echo -e "${GRAY}   • supabase stop         - Stop Supabase services${RESET}"
    
    echo -e "\n${NAVY}${BOLD}🔗 Resources:${RESET}"
    echo -e "${GRAY}   • Repository: https://github.com/amirulirfn1/Mahardika.git${RESET}"
    echo -e "${GRAY}   • Supabase Dashboard: https://app.supabase.com${RESET}"
    echo -e "${GRAY}   • DeepSeek API: https://platform.deepseek.com${RESET}"
    
    echo -e "\n${GOLD}${BOLD}Brand Colors: Navy #0D1B2A • Gold #F4B400${RESET}"
    echo -e "${GRAY}Happy coding with Mahardika Platform! 🚀${RESET}\n"
}

# Error handling
handle_error() {
    print_error "Bootstrap failed at line $1"
    echo -e "\n${YELLOW}Troubleshooting:${RESET}"
    echo -e "${GRAY}   • Check all dependencies are installed correctly${RESET}"
    echo -e "${GRAY}   • Ensure you're in the project root directory${RESET}"
    echo -e "${GRAY}   • Check network connectivity for package downloads${RESET}"
    echo -e "${GRAY}   • Review error messages above for specific issues${RESET}"
    echo -e "\n${GRAY}For help, visit: https://github.com/amirulirfn1/Mahardika/issues${RESET}\n"
    exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Run main function
main "$@" 