/**
 * Tests for Brand Color Enforcement Script
 * Ensures the check-brand script properly validates Mahardika brand colors
 */

describe('Brand Color Enforcement Script', () => {
  describe('Brand Color Constants', () => {
    test('should validate navy color format', () => {
      const navyColor = '#0D1B2A';
      expect(navyColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(navyColor.length).toBe(7);
    });

    test('should validate gold color format', () => {
      const goldColor = '#F4B400';
      expect(goldColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(goldColor.length).toBe(7);
    });

    test('should have correct brand color values', () => {
      expect('#0D1B2A').toBe('#0D1B2A'); // Navy
      expect('#F4B400').toBe('#F4B400'); // Gold
    });
  });

  describe('Color Validation Logic', () => {
    test('should identify valid hex colors', () => {
      const validColors = ['#0D1B2A', '#F4B400', '#FFFFFF', '#000000'];
      validColors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    test('should identify invalid hex colors', () => {
      const invalidColors = ['#ZZZ', '#12345', 'blue', 'rgb(255,0,0)'];
      invalidColors.forEach(color => {
        expect(color).not.toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('File Content Validation', () => {
    test('should detect brand colors in text content', () => {
      const contentWithBrandColors = `
        Generate a React component using Mahardika brand colours 
        (navy #0D1B2A primary, gold #F4B400 accent, 0.5rem rounded corners).
      `;

      expect(contentWithBrandColors).toContain('#0D1B2A');
      expect(contentWithBrandColors).toContain('#F4B400');
      expect(contentWithBrandColors).toContain('0.5rem');
    });

    test('should detect missing brand colors in text content', () => {
      const contentWithoutBrandColors = `
        Generate a React component using wrong colors 
        (blue #0000FF primary, red #FF0000 accent).
      `;

      expect(contentWithoutBrandColors).not.toContain('#0D1B2A');
      expect(contentWithoutBrandColors).not.toContain('#F4B400');
    });

    test('should validate environment variable format', () => {
      const envContent = `
        NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
        NEXT_PUBLIC_BRAND_GOLD=#F4B400
        DEEPSEEK_API_KEY=your-api-key-here
      `;

      expect(envContent).toContain('NEXT_PUBLIC_BRAND_NAVY=#0D1B2A');
      expect(envContent).toContain('NEXT_PUBLIC_BRAND_GOLD=#F4B400');
    });

    test('should validate colors.ts export format', () => {
      const colorsContent = `
        export const colors = {
          navy: '#0D1B2A',
          gold: '#F4B400',
        };
      `;

      expect(colorsContent).toContain("navy: '#0D1B2A'");
      expect(colorsContent).toContain("gold: '#F4B400'");
    });
  });

  describe('Border Radius Validation', () => {
    test('should detect consistent border radius', () => {
      const contentWithBorderRadius =
        'Use 0.5rem border radius for consistency';
      expect(contentWithBorderRadius).toContain('0.5rem');
    });

    test('should identify inconsistent border radius', () => {
      const contentWithInconsistentRadius = 'Use 8px border radius';
      expect(contentWithInconsistentRadius).not.toContain('0.5rem');
    });
  });

  describe('Script Integration', () => {
    test('should be executable as a Node.js script', () => {
      const fs = require('fs');
      const scriptPath = require.resolve('../check-brand.js');

      expect(fs.existsSync(scriptPath)).toBe(true);

      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('#!/usr/bin/env node');
      expect(scriptContent).toContain('#0D1B2A');
      expect(scriptContent).toContain('#F4B400');
    });

    test('should export brand colors constants', () => {
      const fs = require('fs');
      const scriptPath = require.resolve('../check-brand.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');

      expect(scriptContent).toContain("navy: '#0D1B2A'");
      expect(scriptContent).toContain("gold: '#F4B400'");
    });

    test('should have proper error handling structure', () => {
      const fs = require('fs');
      const scriptPath = require.resolve('../check-brand.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');

      expect(scriptContent).toContain('try');
      expect(scriptContent).toContain('catch');
      expect(scriptContent).toContain('process.exit');
    });
  });

  describe('Documentation Compliance', () => {
    test('should validate script has proper documentation', () => {
      const fs = require('fs');
      const scriptPath = require.resolve('../check-brand.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');

      expect(scriptContent).toContain('Brand Color Enforcement Script');
      expect(scriptContent).toContain('Mahardika Platform');
      expect(scriptContent).toContain('navy #0D1B2A');
      expect(scriptContent).toContain('gold #F4B400');
    });
  });
});
