const fs = require('fs');
const path = require('path');

// Copy UI package files to web app for deployment
const uiPackagePath = path.join(__dirname, '../packages/ui');
const webAppPath = path.join(__dirname, '../apps/web');

// Create local-ui directory in web app
const localUiPath = path.join(webAppPath, 'local-ui');
if (!fs.existsSync(localUiPath)) {
  fs.mkdirSync(localUiPath, { recursive: true });
}

// Copy package.json
const uiPackageJson = JSON.parse(fs.readFileSync(path.join(uiPackagePath, 'package.json'), 'utf8'));
fs.writeFileSync(path.join(localUiPath, 'package.json'), JSON.stringify(uiPackageJson, null, 2));

// Copy dist directory if it exists
const distPath = path.join(uiPackagePath, 'dist');
if (fs.existsSync(distPath)) {
  const localDistPath = path.join(localUiPath, 'dist');
  if (!fs.existsSync(localDistPath)) {
    fs.mkdirSync(localDistPath, { recursive: true });
  }
  
  // Copy all files from dist
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    const sourceFile = path.join(distPath, file);
    const destFile = path.join(localDistPath, file);
    if (fs.statSync(sourceFile).isFile()) {
      fs.copyFileSync(sourceFile, destFile);
    }
  });
}

console.log('✅ UI package files copied to web app for deployment'); 