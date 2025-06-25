/**
 * Mahardika Color System - Fiverr-Inspired Design
 * Modern marketplace colors with professional aesthetics
 */

export const colors = {
  // Primary Brand Colors - Fiverr-inspired
  primary: '#1dbf73', // Fiverr green
  secondary: '#404145', // Dark gray
  accent: '#62646a', // Medium gray

  // Extended Brand Palette
  brand: {
    50: '#e6f9f0',
    100: '#b3ecd4',
    200: '#80dfb8',
    300: '#4dd29c',
    400: '#26c281',
    500: '#1dbf73', // Primary
    600: '#19a862',
    700: '#158f52',
    800: '#117741',
    900: '#0d5e31',
  },

  // Neutral Colors - Professional grays
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e4e5e7',
    300: '#c5c6c9',
    400: '#95979d',
    500: '#74767e',
    600: '#62646a', // Accent
    700: '#404145', // Secondary
    800: '#222325',
    900: '#0e0e0f',
  },

  // Semantic Colors
  success: '#1dbf73',
  info: '#446ee7',
  warning: '#ffb33e',
  error: '#e4421e',

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f7f7f7',
    tertiary: '#efeff0',
    dark: '#404145',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.8)',
    gradient: 'linear-gradient(135deg, #1dbf73 0%, #19a862 100%)',
  },

  // Text Colors
  text: {
    primary: '#222325',
    secondary: '#62646a',
    tertiary: '#95979d',
    inverse: '#ffffff',
    link: '#1dbf73',
    placeholder: '#b5b6ba',
  },

  // Border Colors
  border: {
    light: '#e4e5e7',
    medium: '#dadbdd',
    dark: '#b5b6ba',
    focus: '#1dbf73',
  },

  // Interactive States
  hover: {
    primary: '#19a862',
    secondary: '#222325',
    light: '#f7f7f7',
    overlay: 'rgba(29, 191, 115, 0.1)',
  },

  // Shadow System - Subtle and modern
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
    xl: '0 16px 32px 0 rgba(0, 0, 0, 0.12)',
    '2xl': '0 24px 48px 0 rgba(0, 0, 0, 0.14)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Special Effects
  effects: {
    glow: {
      primary: '0 0 20px rgba(29, 191, 115, 0.4)',
      secondary: '0 0 20px rgba(64, 65, 69, 0.3)',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #1dbf73 0%, #19a862 100%)',
      secondary: 'linear-gradient(135deg, #404145 0%, #222325 100%)',
      subtle: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%)',
      vibrant: 'linear-gradient(135deg, #1dbf73 0%, #446ee7 100%)',
    },
  },

  // Component-specific colors
  components: {
    button: {
      primary: {
        bg: '#1dbf73',
        text: '#ffffff',
        hover: '#19a862',
        active: '#158f52',
      },
      secondary: {
        bg: '#ffffff',
        text: '#404145',
        hover: '#f7f7f7',
        active: '#efeff0',
        border: '#dadbdd',
      },
      outline: {
        bg: 'transparent',
        text: '#1dbf73',
        hover: 'rgba(29, 191, 115, 0.1)',
        border: '#1dbf73',
      },
    },
    card: {
      bg: '#ffffff',
      hover: '#fafafa',
      border: '#e4e5e7',
      shadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    input: {
      bg: '#ffffff',
      border: '#dadbdd',
      focus: '#1dbf73',
      error: '#e4421e',
      placeholder: '#b5b6ba',
    },
    badge: {
      new: '#446ee7',
      popular: '#ffb33e',
      pro: '#7a4bff',
      featured: '#1dbf73',
    },
  },

  gold: '#F4B400', // Gold accent (legacy)
  navy: '#0D1B2A', // Navy (legacy)
  white: '#ffffff', // White (legacy)
} as const;

export type Colors = typeof colors;
