#!/usr/bin/env node

/**
 * Brand Color Compliance Checker
 * Scans codebase for hardcoded Mahardika brand colors and non-brand component usage
 *
 * Usage: node scripts/check-brand-colors.js
 *
 * Mahardika Brand Colors:
 * - Navy: #0D1B2A
 * - Gold: #F4B400
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mahardika brand colors
const BRAND_COLORS = {
  navy: '#0D1B2A',
  gold: '#F4B400',
};

// Colors and patterns to check
const HARDCODED_PATTERNS = [
  // Exact brand colors (case insensitive)
  /#0D1B2A/gi,
  /#F4B400/gi,
  // Common variations
  /#0d1b2a/gi,
  /#f4b400/gi,
  // RGB equivalents
  /rgb\s*\(\s*13\s*,\s*27\s*,\s*42\s*\)/gi,
  /rgb\s*\(\s*244\s*,\s*180\s*,\s*0\s*\)/gi,
];

// Non-brand component patterns
const NON_BRAND_PATTERNS = [
  // HTML buttons instead of BrandButton
  /<button(?![^>]*BrandButton)/gi,
  // Bootstrap button classes instead of BrandButton
  /btn-primary|btn-secondary/gi,
  // Custom card divs instead of BrandCard
  /<div[^>]*class="[^"]*card[^"]*"/gi,
];

// Directories to scan
const SCAN_DIRECTORIES = ['apps/web/src', 'packages/ui/src'];

// Files to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.next/,
  /coverage/,
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /colors\.ts$/, // Allow hardcoded colors in the colors definition file
  /theme\.ts$/, // Allow hardcoded colors in the theme file
];

// File extensions to check
const INCLUDE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];

class BrandComplianceChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.filesScanned = 0;
  }

  /**
   * Main entry point
   */
  async run() {
    console.log('🎨 Mahardika Brand Compliance Checker');
    console.log('=====================================');
    console.log(`Navy: ${BRAND_COLORS.navy} • Gold: ${BRAND_COLORS.gold}\n`);

    try {
      // Scan all directories
      for (const dir of SCAN_DIRECTORIES) {
        if (fs.existsSync(dir)) {
          console.log(`📁 Scanning ${dir}...`);
          await this.scanDirectory(dir);
        } else {
          console.log(`⚠️  Directory ${dir} not found, skipping...`);
        }
      }

      // Report results
      this.printResults();

      // Exit with appropriate code
      if (this.violations.length > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error during brand compliance check:', error.message);
      process.exit(1);
    }
  }

  /**
   * Recursively scan directory for files
   */
  async scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!this.shouldExclude(fullPath)) {
          await this.scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Check if file should be scanned
        if (this.shouldScanFile(fullPath)) {
          await this.scanFile(fullPath);
        }
      }
    }
  }

  /**
   * Check if path should be excluded
   */
  shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  /**
   * Check if file should be scanned
   */
  shouldScanFile(filePath) {
    if (this.shouldExclude(filePath)) {
      return false;
    }

    const ext = path.extname(filePath);
    return INCLUDE_EXTENSIONS.includes(ext);
  }

  /**
   * Scan individual file for violations
   */
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.filesScanned++;

      // Check for hardcoded colors
      this.checkHardcodedColors(filePath, content);

      // Check for non-brand components (only in React files)
      if (filePath.match(/\.(tsx|jsx)$/)) {
        this.checkNonBrandComponents(filePath, content);
      }
    } catch (error) {
      this.warnings.push({
        file: filePath,
        type: 'file_error',
        message: `Could not read file: ${error.message}`,
      });
    }
  }

  /**
   * Check for hardcoded brand colors
   */
  checkHardcodedColors(filePath, content) {
    const lines = content.split('\n');

    HARDCODED_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const line = lines[lineNumber - 1];

        this.violations.push({
          file: filePath,
          line: lineNumber,
          type: 'hardcoded_color',
          message: `Hardcoded brand color found: ${match[0]}`,
          suggestion:
            'Use colors.navy or colors.gold from @mahardika/ui instead',
          context: line.trim(),
        });
      }
    });
  }

  /**
   * Check for non-brand components
   */
  checkNonBrandComponents(filePath, content) {
    const lines = content.split('\n');

    // Check for HTML buttons
    this.checkPattern(
      filePath,
      content,
      lines,
      /<button(?![^>]*BrandButton)/gi,
      'non_brand_button',
      'HTML button found',
      'Use BrandButton from @mahardika/ui instead'
    );

    // Check for Bootstrap button classes
    this.checkPattern(
      filePath,
      content,
      lines,
      /className="[^"]*btn-(primary|secondary)[^"]*"/gi,
      'bootstrap_button',
      'Bootstrap button class found',
      'Use BrandButton with variant prop instead'
    );

    // Check for custom card divs (more lenient check)
    this.checkPattern(
      filePath,
      content,
      lines,
      /<div[^>]*className="[^"]*\bcard\b[^"]*"/gi,
      'custom_card',
      'Custom card div found',
      'Consider using BrandCard from @mahardika/ui'
    );
  }

  /**
   * Check for specific pattern and add violations
   */
  checkPattern(filePath, content, lines, pattern, type, message, suggestion) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const line = lines[lineNumber - 1];

      // Skip if it's already using a brand component
      if (line.includes('BrandButton') || line.includes('BrandCard')) {
        continue;
      }

      this.violations.push({
        file: filePath,
        line: lineNumber,
        type,
        message,
        suggestion,
        context: line.trim(),
      });
    }
  }

  /**
   * Print results summary
   */
  printResults() {
    console.log(`\n📊 Scan Results`);
    console.log(`Files scanned: ${this.filesScanned}`);
    console.log(`Violations found: ${this.violations.length}`);
    console.log(`Warnings: ${this.warnings.length}\n`);

    if (this.violations.length === 0 && this.warnings.length === 0) {
      console.log('✅ No brand compliance violations found!');
      console.log('🎉 All components are using Mahardika brand standards.');
      return;
    }

    // Group violations by type
    const violationsByType = this.violations.reduce((acc, violation) => {
      if (!acc[violation.type]) {
        acc[violation.type] = [];
      }
      acc[violation.type].push(violation);
      return acc;
    }, {});

    // Print violations by type
    Object.entries(violationsByType).forEach(([type, violations]) => {
      console.log(
        `\n❌ ${this.getTypeDisplayName(type)} (${violations.length})`
      );
      console.log('─'.repeat(50));

      violations.forEach(violation => {
        console.log(`📄 ${violation.file}:${violation.line}`);
        console.log(`   ${violation.message}`);
        console.log(`   💡 ${violation.suggestion}`);
        console.log(`   📝 ${violation.context}`);
        console.log('');
      });
    });

    // Print warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length})`);
      console.log('─'.repeat(50));

      this.warnings.forEach(warning => {
        console.log(`📄 ${warning.file}`);
        console.log(`   ${warning.message}`);
        console.log('');
      });
    }

    // Print summary and next steps
    console.log('\n🔧 How to Fix:');
    console.log('1. Replace hardcoded colors with colors.navy and colors.gold');
    console.log(
      '2. Import colors from @mahardika/ui: import { colors } from "@mahardika/ui"'
    );
    console.log('3. Replace HTML buttons with BrandButton components');
    console.log('4. Replace custom cards with BrandCard components');
    console.log(
      '5. Use brand component variants: navy, gold, navy-outline, gold-outline'
    );

    console.log('\n📚 Resources:');
    console.log('• Brand Component Guide: packages/ui/README.md');
    console.log('• Code Review Checklist: CODE_REVIEW_CHECKLIST.md');
    console.log('• Color Reference: packages/ui/src/colors.ts');
  }

  /**
   * Get display name for violation type
   */
  getTypeDisplayName(type) {
    const typeNames = {
      hardcoded_color: 'Hardcoded Brand Colors',
      non_brand_button: 'Non-Brand Buttons',
      bootstrap_button: 'Bootstrap Button Classes',
      custom_card: 'Custom Card Components',
    };

    return typeNames[type] || type;
  }
}

// Run the checker if this script is executed directly
if (require.main === module) {
  const checker = new BrandComplianceChecker();
  checker.run().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = BrandComplianceChecker;
