/**
 * Mahardika Modern Design System
 * Apple-inspired typography with Fiverr-style marketplace aesthetics
 * Focus: Clean, sophisticated, mobile-first
 */

import { colors } from './colors';

// Modern Typography System - Apple Style
export const typography = {
  fontFamily: {
    primary:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    heading:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
  },

  // Modern Scale - Mobile First
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
  },

  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
    wider: '0.02em',
    widest: '0.05em',
  },
};

// Modern Spacing System
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
};

// Modern Breakpoints - Mobile First
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Modern Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Component Design System
export const components = {
  // Modern Button System
  button: {
    base: {
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: typography.letterSpacing.tight,
      borderRadius: borderRadius.lg,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent',
      outline: 'none',
      textDecoration: 'none',
    },
    sizes: {
      xs: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.xs,
        lineHeight: typography.lineHeight.tight,
      },
      sm: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.tight,
      },
      md: {
        padding: `${spacing[3]} ${spacing[5]}`,
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.normal,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[6]}`,
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.normal,
      },
      xl: {
        padding: `${spacing[5]} ${spacing[8]}`,
        fontSize: typography.fontSize.xl,
        lineHeight: typography.lineHeight.normal,
      },
    },
    variants: {
      primary: {
        backgroundColor: colors.primary,
        color: colors.text.inverse,
        borderColor: colors.primary,
        boxShadow: colors.shadow.sm,
        ':hover': {
          backgroundColor: colors.hover.primary,
          borderColor: colors.hover.primary,
          boxShadow: colors.shadow.md,
          transform: 'translateY(-1px)',
        },
        ':active': {
          transform: 'translateY(0)',
          boxShadow: colors.shadow.sm,
        },
      },
      secondary: {
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
        borderColor: colors.border.medium,
        boxShadow: colors.shadow.sm,
        ':hover': {
          backgroundColor: colors.hover.light,
          borderColor: colors.border.dark,
          boxShadow: colors.shadow.md,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary,
        borderColor: colors.primary,
        ':hover': {
          backgroundColor: colors.hover.overlay,
          borderColor: colors.hover.primary,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderColor: 'transparent',
        ':hover': {
          backgroundColor: colors.hover.light,
        },
      },
    },
  },

  // Modern Card System
  card: {
    base: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.xl,
      border: `1px solid ${colors.border.light}`,
      overflow: 'hidden',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    sizes: {
      sm: {
        padding: spacing[4],
      },
      md: {
        padding: spacing[6],
      },
      lg: {
        padding: spacing[8],
      },
    },
    variants: {
      default: {
        boxShadow: colors.shadow.sm,
        ':hover': {
          boxShadow: colors.shadow.lg,
          transform: 'translateY(-2px)',
        },
      },
      elevated: {
        boxShadow: colors.shadow.md,
        ':hover': {
          boxShadow: colors.shadow.xl,
          transform: 'translateY(-4px)',
        },
      },
      outlined: {
        borderColor: colors.border.medium,
        boxShadow: 'none',
        ':hover': {
          borderColor: colors.border.dark,
          boxShadow: colors.shadow.sm,
        },
      },
      glass: {
        backgroundColor: colors.background.glass,
        backdropFilter: 'blur(20px)',
        borderColor: colors.border.light,
        boxShadow: colors.shadow.glass,
      },
    },
  },

  // Modern Input System
  input: {
    base: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.lineHeight.normal,
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.border.light}`,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      ':focus': {
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${colors.hover.overlay}`,
      },
      ':hover': {
        borderColor: colors.border.medium,
      },
      '::placeholder': {
        color: colors.text.placeholder,
      },
    },
  },
};

// Complete Theme Export
export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  components,
} as const;

// Bootstrap 5 Modern Override Map
export const bootstrapColorOverrides = {
  primary: colors.primary,
  secondary: colors.gray[500],
  success: colors.success,
  info: colors.info,
  warning: colors.warning,
  danger: colors.error,
  light: colors.gray[50],
  dark: colors.gray[900],
} as const;

// SCSS Variables for Bootstrap integration
export const scssVariables = `
// Modern Color System
$primary: ${colors.primary};
$secondary: ${colors.gray[500]};
$success: ${colors.success};
$info: ${colors.info};
$warning: ${colors.warning};
$danger: ${colors.error};
$light: ${colors.gray[50]};
$dark: ${colors.gray[900]};

// Typography
$font-family-sans-serif: ${typography.fontFamily.primary};
$font-family-monospace: ${typography.fontFamily.mono};

// Modern Spacing
$spacer: 1rem;
$spacers: (
  0: 0,
  1: 0.25rem,
  2: 0.5rem,
  3: 0.75rem,
  4: 1rem,
  5: 1.25rem,
  6: 1.5rem,
  8: 2rem,
  10: 2.5rem,
  12: 3rem,
  16: 4rem,
  20: 5rem,
  24: 6rem
);

// Modern Border Radius
$border-radius: ${borderRadius.lg};
$border-radius-sm: ${borderRadius.sm};
$border-radius-lg: ${borderRadius.xl};
$border-radius-xl: ${borderRadius['2xl']};
$border-radius-pill: ${borderRadius.full};

// Component overrides
$btn-border-radius: ${borderRadius.lg};
$card-border-radius: ${borderRadius.xl};
$input-border-radius: ${borderRadius.lg};
$modal-border-radius: ${borderRadius.xl};

// Modern shadows
$box-shadow: ${colors.shadow.sm};
$box-shadow-sm: ${colors.shadow.xs};
$box-shadow-lg: ${colors.shadow.lg};
`;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeBreakpoints = typeof theme.breakpoints;
