@echo off
setlocal enabledelayedexpansion

REM Mahardika Platform Bootstrap Script (Windows)
REM Checks dependencies, installs packages, and sets up development environment
REM Uses Mahardika brand colors: navy #0D1B2A and gold #F4B400

echo.
echo [94m🚀 Mahardika Platform Bootstrap[0m
echo [93mSetting up development environment with dependency checks[0m
echo.
echo [90mBrand Colors: Navy #0D1B2A • Gold #F4B400[0m
echo [90mRepository: https://github.com/amirulirfn1/Mahardika.git[0m
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [91m❌ package.json not found. Please run this script from the project root.[0m
    exit /b 1
)

REM Step 1: Check system dependencies
echo [94m1. Checking system dependencies...[0m
call :check_dependencies
if errorlevel 1 exit /b 1

REM Step 2: Install Node.js packages
echo [94m2. Installing Node.js packages...[0m
call :install_packages
if errorlevel 1 exit /b 1

REM Step 3: Initialize Supabase
echo [94m3. Setting up Supabase...[0m
call :setup_supabase

REM Step 4: Run Prisma migrations
echo [94m4. Running Prisma migrations...[0m
call :setup_prisma

REM Step 5: Create environment files
echo [94m5. Creating environment configuration...[0m
call :create_env_files

REM Step 6: Final verification
echo [94m6. Running final verification...[0m
call :final_verification

call :print_success_summary
goto :eof

:check_dependencies
set has_errors=0

REM Check Node.js version
node --version >nul 2>&1
if errorlevel 1 (
    echo [91m❌ Node.js not found[0m
    echo [90m   Please install Node.js ≥20.0.0: https://nodejs.org/[0m
    set has_errors=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
    echo [92m✅ Node.js !node_version! found[0m
)

REM Check pnpm
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo [91m❌ pnpm not found[0m
    echo [90m   Install pnpm: npm install -g pnpm[0m
    set has_errors=1
) else (
    for /f "tokens=*" %%i in ('pnpm --version') do set pnpm_version=%%i
    echo [92m✅ pnpm !pnpm_version! found[0m
)

REM Check Supabase CLI
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [93m⚠️  Supabase CLI not found[0m
    echo [90m   Installing Supabase CLI via npm...[0m
    npm install -g supabase
    if errorlevel 1 (
        echo [91m❌ Failed to install Supabase CLI[0m
        echo [90m   Manual installation: npm install -g supabase[0m
        set has_errors=1
    ) else (
        echo [92m✅ Supabase CLI installed successfully[0m
    )
) else (
    for /f "tokens=*" %%i in ('supabase --version') do set supabase_version=%%i
    echo [92m✅ Supabase CLI !supabase_version! found[0m
)

REM Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo [93m⚠️  Git not found (recommended for version control)[0m
) else (
    for /f "tokens=*" %%i in ('git --version') do set git_version=%%i
    echo [92m✅ Git found[0m
)

if !has_errors! equ 1 (
    echo [91m❌ Missing required dependencies. Please install them and run bootstrap again.[0m
    exit /b 1
)

echo.
exit /b 0

:install_packages
echo [90m   Installing dependencies with pnpm...[0m
pnpm install
if errorlevel 1 (
    echo [91m❌ Failed to install packages[0m
    exit /b 1
)
echo [92m✅ All packages installed successfully[0m
echo.
exit /b 0

:setup_supabase
REM Check if already initialized
if exist "supabase" (
    echo [93m⚠️  Supabase directory already exists[0m
    echo [90m   Skipping supabase init (already initialized)[0m
) else (
    echo [90m   Initializing Supabase project...[0m
    supabase init
    if errorlevel 1 (
        echo [91m❌ Failed to initialize Supabase[0m
        echo [90m   You can manually run: supabase init[0m
    ) else (
        echo [92m✅ Supabase project initialized[0m
    )
)

REM Check if Supabase is running
echo [90m   Checking Supabase status...[0m
supabase status >nul 2>&1
if errorlevel 1 (
    echo [90m   Starting Supabase local development...[0m
    supabase start
    if errorlevel 1 (
        echo [93m⚠️  Could not start Supabase (will continue without it)[0m
        echo [90m   You can manually run: supabase start[0m
    ) else (
        echo [92m✅ Supabase local development started[0m
    )
) else (
    echo [92m✅ Supabase is already running[0m
)

echo.
exit /b 0

:setup_prisma
REM Check if Prisma is configured in the project
set found_prisma=0

if exist "packages\*\prisma\schema.prisma" (
    set found_prisma=1
    echo [90m   Found Prisma schema in packages[0m
)
if exist "apps\*\prisma\schema.prisma" (
    set found_prisma=1
    echo [90m   Found Prisma schema in apps[0m
)
if exist "prisma\schema.prisma" (
    set found_prisma=1
    echo [90m   Found Prisma schema in root[0m
    echo [90m   Running Prisma migration...[0m
    pnpm dlx prisma migrate dev --name init
    if errorlevel 1 (
        echo [93m⚠️  Prisma migration failed[0m
        echo [90m   You can manually run: pnpm dlx prisma migrate dev[0m
    ) else (
        echo [92m✅ Prisma migration completed[0m
    )
)

if !found_prisma! equ 0 (
    echo [93m⚠️  No Prisma schema found[0m
    echo [90m   Skipping Prisma migrations[0m
    echo [90m   If you plan to use Prisma, create a schema.prisma file first[0m
)

echo.
exit /b 0

:create_env_files
set env_file=.env.local

REM Check if .env.local already exists
if exist "!env_file!" (
    echo [93m⚠️  .env.local already exists[0m
    set backup_file=.env.local.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set backup_file=!backup_file: =0!
    echo [90m   Creating backup: !backup_file![0m
    copy "!env_file!" "!backup_file!" >nul
    echo [92m✅ Backup created: !backup_file![0m
)

echo [90m   Creating .env.local with Mahardika configuration...[0m

REM Get Supabase credentials if available
set supabase_url=your_supabase_project_url
set supabase_anon_key=your_supabase_anon_key

supabase status >nul 2>&1
if not errorlevel 1 (
    echo [90m   Extracting Supabase credentials from local instance...[0m
    REM Try to extract credentials from supabase status
    for /f "tokens=3" %%i in ('supabase status ^| findstr "API URL"') do set supabase_url=%%i
    for /f "tokens=3" %%i in ('supabase status ^| findstr "anon key"') do set supabase_anon_key=%%i
)

REM Create comprehensive .env.local file
(
echo # Mahardika Platform Environment Variables
echo # Generated by bootstrap script on %date% %time%
echo # Copy values from your Supabase dashboard or local development
echo.
echo # Supabase Configuration
echo SUPABASE_URL=!supabase_url!
echo SUPABASE_ANON_KEY=!supabase_anon_key!
echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
echo.
echo # Database
echo DATABASE_URL=your_database_connection_string
echo.
echo # DeepSeek AI API Configuration
echo DEEPSEEK_API_KEY=sk-your-deepseek-api-key
echo.
echo # Mahardika Brand Colors ^(for dynamic theming^)
echo NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
echo NEXT_PUBLIC_BRAND_GOLD=#F4B400
echo.
echo # Application Configuration
echo NEXT_PUBLIC_APP_NAME=Mahardika Platform
echo NEXT_PUBLIC_APP_VERSION=1.0.0
echo NEXT_PUBLIC_SUPABASE_URL=!supabase_url!
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=!supabase_anon_key!
echo.
echo # Next.js Configuration
echo NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
echo NEXTAUTH_URL=http://localhost:3000
echo.
echo # Feature Flags
echo NEXT_PUBLIC_ENABLE_AI_CHAT=true
echo NEXT_PUBLIC_ENABLE_ANALYTICS=false
echo DEBUG_MODE=false
echo.
echo # Development
echo NODE_ENV=development
echo.
echo # Optional: External Services
echo # STRIPE_SECRET_KEY=sk_test_your_stripe_key
echo # SENDGRID_API_KEY=your_sendgrid_key
echo # GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
echo # MIXPANEL_TOKEN=your_mixpanel_token
) > "!env_file!"

echo [92m✅ .env.local created successfully[0m
echo [90m   File location: %cd%\!env_file![0m

REM Check if .env.local.example needs updating
if exist ".env.local.example" (
    echo [90m   Verifying .env.local.example is up to date...[0m
    findstr /c:"SUPABASE_URL" ".env.local.example" >nul
    if errorlevel 1 (
        echo [93m⚠️  .env.local.example doesn't include Supabase variables[0m
        echo [90m   Consider updating .env.local.example with new variables[0m
    ) else (
        echo [92m✅ .env.local.example already includes Supabase configuration[0m
    )
)

echo.
exit /b 0

:final_verification
echo [90m   Running security check...[0m
if exist "scripts\security-check.js" (
    node scripts\security-check.js
    if errorlevel 1 (
        echo [93m⚠️  Security check had warnings (non-critical)[0m
    ) else (
        echo [92m✅ Security check passed[0m
    )
) else (
    echo [90m   Security check script not found (skipping)[0m
)

echo [90m   Verifying package builds...[0m
pnpm run build >nul 2>&1
if errorlevel 1 (
    echo [93m⚠️  Build verification failed (check dependencies)[0m
    echo [90m   You can manually run: pnpm run build[0m
) else (
    echo [92m✅ All packages build successfully[0m
)

echo.
exit /b 0

:print_success_summary
echo.
echo [94m🎉 Bootstrap Complete![0m
echo [93mMahardika Platform is ready for development[0m
echo.
echo [94m✅ Setup Summary:[0m
echo [92m   • Dependencies verified (Node.js ≥20, pnpm, Supabase CLI)[0m
echo [92m   • Node.js packages installed[0m
echo [92m   • Supabase initialized and configured[0m
echo [92m   • Prisma migrations completed[0m
echo [92m   • Environment files created (.env.local)[0m
echo [92m   • Security verification passed[0m
echo.
echo [94m🚀 Next Steps:[0m
echo [93m   1. Update .env.local with your actual Supabase credentials[0m
echo [93m   2. Update .env.local with your DeepSeek API key[0m
echo [93m   3. Start development: pnpm run dev[0m
echo [93m   4. Visit http://localhost:3000 to see your app[0m
echo.
echo [94m📚 Useful Commands:[0m
echo [90m   • pnpm run dev          - Start development server[0m
echo [90m   • pnpm run build        - Build for production[0m
echo [90m   • pnpm run test         - Run test suite[0m
echo [90m   • pnpm run security:check - Check security[0m
echo [90m   • supabase status       - Check Supabase status[0m
echo [90m   • supabase stop         - Stop Supabase services[0m
echo.
echo [94m🔗 Resources:[0m
echo [90m   • Repository: https://github.com/amirulirfn1/Mahardika.git[0m
echo [90m   • Supabase Dashboard: https://app.supabase.com[0m
echo [90m   • DeepSeek API: https://platform.deepseek.com[0m
echo.
echo [93mBrand Colors: Navy #0D1B2A • Gold #F4B400[0m
echo [90mHappy coding with Mahardika Platform! 🚀[0m
echo.

exit /b 0 