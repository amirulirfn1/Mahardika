##
# Script to clean up unused files in the Mahardika project
##

# Remove backup files
Write-Host "Removing backup (.bak) files..."
Get-ChildItem -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src" -Filter "*.bak" -Recurse | ForEach-Object {
    Remove-Item -Path $_.FullName -Force
    Write-Host "Removed: $($_.FullName)"
}

# Remove unused test files
Write-Host "Removing unused test files..."
$unusedTestFiles = @(
    "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\TestApp.js",
    "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\setupTests.js",
    "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\App.test.js"
)

$unusedTestFiles | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item -Path $_ -Force
        Write-Host "Removed: $_"
    }
}

# Remove duplicate firebase config files (keep only firebase.js)
Write-Host "Cleaning up duplicate Firebase configuration files..."
if (Test-Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\firebase-config.js") {
    Remove-Item -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\firebase-config.js" -Force
    Write-Host "Removed: firebase-config.js"
}

# Remove template folders after successful integration
Write-Host "Removing template folders now that assets have been integrated..."

if (Test-Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\Medilab-pro") {
    Remove-Item -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\Medilab-pro" -Recurse -Force
    Write-Host "Removed: Medilab-pro folder"
}

if (Test-Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\NiceAdmin-pro") {
    Remove-Item -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\NiceAdmin-pro" -Recurse -Force
    Write-Host "Removed: NiceAdmin-pro folder"
}

Write-Host "Cleanup completed!"
