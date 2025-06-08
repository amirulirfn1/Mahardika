#!/usr/bin/env node
/**
 * Environment Template Test Suite - Mahardika Platform
 * Validates .env.local.example file completeness and correctness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mahardika brand colors for console output
const colors = {
  navy: '\x1b[38;2;13;27;42m',
  gold: '\x1b[38;2;244;180;0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

// Logging functions with Mahardika styling
function printHeader(title, subtitle = '') {
  console.log(`\n${colors.navy}${colors.bold}━━━ ${title} ━━━${colors.reset}`);
  if (subtitle) {
    console.log(`${colors.gray}${subtitle}${colors.reset}`);
  }
  console.log('');
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
  console.log(`${colors.gray}ℹ️  ${message}${colors.reset}`);
}

function printGold(message) {
  console.log(`${colors.gold}${colors.bold}${message}${colors.reset}`);
}

// Main test functions
function testEnvTemplateExists() {
  printHeader(
    'Environment Template Test',
    'Checking if .env.local.example exists and is properly formatted'
  );

  const templatePath = '.env.local.example';

  if (!fs.existsSync(templatePath)) {
    printError('.env.local.example file not found');
    return false;
  }

  printSuccess('.env.local.example file exists');

  // Check file size (should be comprehensive)
  const stats = fs.statSync(templatePath);
  if (stats.size < 1000) {
    printWarning(
      'Template file seems small - may be missing comprehensive configuration'
    );
  } else {
    printSuccess(`Template file size: ${stats.size} bytes`);
  }

  return true;
}

function testRequiredVariables() {
  printHeader(
    'Required Variables Test',
    'Validating essential environment variables are included'
  );

  const templatePath = '.env.local.example';
  const template = fs.readFileSync(templatePath, 'utf8');

  // Essential variables that should be present
  const requiredVars = [
    {
      name: 'DEEPSEEK_API_KEY',
      category: 'API Configuration',
      required: true,
    },
    {
      name: 'NEXT_PUBLIC_BRAND_NAVY',
      category: 'Mahardika Branding',
      required: true,
    },
    {
      name: 'NEXT_PUBLIC_BRAND_GOLD',
      category: 'Mahardika Branding',
      required: true,
    },
    {
      name: 'NEXT_PUBLIC_APP_NAME',
      category: 'Application Config',
      required: true,
    },
    {
      name: 'SUPABASE_URL',
      category: 'Database Configuration',
      required: true,
    },
    {
      name: 'NEXTAUTH_SECRET',
      category: 'Authentication',
      required: true,
    },
    {
      name: 'NEXT_PUBLIC_ENABLE_AI_CHAT',
      category: 'Feature Flags',
      required: true,
    },
  ];

  let allPresent = true;
  const missingVars = [];

  requiredVars.forEach(({ name, category, required }) => {
    const pattern = new RegExp(`^${name}=`, 'm');
    const commentPattern = new RegExp(`^#\\s*${name}=`, 'm');

    if (pattern.test(template)) {
      printSuccess(`${name} - Found in ${category}`);
    } else if (commentPattern.test(template)) {
      printInfo(`${name} - Found as comment in ${category}`);
    } else if (required) {
      printError(`${name} - Missing from ${category}`);
      missingVars.push(name);
      allPresent = false;
    } else {
      printWarning(`${name} - Optional variable not found in ${category}`);
    }
  });

  if (allPresent) {
    printSuccess('All required environment variables are present');
  } else {
    printError(`Missing ${missingVars.length} required variables`);
  }

  return allPresent;
}

function testMahardikaBranding() {
  printHeader(
    'Mahardika Branding Test',
    'Verifying brand colors and references are correct'
  );

  const templatePath = '.env.local.example';
  const template = fs.readFileSync(templatePath, 'utf8');

  let brandingCorrect = true;

  // Check for Mahardika brand colors
  const navyColor = '#0D1B2A';
  const goldColor = '#F4B400';

  if (template.includes(navyColor)) {
    printSuccess(`Navy color (${navyColor}) found in template`);
  } else {
    printError(`Navy color (${navyColor}) missing from template`);
    brandingCorrect = false;
  }

  if (template.includes(goldColor)) {
    printSuccess(`Gold color (${goldColor}) found in template`);
  } else {
    printError(`Gold color (${goldColor}) missing from template`);
    brandingCorrect = false;
  }

  // Check for Mahardika Platform branding
  const brandingElements = [
    'Mahardika Platform',
    'mahardika',
    'Brand Colors',
    'Navy',
    'Gold',
  ];

  brandingElements.forEach(element => {
    if (template.toLowerCase().includes(element.toLowerCase())) {
      printSuccess(`Branding element "${element}" found`);
    } else {
      printWarning(`Branding element "${element}" not found`);
    }
  });

  // Check for proper repository URL
  const repoUrl = 'https://github.com/amirulirfn1/Mahardika.git';
  if (template.includes(repoUrl)) {
    printSuccess('Repository URL included in template');
  } else {
    printWarning('Repository URL not found in template');
  }

  return brandingCorrect;
}

function testTemplateStructure() {
  printHeader(
    'Template Structure Test',
    'Checking template organization and documentation'
  );

  const templatePath = '.env.local.example';
  const template = fs.readFileSync(templatePath, 'utf8');

  let structureGood = true;

  // Check for proper sections
  const expectedSections = [
    'API Configuration',
    'Brand Configuration',
    'Next.js Configuration',
    'Database Configuration',
    'Feature Flags',
    'External Services',
    'Analytics',
    'Security Configuration',
    'Usage Instructions',
  ];

  expectedSections.forEach(section => {
    if (template.includes(section)) {
      printSuccess(`Section "${section}" found`);
    } else {
      printWarning(`Section "${section}" not found`);
    }
  });

  // Check for usage instructions
  if (template.includes('Copy this file to .env.local')) {
    printSuccess('Usage instructions included');
  } else {
    printError('Usage instructions missing');
    structureGood = false;
  }

  // Check for helpful comments
  const commentPatterns = [
    /# Get your API key from:/,
    /# Get these from your/,
    /# Optional:/,
    /# Configuration/,
  ];

  let helpfulComments = 0;
  commentPatterns.forEach(pattern => {
    if (pattern.test(template)) {
      helpfulComments++;
    }
  });

  if (helpfulComments >= 3) {
    printSuccess(`Found ${helpfulComments} helpful comment sections`);
  } else {
    printWarning('Template could use more helpful comments');
  }

  return structureGood;
}

function testEnvVariableValidity() {
  printHeader(
    'Environment Variable Validity Test',
    'Checking placeholder values and formats'
  );

  const templatePath = '.env.local.example';
  const template = fs.readFileSync(templatePath, 'utf8');

  let validityGood = true;

  // Check for dangerous patterns (real secrets)
  const dangerousPatterns = [
    /sk-[a-zA-Z0-9]{48}/g, // Real API keys
    /pk_live_[a-zA-Z0-9]+/g, // Live Stripe keys
    /rk_live_[a-zA-Z0-9]+/g, // Live restricted keys
    /https:\/\/[a-zA-Z0-9-]{20,}\.supabase\.co/g, // Real Supabase project URLs (not dashboard)
  ];

  dangerousPatterns.forEach((pattern, index) => {
    const matches = template.match(pattern);
    if (matches && matches.length > 0) {
      printError(
        `Potentially real secret found (pattern ${index + 1}): ${matches[0].substring(0, 20)}...`
      );
      validityGood = false;
    }
  });

  if (validityGood) {
    printSuccess('No real secrets found in template');
  }

  // Check for proper placeholder formats
  const goodPlaceholders = [
    'your-',
    'your_',
    'sk-your-',
    'pk_test_',
    'whsec_your',
    'localhost',
  ];

  let placeholderCount = 0;
  goodPlaceholders.forEach(placeholder => {
    const matches = template.match(new RegExp(placeholder, 'gi'));
    if (matches) {
      placeholderCount += matches.length;
    }
  });

  if (placeholderCount >= 5) {
    printSuccess(`Found ${placeholderCount} proper placeholder patterns`);
  } else {
    printWarning('Template could use more descriptive placeholders');
  }

  return validityGood;
}

function testCompatibilityWithBootstrap() {
  printHeader(
    'Bootstrap Compatibility Test',
    'Verifying template works with bootstrap scripts'
  );

  const templatePath = '.env.local.example';
  let compatible = true;

  // Check if bootstrap scripts exist
  const bootstrapFiles = ['scripts/bootstrap.sh', 'scripts/bootstrap.bat'];
  const existingBootstrap = bootstrapFiles.filter(file => fs.existsSync(file));

  if (existingBootstrap.length > 0) {
    printSuccess(`Bootstrap scripts found: ${existingBootstrap.join(', ')}`);

    // Check if bootstrap scripts reference the template
    existingBootstrap.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('.env.local.example')) {
        printSuccess(`${file} references .env.local.example`);
      } else {
        printWarning(`${file} doesn't reference .env.local.example`);
      }
    });
  } else {
    printWarning('No bootstrap scripts found');
  }

  // Check if security check script exists and is compatible
  if (fs.existsSync('scripts/security-check.js')) {
    printSuccess('Security check script found');
    const securityScript = fs.readFileSync('scripts/security-check.js', 'utf8');
    if (securityScript.includes('.env.local.example')) {
      printSuccess('Security script references template');
    } else {
      printWarning('Security script should reference template');
    }
  }

  return compatible;
}

function testPackageIntegration() {
  printHeader(
    'Package Integration Test',
    'Verifying template integrates with package.json scripts'
  );

  let integrated = true;

  // Check package.json for env-related scripts
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = packageJson.scripts || {};

    const envScripts = ['env:template', 'security:check'];
    envScripts.forEach(script => {
      if (scripts[script]) {
        printSuccess(`Found ${script} script in package.json`);
      } else {
        printWarning(`Missing ${script} script in package.json`);
      }
    });

    // Check for env-related dependencies
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (allDeps.dotenv || allDeps['@next/env']) {
      printSuccess('Environment handling dependencies found');
    } else {
      printInfo(
        'No explicit environment dependencies (using Next.js built-in)'
      );
    }
  } else {
    printError('package.json not found');
    integrated = false;
  }

  return integrated;
}

function testBuildCompatibility() {
  printHeader(
    'Build Compatibility Test',
    'Testing if template format works with build process'
  );

  let buildCompatible = true;

  try {
    const templatePath = '.env.local.example';
    const tempEnv = fs.readFileSync(templatePath, 'utf8');
    const envLines = tempEnv
      .split('\n')
      .filter(
        line =>
          line.trim() && !line.trim().startsWith('#') && line.includes('=')
      );

    if (envLines.length > 0) {
      printSuccess(`Found ${envLines.length} environment variable definitions`);
    } else {
      printWarning('No environment variables found in template');
    }
  } catch (error) {
    printError(`Build compatibility test failed: ${error.message}`);
    buildCompatible = false;
  }

  return buildCompatible;
}

function printSummary(results) {
  printHeader(
    '🎉 Environment Template Test Summary',
    'Mahardika Platform .env.local.example Validation Results'
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

  console.log(`\n${colors.navy}${colors.bold}📋 Test Results:${colors.reset}`);
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    console.log(`${color}   ${icon} ${test}${colors.reset}`);
  });

  if (passedTests === totalTests) {
    printGold(
      '\n🚀 All tests passed! .env.local.example is properly configured.'
    );
    console.log(
      `${colors.gray}Ready for use with Mahardika Platform development${colors.reset}`
    );
  } else {
    console.log(
      `\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Please review the issues above.${colors.reset}`
    );
  }

  console.log(`\n${colors.gold}${colors.bold}Next Steps:${colors.reset}`);
  console.log(
    `${colors.gray}1. Copy template: cp .env.local.example .env.local${colors.reset}`
  );
  console.log(`${colors.gray}2. Fill in your actual values${colors.reset}`);
  console.log(
    `${colors.gray}3. Start development: pnpm run dev${colors.reset}`
  );

  console.log(
    `\n${colors.navy}${colors.bold}Mahardika Brand Colors:${colors.reset}`
  );
  console.log(`${colors.gray}• Navy: #0D1B2A${colors.reset}`);
  console.log(`${colors.gray}• Gold: #F4B400${colors.reset}`);
}

// Main execution
async function main() {
  console.log(
    `${colors.navy}${colors.bold}Mahardika Platform - Environment Template Test Suite${colors.reset}`
  );
  console.log(
    `${colors.gray}Validating .env.local.example configuration and completeness${colors.reset}\n`
  );

  const results = {
    'Template Exists': testEnvTemplateExists(),
    'Required Variables': testRequiredVariables(),
    'Mahardika Branding': testMahardikaBranding(),
    'Template Structure': testTemplateStructure(),
    'Variable Validity': testEnvVariableValidity(),
    'Bootstrap Compatibility': testCompatibilityWithBootstrap(),
    'Package Integration': testPackageIntegration(),
    'Build Compatibility': testBuildCompatibility(),
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

// Run the tests
main().catch(error => {
  printError(`Test execution failed: ${error.message}`);
  process.exit(1);
});
