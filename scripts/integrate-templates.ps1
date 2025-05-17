##
# Script to integrate Medilab-pro and NiceAdmin-pro templates into the React-PWA
##

# Create directories if they don't exist
$portalAssetsDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\public\assets\portal"
$dashboardAssetsDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\public\assets\dashboard"

if (-not (Test-Path $portalAssetsDir)) {
    New-Item -Path $portalAssetsDir -ItemType Directory -Force
    Write-Host "Created portal assets directory"
}

if (-not (Test-Path $dashboardAssetsDir)) {
    New-Item -Path $dashboardAssetsDir -ItemType Directory -Force
    Write-Host "Created dashboard assets directory"
}

# Copy Medilab-pro assets to portal assets
Write-Host "Copying Medilab-pro assets to portal assets directory..."
$medilabAssetsDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\Medilab-pro\Medilab-pro\assets"
if (Test-Path $medilabAssetsDir) {
    Copy-Item -Path "$medilabAssetsDir\*" -Destination $portalAssetsDir -Recurse -Force
    Write-Host "Medilab-pro assets copied successfully"
} else {
    Write-Host "Medilab-pro assets directory not found"
}

# Copy NiceAdmin-pro assets to dashboard assets
Write-Host "Copying NiceAdmin-pro assets to dashboard assets directory..."
$niceAdminAssetsDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\NiceAdmin-pro\NiceAdmin-pro\assets"
if (Test-Path $niceAdminAssetsDir) {
    Copy-Item -Path "$niceAdminAssetsDir\*" -Destination $dashboardAssetsDir -Recurse -Force
    Write-Host "NiceAdmin-pro assets copied successfully"
} else {
    Write-Host "NiceAdmin-pro assets directory not found"
}

# Create CSS reference file for Medilab assets
$medilabCssFile = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\ui\portal\styles\medilab-assets.js"
$medilabCssContent = @"
/**
 * Reference file for Medilab template assets
 * Use these paths when referencing assets in your React components
 */

export const medilabAssets = {
  // Update these paths based on the actual structure in the assets folder
  css: {
    bootstrap: '/assets/portal/vendor/bootstrap/css/bootstrap.min.css',
    bootstrapIcons: '/assets/portal/vendor/bootstrap-icons/bootstrap-icons.css',
    boxicons: '/assets/portal/vendor/boxicons/css/boxicons.min.css',
    remixicon: '/assets/portal/vendor/remixicon/remixicon.css',
    swiper: '/assets/portal/vendor/swiper/swiper-bundle.min.css',
    main: '/assets/portal/css/style.css',
  },
  js: {
    bootstrap: '/assets/portal/vendor/bootstrap/js/bootstrap.bundle.min.js',
    swiper: '/assets/portal/vendor/swiper/swiper-bundle.min.js',
    glightbox: '/assets/portal/vendor/glightbox/js/glightbox.min.js',
    validate: '/assets/portal/vendor/php-email-form/validate.js',
    main: '/assets/portal/js/main.js',
  },
  img: {
    // Add image paths as needed
    heroImg: '/assets/portal/img/hero-img.png',
    about: '/assets/portal/img/about.jpg',
    doctors: {
      doctor1: '/assets/portal/img/doctors/doctors-1.jpg',
      doctor2: '/assets/portal/img/doctors/doctors-2.jpg',
      doctor3: '/assets/portal/img/doctors/doctors-3.jpg',
      doctor4: '/assets/portal/img/doctors/doctors-4.jpg',
    },
    departments: {
      department1: '/assets/portal/img/departments-1.jpg',
      department2: '/assets/portal/img/departments-2.jpg',
      department3: '/assets/portal/img/departments-3.jpg',
      department4: '/assets/portal/img/departments-4.jpg',
      department5: '/assets/portal/img/departments-5.jpg',
    },
  },
};
"@

# Create CSS reference file for NiceAdmin assets
$niceAdminCssFile = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\ui\dashboard\styles\niceadmin-assets.js"
$niceAdminCssContent = @"
/**
 * Reference file for NiceAdmin template assets
 * Use these paths when referencing assets in your React components
 */

export const niceAdminAssets = {
  // Update these paths based on the actual structure in the assets folder
  css: {
    bootstrap: '/assets/dashboard/vendor/bootstrap/css/bootstrap.min.css',
    bootstrapIcons: '/assets/dashboard/vendor/bootstrap-icons/bootstrap-icons.css',
    boxicons: '/assets/dashboard/vendor/boxicons/css/boxicons.min.css',
    remixicon: '/assets/dashboard/vendor/remixicon/remixicon.css',
    simpleDataTables: '/assets/dashboard/vendor/simple-datatables/style.css',
    main: '/assets/dashboard/css/style.css',
  },
  js: {
    bootstrap: '/assets/dashboard/vendor/bootstrap/js/bootstrap.bundle.min.js',
    apexcharts: '/assets/dashboard/vendor/apexcharts/apexcharts.min.js',
    simpleDataTables: '/assets/dashboard/vendor/simple-datatables/simple-datatables.js',
    tinymce: '/assets/dashboard/vendor/tinymce/tinymce.min.js',
    echarts: '/assets/dashboard/vendor/echarts/echarts.min.js',
    main: '/assets/dashboard/js/main.js',
  },
  img: {
    // Add image paths as needed
    logo: '/assets/dashboard/img/logo.png',
    profile: '/assets/dashboard/img/profile-img.jpg',
    slide1: '/assets/dashboard/img/slides-1.jpg',
    slide2: '/assets/dashboard/img/slides-2.jpg',
    slide3: '/assets/dashboard/img/slides-3.jpg',
    news1: '/assets/dashboard/img/news-1.jpg',
    news2: '/assets/dashboard/img/news-2.jpg',
    news3: '/assets/dashboard/img/news-3.jpg',
    news4: '/assets/dashboard/img/news-4.jpg',
    news5: '/assets/dashboard/img/news-5.jpg',
  },
};
"@

# Create directories for style files if they don't exist
$portalStylesDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\ui\portal\styles"
$dashboardStylesDir = "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\react-pwa\src\ui\dashboard\styles"

if (-not (Test-Path $portalStylesDir)) {
    New-Item -Path $portalStylesDir -ItemType Directory -Force
}

if (-not (Test-Path $dashboardStylesDir)) {
    New-Item -Path $dashboardStylesDir -ItemType Directory -Force
}

# Create the reference files
Set-Content -Path $medilabCssFile -Value $medilabCssContent
Write-Host "Created Medilab assets reference file"

Set-Content -Path $niceAdminCssFile -Value $niceAdminCssContent
Write-Host "Created NiceAdmin assets reference file"

# After successful integration, remove the template folders (commented out for safety)
# Remove-Item -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\Medilab-pro" -Recurse -Force
# Remove-Item -Path "c:\Users\amiru\OneDrive\Documents\GitHub\Mahardika\NiceAdmin-pro" -Recurse -Force
# Write-Host "Removed template folders"

Write-Host "Template integration completed!"
