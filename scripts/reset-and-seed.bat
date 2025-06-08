@echo off
REM =============================================================================
REM Mahardika Platform - Database Reset and Seed Script (Windows)
REM Brand Colors: Navy #0D1B2A, Gold #F4B400
REM =============================================================================

setlocal enabledelayedexpansion

echo ==============================================================================
echo Mahardika Platform - Database Reset and Seed
echo ==============================================================================

REM Change to the web app directory
cd /d "%~dp0..\apps\web"

echo 📧 Resetting Supabase database...
supabase db reset --linked
if %errorlevel% neq 0 (
    echo Error: Failed to reset Supabase database
    exit /b 1
)

echo 🌱 Seeding development data...
node -r tsx/cjs --loader tsx/esm ..\..\scripts\seed_dev_data.ts
if %errorlevel% neq 0 (
    echo Error: Failed to seed development data
    exit /b 1
)

echo ==============================================================================
echo ✅ Database reset and seed completed successfully!
echo ============================================================================== 