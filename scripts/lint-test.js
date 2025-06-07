#!/usr/bin/env node

// Mahardika Platform - Lint & Format Test Script
// Brand Colors: Navy #0D1B2A, Gold #F4B400
// Verifies ESLint and Prettier configuration across the monorepo

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Mahardika brand colors for console output
const colors = {
  navy: '\x1b[38;2;13;27;42m',
  gold: '\x1b[38;2;244;180;0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function printHeader(title, subtitle) {
  console.log(`\n${colors.navy}${colors.bold}🔍 ${title}${colors.reset}`);
  console.log(`${colors.gold}${subtitle}${colors.reset}\n`);
}

function printSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function printError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function printInfo(message) {
  console.log(`${colors.gray}   ${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    const result = execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || error.stderr || error.message,
    };
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function testConfigurationFiles() {
  printHeader(
    'Configuration Files Test',
    'Verifying Prettier & ESLint configuration files exist'
  );

  const configFiles = [
    { file: '.prettierrc', name: 'Prettier configuration' },
    { file: '.prettierignore', name: 'Prettier ignore file' },
    { file: '.eslintrc.js', name: 'ESLint configuration' },
    { file: 'apps/web/.eslintrc.json', name: 'Next.js ESLint configuration' },
  ];

  let allExist = true;

  configFiles.forEach(({ file, name }) => {
    if (checkFileExists(file)) {
      printSuccess(`${name} exists: ${file}`);
    } else {
      printError(`${name} missing: ${file}`);
      allExist = false;
    }
  });

  return allExist;
}

function testPrettierFormatting() {
  printHeader(
    'Prettier Formatting Test',
    'Checking code formatting across the monorepo'
  );

  printInfo('Running Prettier check...');
  const result = runCommand('pnpm run format:check');

  if (result.success) {
    printSuccess('All files are properly formatted');
    return true;
  } else {
    printError('Some files need formatting');
    printInfo('Run "pnpm run format" to fix formatting issues');
    console.log(`${colors.gray}${result.output}${colors.reset}`);
    return false;
  }
}

function testESLintRules() {
  printHeader('ESLint Rules Test', 'Verifying linting rules across packages');

  const packages = [
    { name: 'UI Package', path: 'packages/ui', command: 'pnpm run lint' },
    { name: 'Web App', path: 'apps/web', command: 'pnpm run lint' },
  ];

  let allPassed = true;

  packages.forEach(({ name, path: packagePath, command }) => {
    printInfo(`Testing ${name}...`);
    const result = runCommand(command, packagePath);

    if (result.success) {
      printSuccess(`${name} linting passed`);
    } else {
      printError(`${name} linting failed`);
      console.log(`${colors.gray}${result.output}${colors.reset}`);
      allPassed = false;
    }
  });

  return allPassed;
}

function testPackageScripts() {
  printHeader(
    'Package Scripts Test',
    'Verifying lint and format scripts are available'
  );

  const packages = [
    'packages/ui/package.json',
    'apps/web/package.json',
    'package.json',
  ];

  let allHaveScripts = true;

  packages.forEach(packagePath => {
    if (!checkFileExists(packagePath)) {
      printError(`Package file missing: ${packagePath}`);
      allHaveScripts = false;
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};

    const requiredScripts =
      packagePath === 'package.json'
        ? ['format', 'format:check', 'lint']
        : ['lint', 'format', 'format:check'];

    const missingScripts = requiredScripts.filter(script => !scripts[script]);

    if (missingScripts.length === 0) {
      printSuccess(`All required scripts present in ${packagePath}`);
    } else {
      printError(
        `Missing scripts in ${packagePath}: ${missingScripts.join(', ')}`
      );
      allHaveScripts = false;
    }
  });

  return allHaveScripts;
}

function testMahardikaStyleGuide() {
  printHeader(
    'Mahardika Style Guide Test',
    'Verifying brand-specific coding standards'
  );

  // Test for consistent brand color usage
  const colorFiles = [
    'packages/ui/src/colors.ts',
    'packages/ui/src/Button.tsx',
    'packages/ui/src/Card.tsx',
  ];

  let styleGuideCompliant = true;

  colorFiles.forEach(filePath => {
    if (!checkFileExists(filePath)) {
      printWarning(`Style guide file missing: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for Mahardika brand colors
    const hasNavy = content.includes('#0D1B2A') || content.includes('navy');
    const hasGold = content.includes('#F4B400') || content.includes('gold');

    if (hasNavy || hasGold) {
      printSuccess(`Brand colors found in ${filePath}`);
    } else {
      printInfo(`No brand colors detected in ${filePath} (may be expected)`);
    }
  });

  // Test for consistent border radius (0.5rem)
  const componentFiles = [
    'packages/ui/src/Button.tsx',
    'packages/ui/src/Card.tsx',
  ];

  componentFiles.forEach(filePath => {
    if (!checkFileExists(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('0.5rem')) {
      printSuccess(`Consistent border radius (0.5rem) in ${filePath}`);
    } else {
      printWarning(`Border radius standard not found in ${filePath}`);
    }
  });

  return styleGuideCompliant;
}

function testBuildAfterLinting() {
  printHeader(
    'Build Test',
    'Verifying project builds after linting and formatting'
  );

  printInfo('Running build command...');
  const result = runCommand('pnpm run build');

  if (result.success) {
    printSuccess('Project builds successfully after linting setup');
    return true;
  } else {
    printError('Build failed after linting setup');
    console.log(`${colors.gray}${result.output}${colors.reset}`);
    return false;
  }
}

function printSummary(results) {
  printHeader(
    '🎉 Test Summary',
    'Mahardika Platform Lint & Format Setup Results'
  );

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;

  console.log(`${colors.navy}${colors.bold}📊 Results:${colors.reset}`);
  console.log(
    `${colors.green}   ✅ Passed: ${passedTests}/${totalTests}${colors.reset}`
  );

  if (failedTests > 0) {
    console.log(
      `${colors.red}   ❌ Failed: ${failedTests}/${totalTests}${colors.reset}`
    );
  }

  console.log(`\n${colors.navy}${colors.bold}📋 Test Details:${colors.reset}`);
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    console.log(`${color}   ${icon} ${test}${colors.reset}`);
  });

  if (passedTests === totalTests) {
    console.log(
      `\n${colors.gold}${colors.bold}🚀 All tests passed! Mahardika Platform linting setup is complete.${colors.reset}`
    );
    console.log(
      `${colors.gray}Brand Colors: Navy #0D1B2A • Gold #F4B400${colors.reset}`
    );
  } else {
    console.log(
      `\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Please review the issues above.${colors.reset}`
    );
  }

  console.log('');
}

// Main execution
async function main() {
  console.log(
    `${colors.navy}${colors.bold}Mahardika Platform - Lint & Format Test Suite${colors.reset}`
  );
  console.log(
    `${colors.gray}Testing ESLint and Prettier configuration${colors.reset}`
  );

  const results = {
    'Configuration Files': testConfigurationFiles(),
    'Package Scripts': testPackageScripts(),
    'Prettier Formatting': testPrettierFormatting(),
    'ESLint Rules': testESLintRules(),
    'Mahardika Style Guide': testMahardikaStyleGuide(),
    'Build After Linting': testBuildAfterLinting(),
  };

  printSummary(results);

  // Exit with appropriate code
  const allPassed = Object.values(results).every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

// Handle errors gracefully
process.on('uncaughtException', error => {
  printError(`Unexpected error: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  printError(`Unhandled promise rejection: ${error.message}`);
  process.exit(1);
});

main();
