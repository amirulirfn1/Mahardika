/**
 * @mahardika/ui - Mahardika UI Component Library
 *
 * A comprehensive UI component library featuring the official Mahardika brand colors
 * (navy #0D1B2A and gold #F4B400) with consistent styling and accessibility.
 */

// Export colors and theme
export { colors } from './colors';
export type { Colors, ColorKey } from './colors';

export { theme } from './theme';
export type {
  Theme,
  ThemeColors,
  ThemeSpacing,
  ThemeBreakpoints,
  ComponentVariant,
  ComponentSize,
} from './theme';

// Export components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { AIChat } from './AIChat';
export type { AIChatProps } from './AIChat';

export { SecurityStatus } from './SecurityStatus';
export type { SecurityStatusProps } from './SecurityStatus';

// Export brand components
export { BrandButton, BrandButtonTemplates } from './BrandButton';
export type { BrandButtonProps } from './BrandButton';

export { BrandCard, BrandCardTemplates } from './BrandCard';
export type { BrandCardProps } from './BrandCard';

// Export demo component
export { MahardikaDemo } from './demo';
