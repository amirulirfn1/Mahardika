@echo off
echo Starting Mahardika Deployment Pipeline...

echo.
echo ========================================
echo Step 1: Building the application
echo ========================================
call pnpm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Running database migrations
echo ========================================
call npx supabase db push
if %ERRORLEVEL% neq 0 (
    echo Database migration failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 3: Deploying Edge Functions
echo ========================================
call npx supabase functions deploy
if %ERRORLEVEL% neq 0 (
    echo Edge function deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 4: Deploying to Vercel
echo ========================================
call vercel deploy --prod
if %ERRORLEVEL% neq 0 (
    echo Vercel deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment completed successfully!
echo ========================================
pause 