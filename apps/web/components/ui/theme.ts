import { colors } from "@mahardika/ui";
/**
 * Mahardika Brand Theme System
 * Comprehensive design system for consistent styling across all components
 */

// Bootstrap 5 Color Override Map
export const bootstrapColorOverrides = {
  primary: 'colors.navy', // Mahardika Navy
  secondary: '#6B7280', // Neutral gray
  success: '#10B981',
  info: '#3B82F6',
  warning: 'colors.gold', // Mahardika Gold
  danger: '#EF4444',
  light: '#F9FAFB',
  dark: '#111827',
} as const;

// SCSS Variables for Bootstrap integration
export const scssVariables = `
// Mahardika Brand Colors for Bootstrap
$primary: colors.navy;
$secondary: #6B7280;
$success: #10B981;
$info: #3B82F6;
$warning: colors.gold;
$danger: #EF4444;
$light: #F9FAFB;
$dark: #111827;

// Mahardika specific variables
$mahardika-navy: colors.navy;
$mahardika-gold: colors.gold;
$mahardika-border-radius: 0.5rem;

// Bootstrap overrides
$border-radius: $mahardika-border-radius;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.75rem;
$border-radius-xl: 1rem;
$border-radius-pill: 50rem;

// Component specific overrides
$btn-border-radius: $mahardika-border-radius;
$card-border-radius: $mahardika-border-radius;
$input-border-radius: $mahardika-border-radius;
$modal-border-radius: $mahardika-border-radius;
$popover-border-radius: $mahardika-border-radius;
$tooltip-border-radius: $mahardika-border-radius;

// Typography
$font-family-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
$font-family-monospace: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
`;

export const theme = {
  // Brand Colors - Official Mahardika palette
  colors: {
    // Primary brand colors
    navy: 'colors.navy',
    gold: 'colors.gold',

    // Extended brand palette
    primary: 'colors.navy', // Navy alias
    secondary: 'colors.gold', // Gold alias

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Gray scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // State colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Component-specific colors
    background: {
      primary: 'colors.navy',
      secondary: 'colors.gold',
      neutral: '#F9FAFB',
      dark: '#111827',
      light: '#FFFFFF',
      glass: {
        navy: 'rgba(13, 27, 42, 0.85)',
        gold: 'rgba(244, 180, 0, 0.85)',
      },
    },

    text: {
      primary: 'colors.navy',
      secondary: '#6B7280',
      light: '#FFFFFF',
      muted: '#9CA3AF',
      inverse: '#FFFFFF',
    },

    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#374151',
      navy: 'colors.navy',
      gold: 'colors.gold',
    },

    // Hover and active states
    hover: {
      navy: '#1a2332',
      gold: '#FFD23F',
      navyLight: 'rgba(13, 27, 42, 0.05)',
      goldLight: 'rgba(244, 180, 0, 0.05)',
    },

    active: {
      navy: '#0a1520',
      gold: '#E6A200',
    },

    // Gradient variations
    gradients: {
      primary: 'linear-gradient(135deg, colors.navy 0%, #1a2332 100%)',
      secondary: 'linear-gradient(135deg, colors.gold 0%, #FFD23F 100%)',
      brand: 'linear-gradient(135deg, colors.navy 0%, colors.gold 100%)',
      brandReverse: 'linear-gradient(135deg, colors.gold 0%, colors.navy 100%)',
      animated:
        'linear-gradient(135deg, colors.navy 0%, colors.gold 50%, colors.navy 100%)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      heading: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    },

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
    },

    fontWeight: {
      light: '300',
      normal: '400',
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
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing scale
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    default: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px - Mahardika standard
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Brand-specific shadows
    brand: {
      navy: {
        sm: '0 4px 14px 0 rgba(13, 27, 42, 0.39)',
        md: '0 8px 25px 0 rgba(13, 27, 42, 0.5)',
        lg: '0 16px 40px 0 rgba(13, 27, 42, 0.45)',
        xl: '0 20px 50px 0 rgba(13, 27, 42, 0.4)',
      },
      gold: {
        sm: '0 4px 14px 0 rgba(244, 180, 0, 0.39)',
        md: '0 8px 25px 0 rgba(244, 180, 0, 0.5)',
        lg: '0 16px 40px 0 rgba(244, 180, 0, 0.45)',
        xl: '0 20px 50px 0 rgba(244, 180, 0, 0.4)',
      },
    },
  },

  // Transitions
  transitions: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:
      'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Brand-specific transitions
    brand: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },

  // Z-index scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1020',
    banner: '1030',
    overlay: '1040',
    modal: '1050',
    popover: '1060',
    skipLink: '1070',
    toast: '1080',
    tooltip: '1090',
  },

  // Component variants
  components: {
    button: {
      sizes: {
        sm: {
          padding: '0.75rem 1.25rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          gap: '0.5rem',
        },
        md: {
          padding: '1rem 2rem',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          gap: '0.75rem',
        },
        lg: {
          padding: '1.25rem 2.5rem',
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          gap: '1rem',
        },
      },

      variants: {
        navy: {
          backgroundColor: 'colors.navy',
          borderColor: 'colors.navy',
          color: '#FFFFFF',
        },
        gold: {
          backgroundColor: 'colors.gold',
          borderColor: 'colors.gold',
          color: 'colors.navy',
        },
        'outline-navy': {
          backgroundColor: 'transparent',
          borderColor: 'colors.navy',
          color: 'colors.navy',
        },
        'outline-gold': {
          backgroundColor: 'transparent',
          borderColor: 'colors.gold',
          color: 'colors.gold',
        },
      },
    },

    card: {
      sizes: {
        sm: {
          padding: '1.25rem',
          minHeight: '120px',
        },
        md: {
          padding: '1.75rem',
          minHeight: '160px',
        },
        lg: {
          padding: '2.5rem',
          minHeight: '200px',
        },
        xl: {
          padding: '3.5rem',
          minHeight: '280px',
        },
      },

      variants: {
        'navy-primary': {
          background: 'linear-gradient(135deg, colors.navy 0%, #1a2332 100%)',
          border: '1px solid colors.navy',
          color: '#FFFFFF',
        },
        'gold-primary': {
          background: 'linear-gradient(135deg, colors.gold 0%, #FFD23F 100%)',
          border: '1px solid colors.gold',
          color: 'colors.navy',
        },
        'navy-outline': {
          backgroundColor: 'transparent',
          border: '2px solid colors.navy',
          color: 'colors.navy',
        },
        'gold-outline': {
          backgroundColor: 'transparent',
          border: '2px solid colors.gold',
          color: 'colors.gold',
        },
      },
    },
  },

  // Animation keyframes
  animations: {
    gradientShift: {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },

    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },

    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },

    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },

    scaleIn: {
      '0%': { transform: 'scale(0.9)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },

    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },

    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },

    bounce: {
      '0%, 100%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
      },
      '50%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeBreakpoints = typeof theme.breakpoints;
export type ComponentVariant =
  | keyof typeof theme.components.button.variants
  | keyof typeof theme.components.card.variants;
export type ComponentSize =
  | keyof typeof theme.components.button.sizes
  | keyof typeof theme.components.card.sizes;

// Default export
export default theme;
