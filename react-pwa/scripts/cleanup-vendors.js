const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));

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

async function cleanVendors() {
  const basePath = path.join(__dirname, '..', 'public', 'assets');
  
  try {
    // Clean dashboard vendors
    const dashboardVendorPath = path.join(basePath, 'dashboard', 'vendor');
    await cleanVendorDir(dashboardVendorPath, KEEP_VENDORS.dashboard);
    console.log('✅ Cleaned dashboard vendors');
    
    // Clean portal vendors
    const portalVendorPath = path.join(basePath, 'portal', 'vendor');
    await cleanVendorDir(portalVendorPath, KEEP_VENDORS.portal);
    console.log('✅ Cleaned portal vendors');
    
    console.log('\n✅ Vendor cleanup completed successfully!');
  } catch (error) {
    console.error('Error during vendor cleanup:', error);
    process.exit(1);
  }
}

async function cleanVendorDir(vendorPath, keepList) {
  try {
    const items = await fs.promises.readdir(vendorPath);
    
    for (const item of items) {
      const itemPath = path.join(vendorPath, item);
      const stats = await fs.promises.stat(itemPath);
      
      if (stats.isDirectory() && !keepList.includes(item)) {
        console.log(`🗑️  Removing: ${itemPath}`);
        await rimraf(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error cleaning ${vendorPath}:`, error);
    throw error;
  }
}

// Run the cleanup
cleanVendors();
