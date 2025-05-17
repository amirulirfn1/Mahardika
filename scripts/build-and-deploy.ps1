# Build and Deploy Script for Mahardika Project
# This script handles building the React app and deploying to Firebase
# with proper error handling and logging

# Enable error handling
$ErrorActionPreference = "Stop"

# Set log file
$logFile = "build-deploy-log.txt"

# Function to log messages with timestamps
function Write-Log {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Write to console and log file
    Write-Host $logEntry
    Add-Content -Path $logFile -Value $logEntry
}

# Clean up existing build artifacts
try {
    Write-Log "Cleaning up previous build artifacts..."
    if (Test-Path -Path ".\react-pwa\build") {
        Remove-Item -Path ".\react-pwa\build" -Recurse -Force
    }
} catch {
    Write-Log "Error during cleanup: $_" -Level "ERROR"
    exit 1
}

# Install dependencies
try {
    Write-Log "Installing dependencies..."
    Set-Location -Path ".\react-pwa"
    npm ci
    
    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Log "Error installing dependencies: $_" -Level "ERROR"
    Set-Location -Path ".."
    exit 1
}

# Build the React app
try {
    Write-Log "Building React application..."
    # Set environment variable to prevent treating warnings as errors
    $env:CI = $false
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed with exit code $LASTEXITCODE"
    }
    
    Write-Log "Build completed successfully!"
} catch {
    Write-Log "Error building application: $_" -Level "ERROR"
    Set-Location -Path ".."
    exit 1
}

# Deploy to Firebase
try {
    Write-Log "Deploying to Firebase..."
    # Check if Firebase CLI is installed
    $firebaseVersion = firebase --version
    
    if ($LASTEXITCODE -ne 0) {
        throw "Firebase CLI not installed. Please install it with 'npm install -g firebase-tools'"
    }
    
    Write-Log "Using Firebase CLI version: $firebaseVersion"
    
    # Deploy to Firebase
    firebase deploy --only hosting
    
    if ($LASTEXITCODE -ne 0) {
        throw "Firebase deployment failed with exit code $LASTEXITCODE"
    }
    
    Write-Log "Deployment completed successfully!"
} catch {
    Write-Log "Error deploying to Firebase: $_" -Level "ERROR"
    Set-Location -Path ".."
    exit 1
}

# Return to root directory
Set-Location -Path ".."

Write-Log "Build and deployment process completed successfully!"
