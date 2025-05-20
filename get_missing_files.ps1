# PowerShell script to download missing JavaScript files

# Create necessary directories if they don't exist
$directories = @(
    "public\assets\dashboard\vendor\bootstrap\js",
    "public\assets\dashboard\vendor\chart.js",
    "public\assets\dashboard\vendor\echarts",
    "public\assets\dashboard\vendor\quill",
    "public\assets\dashboard\vendor\simple-datatables",
    "public\assets\dashboard\vendor\tinymce",
    "public\assets\dashboard\vendor\php-email-form"
)

foreach ($dir in $directories) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Download Bootstrap bundle
$bootstrapUrl = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
$bootstrapDest = "public\assets\dashboard\vendor\bootstrap\js\bootstrap.bundle.min.js"
Invoke-WebRequest -Uri $bootstrapUrl -OutFile $bootstrapDest
Write-Host "Downloaded Bootstrap bundle"

# Download Chart.js
$chartJsUrl = "https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"
$chartJsDest = "public\assets\dashboard\vendor\chart.js\chart.umd.js"
Invoke-WebRequest -Uri $chartJsUrl -OutFile $chartJsDest
Write-Host "Downloaded Chart.js"

# Download ECharts
$echartsUrl = "https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js"
$echartsDest = "public\assets\dashboard\vendor\echarts\echarts.min.js"
Invoke-WebRequest -Uri $echartsUrl -OutFile $echartsDest
Write-Host "Downloaded ECharts"

# Download Quill
$quillUrl = "https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"
$quillDest = "public\assets\dashboard\vendor\quill\quill.min.js"
Invoke-WebRequest -Uri $quillUrl -OutFile $quillDest
Write-Host "Downloaded Quill"

# Download Simple DataTables
$datatablesUrl = "https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js"
$datatablesDest = "public\assets\dashboard\vendor\simple-datatables\simple-datatables.js"
Invoke-WebRequest -Uri $datatablesUrl -OutFile $datatablesDest
Write-Host "Downloaded Simple DataTables"

# Download TinyMCE (basic version)
$tinymceUrl = "https://cdn.jsdelivr.net/npm/tinymce@6.7.2/tinymce.min.js"
$tinymceDest = "public\assets\dashboard\vendor\tinymce\tinymce.min.js"
Invoke-WebRequest -Uri $tinymceUrl -OutFile $tinymceDest
Write-Host "Downloaded TinyMCE"

# Create a simple validate.js file
$validateJsContent = @"
// Simple validation functions
const validate = {
    // Check if email is valid
    isEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Check if string is empty
    isEmpty: function(str) {
        return !str || str.trim() === '';
    },
    
    // Check if string has minimum length
    minLength: function(str, min) {
        return str.length >= min;
    },
    
    // Check if string has maximum length
    maxLength: function(str, max) {
        return str.length <= max;
    }
};

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = validate;
}
"@

Set-Content -Path "public\assets\dashboard\vendor\php-email-form\validate.js" -Value $validateJsContent
Write-Host "Created validate.js"

Write-Host "`nAll required files have been downloaded/created.`n"
