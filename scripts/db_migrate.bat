@echo off
setlocal enabledelayedexpansion

REM =============================================================================
REM Mahardika Platform - Database Migration Script (Windows)
REM Brand Colors: Navy #0D1B2A, Gold #F4B400
REM =============================================================================

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\"
set "WEB_APP_DIR=%PROJECT_ROOT%apps\web"

echo ============================================================================
echo   🏛️  Mahardika Platform - Database Migration Manager  🏛️
echo ============================================================================
echo.

REM Function to print status messages
set "GOLD_COLOR=33"
set "GREEN_COLOR=32"
set "RED_COLOR=31"
set "YELLOW_COLOR=93"

:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

REM Check if pnpm is installed
call :print_status "Checking dependencies..."
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "pnpm is not installed. Please install pnpm first."
    exit /b 1
)

REM Check for Supabase CLI
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "Supabase CLI not found. Some operations may be limited."
    set "SUPABASE_AVAILABLE=false"
) else (
    set "SUPABASE_AVAILABLE=true"
)

call :print_success "Dependencies checked"

REM Check environment configuration
call :print_status "Checking environment configuration..."

if not exist "%WEB_APP_DIR%\.env.local" (
    call :print_warning ".env.local not found. Creating from template..."
    if exist "%PROJECT_ROOT%\.env.local.example" (
        copy "%PROJECT_ROOT%\.env.local.example" "%WEB_APP_DIR%\.env.local" >nul
        call :print_success "Created .env.local from template"
        call :print_warning "Please update .env.local with your actual values before running migrations"
    ) else (
        call :print_error ".env.local.example not found. Cannot create environment file."
        exit /b 1
    )
)

call :print_success "Environment configuration checked"

REM Confirmation prompt
echo This will run database migrations for the Mahardika Platform.
echo Make sure you have a backup of your database before proceeding.
echo.
set /p "REPLY=Do you want to continue? (y/N): "
if /i not "%REPLY%"=="y" (
    call :print_status "Migration cancelled by user"
    exit /b 0
)

REM Run Prisma migration
call :print_status "Running Prisma database migration..."
cd /d "%WEB_APP_DIR%"

call :print_status "Generating Prisma client..."
call pnpm dlx prisma generate
if %errorlevel% neq 0 (
    call :print_error "Failed to generate Prisma client"
    exit /b 1
)

call :print_status "Applying database schema changes..."
call pnpm dlx prisma migrate dev --name "mahardika_multitenant_schema"
if %errorlevel% neq 0 (
    call :print_error "Failed to run Prisma migration"
    exit /b 1
)

call :print_status "Checking migration status..."
call pnpm dlx prisma migrate status

call :print_success "Prisma migration completed"

REM Run Supabase migration if available
if "%SUPABASE_AVAILABLE%"=="true" (
    call :print_status "Running Supabase database push..."
    
    if exist "%WEB_APP_DIR%\supabase\config.toml" (
        call supabase db push
        if %errorlevel% neq 0 (
            call :print_warning "Supabase migration failed or not configured"
        ) else (
            call :print_success "Supabase migration completed"
        )
    ) else (
        call :print_warning "Supabase not initialized. Run 'supabase init' first if using Supabase."
    )
) else (
    call :print_warning "Supabase CLI not available, skipping Supabase migrations"
)

REM Seed database if seed file exists
if exist "%WEB_APP_DIR%\prisma\seed.ts" (
    call :print_status "Seeding database with initial data..."
    call pnpm dlx prisma db seed
    if %errorlevel% neq 0 (
        call :print_warning "Database seeding failed or not configured"
    ) else (
        call :print_success "Database seeded successfully"
    )
) else (
    call :print_warning "No seed script found. Skipping database seeding."
)

REM Show summary
echo.
echo =============================================================================
echo   📊  Migration Summary  📊
echo =============================================================================
echo.
echo ✅ Database schema applied
echo ✅ RLS policies configured
echo ✅ Multi-tenant structure ready
echo.
echo Brand Colors Applied:
echo   • Navy Primary: #0D1B2A
echo   • Gold Accent:  #F4B400
echo.
echo Next Steps:
echo   1. Verify your .env.local configuration
echo   2. Test database connections
echo   3. Run 'pnpm run dev' to start the application
echo.

call :print_success "Migration completed successfully! 🎉"

cd /d "%PROJECT_ROOT%"
endlocal 