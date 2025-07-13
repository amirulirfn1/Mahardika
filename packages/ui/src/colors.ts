/**
 * Mahardika Color System - Fiverr-Inspired Design
 * Modern marketplace colors with professional aesthetics
 */

export const colors = {
  // Primary Brand Colors - Mahardika
  primary: '#0D1B2A', // Navy
  secondary: '#F4B400', // Gold
  accent: '#FFD23F', // Light Gold

  // Extended Brand Palette
  brand: {
    50: '#E7E9EB',
    100: '#C2C8CC',
    200: '#9DA6AD',
    300: '#78858E',
    400: '#53636F',
    500: '#0D1B2A', // Primary
    600: '#0B1724',
    700: '#09131E',
    800: '#070F18',
    900: '#050B12',
  },

  // Neutral Colors - Professional grays
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

  // Semantic Colors
  success: '#10B981',
  successDark: '#059669',
  info: '#3B82F6',
  warning: '#F59E0B',
  error: '#EF4444',
  errorDark: '#dc2626',

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#0D1B2A',
    overlay: 'rgba(13, 27, 42, 0.6)',
    glass: 'rgba(255, 255, 255, 0.8)',
    gradient: 'linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)',
  },

  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#F4B400',
    placeholder: '#9CA3AF',
  },

  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
    focus: '#F4B400',
  },

  // Interactive States
  hover: {
    navy: '#1a2332',
    gold: '#FFD23F',
    light: '#F9FAFB',
    overlay: 'rgba(13, 27, 42, 0.1)',
  },
  active: {
    navy: '#0a1520',
    gold: '#E6A200',
  },

  // Shadow System - Subtle and modern
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },

  // Special Effects
  effects: {
    glow: {
      primary: '0 0 20px rgba(13, 27, 42, 0.4)',
      secondary: '0 0 20px rgba(244, 180, 0, 0.3)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)',
      secondary: 'linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)',
      subtle: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
      vibrant: 'linear-gradient(135deg, #0D1B2A 0%, #F4B400 100%)',
      brand: 'linear-gradient(135deg, #0D1B2A 0%, #F4B400 100%)',
    },
  },

  // Component-specific colors
  components: {
    button: {
      primary: {
        bg: '#0D1B2A',
        text: '#FFFFFF',
        hover: '#1a2332',
        active: '#0a1520',
      },
      secondary: {
        bg: '#F4B400',
        text: '#0D1B2A',
        hover: '#FFD23F',
        active: '#E6A200',
        border: '#F4B400',
      },
      outline: {
        bg: 'transparent',
        text: '#0D1B2A',
        hover: 'rgba(13, 27, 42, 0.1)',
        border: '#0D1B2A',
      },
    },
    card: {
      bg: '#FFFFFF',
      hover: '#F9FAFB',
      border: '#E5E7EB',
      shadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    input: {
      bg: '#FFFFFF',
      border: '#D1D5DB',
      focus: '#F4B400',
      error: '#EF4444',
      placeholder: '#9CA3AF',
    },
    badge: {
      new: '#3B82F6',
      popular: '#F59E0B',
      pro: '#8B5CF6',
      featured: '#10B981',
    },
  },

  gradients: {
    primary: 'linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)',
    secondary: 'linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)',
    brand: 'linear-gradient(135deg, #0D1B2A 0%, #F4B400 100%)',
  },

  gold: '#F4B400', // Gold accent (legacy)
  navy: '#0D1B2A', // Navy (legacy)
  white: '#FFFFFF', // White (legacy)
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
