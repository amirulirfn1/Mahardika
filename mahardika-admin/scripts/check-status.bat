@echo off
echo ========================================
echo Mahardika Project Status Check
echo ========================================

echo.
echo Checking Node.js and package managers...
node --version
npm --version
pnpm --version

echo.
echo Checking CLI tools...
echo Supabase CLI:
npx supabase --version
echo Vercel CLI:
vercel --version

echo.
echo Checking project dependencies...
if exist "node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed - run 'pnpm install'
)

echo.
echo Checking configuration files...
if exist "apps\web\.env.local" (
    echo ✅ Environment file exists
) else (
    echo ❌ Create apps/web/.env.local with Supabase credentials
)

if exist "supabase\config.toml" (
    echo ✅ Supabase config exists
) else (
    echo ❌ Supabase not configured - run 'npx supabase init'
)

echo.
echo Checking build status...
if exist "apps\web\.next" (
    echo ✅ Project built successfully
) else (
    echo ℹ️ Not built yet - run 'pnpm run build'
)

echo.
echo Next steps:
echo 1. Configure environment variables in apps/web/.env.local
echo 2. Login to Supabase: npx supabase login
echo 3. Link project: npx supabase link --project-ref YOUR_PROJECT_REF
echo 4. Push database: npx supabase db push
echo 5. Login to Vercel: vercel login
echo 6. Deploy: vercel deploy --prod

echo.
echo ========================================
echo Status check completed
echo ========================================
pause 