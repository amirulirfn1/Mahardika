#!/usr/bin/env node
/**
 * Brand Color Enforcement Script - Mahardika Platform
 * Ensures consistent usage of brand colors (navy #0D1B2A and gold #F4B400) in prompts and UI
 *
 * This script checks:
 * - Prompt guidelines contain brand colors
 * - UI components use official brand colors
 * - Documentation references correct brand colors
 * - No hardcoded colors that deviate from brand standards
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mahardika brand colors
const BRAND_COLORS = {
  navy: '#0D1B2A',
  gold: '#F4B400',
};

// Console colors for output
const colors = {
  navy: '\x1b[38;2;13;27;42m',
  gold: '\x1b[38;2;244;180;0m',
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

let hasErrors = false;
let warnings = [];
let successes = [];

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  hasErrors = true;
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
  warnings.push(message);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
  successes.push(message);
}

function logInfo(message) {
  console.log(`${colors.gray}   ${message}${colors.reset}`);
}

function printHeader() {
  console.log(
    `\n${colors.navy}${colors.bold}🎨 Mahardika Brand Color Check${colors.reset}`
  );
  console.log(
    `${colors.gold}Enforcing consistent use of navy #0D1B2A and gold #F4B400${colors.reset}\n`
  );
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logError(`Failed to read file: ${filePath}`);
    return null;
  }
}

function checkPromptGuidelines() {
  console.log(`${colors.navy}1. Checking Prompt Guidelines...${colors.reset}`);

  const promptFile = 'PROMPT_GUIDELINES.md';
  if (!checkFileExists(promptFile)) {
    logError(`Prompt guidelines file missing: ${promptFile}`);
    return;
  }

  const content = readFileContent(promptFile);
  if (!content) return;

  // Check for navy color
  const hasNavy =
    content.includes(BRAND_COLORS.navy) || content.includes('navy #0D1B2A');
  const hasGold =
    content.includes(BRAND_COLORS.gold) || content.includes('gold #F4B400');

  if (hasNavy && hasGold) {
    logSuccess('Prompt guidelines contain both brand colors');
    logInfo(`Navy: ${BRAND_COLORS.navy}, Gold: ${BRAND_COLORS.gold}`);
  } else {
    if (!hasNavy) {
      logError(`Prompt guidelines missing navy color: ${BRAND_COLORS.navy}`);
    }
    if (!hasGold) {
      logError(`Prompt guidelines missing gold color: ${BRAND_COLORS.gold}`);
    }
  }

  // Check for border radius consistency
  if (content.includes('0.5rem')) {
    logSuccess('Consistent border radius (0.5rem) specified in prompts');
  } else {
    logWarning(
      'Border radius standard (0.5rem) not found in prompt guidelines'
    );
  }
}

function checkUIComponents() {
  console.log(`\n${colors.navy}2. Checking UI Components...${colors.reset}`);

  const uiPackagePath = 'packages/ui/src';
  if (!checkFileExists(uiPackagePath)) {
    logError(`UI package not found: ${uiPackagePath}`);
    return;
  }

  // Check colors.ts file
  const colorsFile = path.join(uiPackagePath, 'colors.ts');
  if (checkFileExists(colorsFile)) {
    const content = readFileContent(colorsFile);
    if (content) {
      const hasNavy = content.includes(BRAND_COLORS.navy);
      const hasGold = content.includes(BRAND_COLORS.gold);

      if (hasNavy && hasGold) {
        logSuccess('colors.ts contains official brand colors');
      } else {
        logError('colors.ts missing official brand colors');
        logInfo(
          `Expected navy: ${BRAND_COLORS.navy}, gold: ${BRAND_COLORS.gold}`
        );
      }
    }
  } else {
    logWarning('colors.ts file not found in UI package');
  }

  // Check component files for brand color usage
  const componentFiles = ['Button.tsx', 'Card.tsx', 'index.ts'];
  componentFiles.forEach(fileName => {
    const filePath = path.join(uiPackagePath, fileName);
    if (checkFileExists(filePath)) {
      const content = readFileContent(filePath);
      if (content) {
        // Check for any hardcoded colors that aren't brand colors
        const colorMatches = content.match(/#[0-9A-Fa-f]{6}/g) || [];
        const nonBrandColors = colorMatches.filter(
          color =>
            color.toUpperCase() !== BRAND_COLORS.navy.toUpperCase() &&
            color.toUpperCase() !== BRAND_COLORS.gold.toUpperCase()
        );

        if (nonBrandColors.length > 0) {
          logWarning(
            `Non-brand colors found in ${fileName}: ${nonBrandColors.join(', ')}`
          );
          logInfo('Consider using brand colors or colors from the palette');
        } else if (colorMatches.length > 0) {
          logSuccess(`Brand colors properly used in ${fileName}`);
        }
      }
    }
  });
}

function checkDocumentation() {
  console.log(`\n${colors.navy}3. Checking Documentation...${colors.reset}`);

  const docFiles = [
    'README.md',
    'SECURITY.md',
    'LINTING.md',
    'GIT_IMPLEMENTATION.md',
    'BOOTSTRAP.md',
  ];

  docFiles.forEach(fileName => {
    if (checkFileExists(fileName)) {
      const content = readFileContent(fileName);
      if (content) {
        const hasNavy = content.includes(BRAND_COLORS.navy);
        const hasGold = content.includes(BRAND_COLORS.gold);

        if (hasNavy && hasGold) {
          logSuccess(`${fileName} contains brand colors`);
        } else if (hasNavy || hasGold) {
          logInfo(`${fileName} partially references brand colors`);
        }
      }
    }
  });
}

function checkEnvironmentFiles() {
  console.log(
    `\n${colors.navy}4. Checking Environment Configuration...${colors.reset}`
  );

  const envExample = '.env.local.example';
  if (checkFileExists(envExample)) {
    const content = readFileContent(envExample);
    if (content) {
      const hasNavyEnv =
        content.includes('NEXT_PUBLIC_BRAND_NAVY') &&
        content.includes(BRAND_COLORS.navy);
      const hasGoldEnv =
        content.includes('NEXT_PUBLIC_BRAND_GOLD') &&
        content.includes(BRAND_COLORS.gold);

      if (hasNavyEnv && hasGoldEnv) {
        logSuccess('Environment template includes brand color variables');
      } else {
        logError('Environment template missing brand color configuration');
        logInfo(
          'Should include NEXT_PUBLIC_BRAND_NAVY and NEXT_PUBLIC_BRAND_GOLD'
        );
      }
    }
  } else {
    logWarning('Environment template file not found');
  }
}

function checkStagedFiles() {
  console.log(`\n${colors.navy}5. Checking Staged Files...${colors.reset}`);

  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only', {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(file => file.length > 0);

    if (stagedFiles.length === 0) {
      logInfo('No staged files to check');
      return;
    }

    let stagedIssues = false;
    stagedFiles.forEach(filePath => {
      if (filePath.match(/\.(tsx?|jsx?|md)$/) && checkFileExists(filePath)) {
        const content = readFileContent(filePath);
        if (content) {
          // Look for hardcoded colors that aren't brand colors
          const colorMatches = content.match(/#[0-9A-Fa-f]{6}/g) || [];
          const problematicColors = colorMatches.filter(color => {
            const upperColor = color.toUpperCase();
            return (
              upperColor !== BRAND_COLORS.navy.toUpperCase() &&
              upperColor !== BRAND_COLORS.gold.toUpperCase() &&
              !isCommonAcceptableColor(upperColor)
            );
          });

          if (problematicColors.length > 0) {
            logWarning(
              `Staged file ${filePath} contains non-brand colors: ${problematicColors.join(', ')}`
            );
            stagedIssues = true;
          }
        }
      }
    });

    if (!stagedIssues) {
      logSuccess('All staged files follow brand color guidelines');
    }
  } catch (error) {
    logInfo('Could not check staged files (not in git repository or no git)');
  }
}

function isCommonAcceptableColor(color) {
  // Allow common UI colors like white, black, transparent backgrounds
  const acceptableColors = [
    '#FFFFFF',
    '#000000',
    '#TRANSPARENT',
    '#F8FAFC',
    '#F1F5F9',
    '#E2E8F0', // Gray scale
    '#10B981',
    '#EF4444',
    '#F59E0B',
    '#3B82F6', // Semantic colors (success, error, warning, info)
  ];
  return acceptableColors.includes(color.toUpperCase());
}

function printSummary() {
  console.log(`\n${colors.navy}${colors.bold}📊 Summary${colors.reset}`);
  console.log(
    `${colors.green}✅ Successes: ${successes.length}${colors.reset}`
  );
  console.log(
    `${colors.yellow}⚠️  Warnings: ${warnings.length}${colors.reset}`
  );

  if (hasErrors) {
    console.log(
      `${colors.red}❌ Errors found - please fix before committing${colors.reset}`
    );
    console.log(
      `${colors.gray}   Ensure all prompts and UI use official brand colors:${colors.reset}`
    );
    console.log(`${colors.navy}   Navy: ${BRAND_COLORS.navy}${colors.reset}`);
    console.log(`${colors.gold}   Gold: ${BRAND_COLORS.gold}${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Brand color standards met!${colors.reset}`);
    console.log(
      `${colors.navy}   Consistent use of Mahardika brand colors${colors.reset}`
    );
    console.log(
      `${colors.gold}   Navy ${BRAND_COLORS.navy} • Gold ${BRAND_COLORS.gold}${colors.reset}`
    );
  }
}

// Main execution
function main() {
  printHeader();

  checkPromptGuidelines();
  checkUIComponents();
  checkDocumentation();
  checkEnvironmentFiles();
  checkStagedFiles();

  printSummary();

  if (hasErrors) {
    process.exit(1);
  }
}

// Run the script
main();
