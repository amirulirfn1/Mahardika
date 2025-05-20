@echo off
echo ============================================
echo Mahardika - Copy Template Script
echo ============================================
echo.
echo This script will copy the necessary files from your NiceAdmin template

echo to the public/assets/dashboard directory.
echo.

if "%~1"=="" (
    echo Usage: copy-template.bat "path-to-niceadmin-template"
    echo Example: copy-template.bat "C:\path\to\NiceAdmin"
    echo.
    echo Please provide the path to your NiceAdmin template directory.
    pause
    exit /b 1
)

set TEMPLATE_PATH=%~1

if not exist "%TEMPLATE_PATH%" (
    echo Error: The specified template directory does not exist.
    echo Please check the path and try again.
    pause
    exit /b 1
)

echo Copying files from: %TEMPLATE_PATH%
echo.

node "%~dp0copy-template.js" "%TEMPLATE_PATH%"
echo.
pause
