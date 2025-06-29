/**
 * Mahardika Brand Colors
 * Official brand palette for consistent styling across all components
 */

import { colors as brandColors } from "@mahardika/ui";

export const colors = {
  // Primary Mahardika Brand Colors
  navy: brandColors.navy,
  gold: brandColors.gold,

  // Extended Palette
  primary: brandColors.navy,
  secondary: brandColors.gold,

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
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

  // State Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Component Variants
  background: {
    primary: brandColors.navy,
    secondary: brandColors.gold,
    neutral: '#F9FAFB',
    dark: '#111827',
  },

  text: {
    primary: brandColors.navy,
    secondary: '#6B7280',
    light: '#FFFFFF',
    muted: '#9CA3AF',
  },

  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#374151',
    brand: brandColors.navy,
  },
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
