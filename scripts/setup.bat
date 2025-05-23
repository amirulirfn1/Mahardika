@echo off
echo ========================================
echo Mahardika Project Setup Script
echo ========================================

echo.
echo Step 1: Installing dependencies...
call pnpm install
if %ERRORLEVEL% neq 0 (
    echo Installation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up Supabase...
echo Please follow these steps:
echo 1. Login to Supabase: npx supabase login
echo 2. Create new project or get existing project reference
echo 3. Link project: npx supabase link --project-ref YOUR_PROJECT_REF
echo 4. Push database schema: npx supabase db push

echo.
echo Step 3: Setting up Vercel...
echo Please follow these steps:
echo 1. Login to Vercel: vercel login
echo 2. Deploy: vercel deploy --prod
echo 3. Follow prompts to configure project

echo.
echo Step 4: Configure Environment Variables
echo Create .env.local in apps/admin-web/ with:
echo NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

echo.
echo Step 5: GitHub Secrets (for CI/CD)
echo Add these secrets to your GitHub repository:
echo - SUPABASE_PROJECT_REF
echo - SUPABASE_ACCESS_TOKEN
echo - NEXT_PUBLIC_SUPABASE_URL
echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo - VERCEL_TOKEN
echo - VERCEL_ORG_ID
echo - VERCEL_PROJECT_ID

echo.
echo ========================================
echo Setup guide completed!
echo Run 'pnpm run dev' to start development
echo ========================================
pause 