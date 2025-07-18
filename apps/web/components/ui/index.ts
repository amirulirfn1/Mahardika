/**
 * @mahardika/ui - Mahardika UI Component Library
 *
 * A comprehensive UI component library featuring modern design system
 * with Fiverr-inspired marketplace aesthetics and Apple-style typography.
 */

// Export colors and theme
export { colors } from './colors';
export type { Colors, ColorKey } from './colors';

export { theme, bootstrapColorOverrides, scssVariables } from './theme';
export type {
  Theme,
  ThemeColors,
  ThemeSpacing,
  ThemeBreakpoints,
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

// Export brand components (re-export from @mahardika/ui)
export { BrandButton, BrandCard } from '@mah/ui';
export type { BrandButtonProps, BrandCardProps } from '@mah/ui';

// Export demo component
export { MahardikaDemo } from './demo';
