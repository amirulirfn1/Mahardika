/**
 * Mahardika Modern Color System
 * Luxury marketplace design inspired by modern platforms like Fiverr
 * Focus: Light, sophisticated, easy on the eyes
 */

export const colors = {
  // Primary Brand Colors - Modern & Sophisticated
  primary: '#1DBF73', // Fiverr-inspired green (trust, growth, success)
  secondary: '#FF6B35', // Warm orange accent (energy, creativity)
  
  // Legacy aliases (will be phased out)
  navy: '#1DBF73', // Map to new primary
  gold: '#FF6B35', // Map to new secondary

  // Neutral Colors - Light & Airy
  white: '#FFFFFF',
  black: '#000000',
  
  // Sophisticated Gray Scale
  gray: {
    25: '#FCFCFD',   // Almost white
    50: '#F9FAFB',   // Very light gray
    100: '#F2F4F7',  // Light gray
    200: '#EAECF0',  // Border gray
    300: '#D0D5DD',  // Subtle gray
    400: '#98A2B3',  // Medium gray
    500: '#667085',  // Text gray
    600: '#475467',  // Dark text gray
    700: '#344054',  // Heading gray
    800: '#1D2939',  // Almost black
    900: '#101828',  // Deep black
  },

  // State Colors - Modern & Accessible
  success: '#12B76A',   // Modern green
  warning: '#F79009',   // Modern amber
  error: '#F04438',     // Modern red
  info: '#2E90FA',      // Modern blue

  // Background System
  background: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#F9FAFB',   // Light gray
    tertiary: '#F2F4F7',   // Subtle gray
    glass: 'rgba(255, 255, 255, 0.8)', // Glass morphism
    overlay: 'rgba(0, 0, 0, 0.4)',     // Dark overlay
    gradient: 'linear-gradient(135deg, #1DBF73 0%, #17A360 100%)', // Primary gradient
  },

  // Text System
  text: {
    primary: '#101828',     // Almost black
    secondary: '#344054',   // Dark gray
    tertiary: '#475467',    // Medium gray
    placeholder: '#667085', // Light gray
    inverse: '#FFFFFF',     // White text
    success: '#027A48',     // Success text
    warning: '#B54708',     // Warning text
    error: '#B42318',       // Error text
    info: '#1570EF',        // Info text
  },

  // Border System
  border: {
    light: '#EAECF0',      // Light border
    medium: '#D0D5DD',     // Medium border
    dark: '#98A2B3',       // Dark border
    primary: '#1DBF73',    // Primary border
    error: '#F04438',      // Error border
  },

  // Interactive States
  hover: {
    primary: '#17A360',     // Darker green
    secondary: '#E55A2B',   // Darker orange
    light: '#F9FAFB',       // Light hover
    overlay: 'rgba(29, 191, 115, 0.1)', // Primary overlay
  },

  // Shadows & Effects
  shadow: {
    xs: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
    sm: '0 1px 3px 0 rgba(16, 24, 40, 0.1), 0 1px 2px 0 rgba(16, 24, 40, 0.06)',
    md: '0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
    xl: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
