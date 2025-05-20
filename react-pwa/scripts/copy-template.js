const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

// Configuration
const TARGET_DIR = path.join(__dirname, '..', 'public', 'assets', 'dashboard');

// List of directories to copy from the NiceAdmin template
const DIRS_TO_COPY = [
  'css',
  'js',
  'vendor',
  'img',
  'scss'
];

// List of files to copy from the NiceAdmin template root
const FILES_TO_COPY = [
  'favicon.ico',
  'apple-touch-icon.png',
  'index.html'
];

// List of file extensions to copy (for vendor files)
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.css', '.map', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ttf', 
  '.woff', '.woff2', '.eot', '.otf', '.scss', '.html', '.ico', '.json'
]);

// Helper function to check if a path is a directory
async function isDirectory(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

// Helper function to ensure a directory exists
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Copy a file or directory recursively
async function copyRecursive(src, dest) {
  const stats = await stat(src);
  
  if (stats.isDirectory()) {
    // Create the destination directory if it doesn't exist
    await ensureDir(dest);
    
    // Read the source directory
    const entries = await readdir(src);
    
    // Copy each entry
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      
      // Skip node_modules and other unnecessary directories
      if (entry === 'node_modules' || entry.startsWith('.') || entry === 'package.json' || entry === 'package-lock.json') {
        console.log(`Skipping ${srcPath}`);
        continue;
      }
      
      await copyRecursive(srcPath, destPath);
    }
  } else {
    // Skip files with disallowed extensions
    const ext = path.extname(src).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      console.log(`Skipping unsupported file: ${src}`);
      return;
    }
    
    // Ensure the destination directory exists
    await ensureDir(path.dirname(dest));
    
    // Copy the file
    await copyFile(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  }
}

// Main function
async function copyTemplateFiles(templatePath) {
  try {
    // Check if the template path exists
    if (!(await isDirectory(templatePath))) {
      console.error(`Error: Template directory not found at ${templatePath}`);
      console.error('Please provide the correct path to your NiceAdmin template directory.');
      process.exit(1);
    }
    
    console.log(`Copying template files from: ${templatePath}`);
    console.log(`Destination: ${TARGET_DIR}`);
    
    // Ensure the target directory exists
    await ensureDir(TARGET_DIR);
    
    // Copy directories
    for (const dir of DIRS_TO_COPY) {
      const srcDir = path.join(templatePath, dir);
      const destDir = path.join(TARGET_DIR, dir);
      
      if (await isDirectory(srcDir)) {
        console.log(`\nCopying directory: ${dir}`);
        await copyRecursive(srcDir, destDir);
      } else {
        console.warn(`Warning: Directory not found: ${srcDir}`);
      }
    }
    
    // Copy individual files
    for (const file of FILES_TO_COPY) {
      const srcFile = path.join(templatePath, file);
      const destFile = path.join(TARGET_DIR, file);
      
      try {
        await copyFile(srcFile, destFile);
        console.log(`Copied file: ${file}`);
      } catch (err) {
        console.warn(`Warning: Could not copy file ${file}: ${err.message}`);
      }
    }
    
    console.log('\nTemplate files copied successfully!');
    console.log('You can now start the development server with: npm start');
    
  } catch (err) {
    console.error('Error copying template files:', err);
    process.exit(1);
  }
}

// Get the template path from command line arguments
const templatePath = process.argv[2];

if (!templatePath) {
  console.error('Usage: node copy-template.js <path-to-niceadmin-template>');
  console.error('Example: node copy-template.js "C:\\path\\to\\NiceAdmin"');
  process.exit(1);
}

// Run the script
copyTemplateFiles(templatePath);
