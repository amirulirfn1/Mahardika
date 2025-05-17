const fs = require('fs');
const path = require('path');

// List of vendor directories to keep (React-compatible or necessary)
const KEEP_VENDORS = {
  dashboard: [
    'bootstrap',
    'bootstrap-icons',
    'chart.js',
    'apexcharts',
    'echarts',
    'tinymce',
  ],
  portal: [
    'bootstrap',
    'bootstrap-icons',
    'aos',
    'glightbox',
    'swiper',
  ]
};

function cleanVendors() {
  const basePath = path.join(__dirname, '..', 'public', 'assets');
  
  try {
    // Clean dashboard vendors
    const dashboardVendorPath = path.join(basePath, 'dashboard', 'vendor');
    console.log('\nCleaning dashboard vendors...');
    cleanVendorDirSync(dashboardVendorPath, KEEP_VENDORS.dashboard);
    
    // Clean portal vendors
    const portalVendorPath = path.join(basePath, 'portal', 'vendor');
    console.log('\nCleaning portal vendors...');
    cleanVendorDirSync(portalVendorPath, KEEP_VENDORS.portal);
    
    console.log('\n✅ Vendor cleanup completed successfully!');
  } catch (error) {
    console.error('Error during vendor cleanup:', error);
    process.exit(1);
  }
}

function cleanVendorDirSync(vendorPath, keepList) {
  if (!fs.existsSync(vendorPath)) {
    console.log(`Directory not found: ${vendorPath}`);
    return;
  }
  
  const items = fs.readdirSync(vendorPath);
  
  for (const item of items) {
    const itemPath = path.join(vendorPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory() && !keepList.includes(item)) {
      console.log(`🗑️  Removing: ${itemPath}`);
      fs.rmSync(itemPath, { recursive: true, force: true });
    }
  }
}

// Run the cleanup
cleanVendors();
