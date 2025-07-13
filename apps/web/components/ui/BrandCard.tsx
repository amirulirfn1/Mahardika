'use client';
import { colors } from '@mahardika/ui';

import React from 'react';
import { theme } from './theme';

export interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'navy-primary'
    | 'gold-primary'
    | 'navy-outline'
    | 'gold-outline'
    | 'gradient'
    | 'navy-glass'
    | 'gold-glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  prompt?: string;
  elevation?: 'low' | 'medium' | 'high';
  pattern?: 'none' | 'dots' | 'grid' | 'diagonal';
}

const getBrandCardStyles = (
  variant: BrandCardProps['variant'],
  size: BrandCardProps['size'],
  elevation: BrandCardProps['elevation'],
  pattern: BrandCardProps['pattern']
) => {
  const baseStyles = {
    borderRadius: theme.borderRadius.lg,
    transition: theme.transitions.brand,
    fontFamily: theme.typography.fontFamily.primary,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Enhanced size variants for brand cards
  const sizeStyles = theme.components.card.sizes;

  // Elevation styles
  const elevationStyles = {
    low: {
      boxShadow: theme.shadows.sm,
    },
    medium: {
      boxShadow: theme.shadows.md,
    },
    high: {
      boxShadow: theme.shadows.xl,
    },
  };

  // Pattern styles
  const patternStyles = {
    none: {},
    dots: {
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    },
    grid: {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
    diagonal: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,0.05) 10px,
        rgba(255,255,255,0.05) 20px
      )`,
    },
  };

  // Enhanced variant styles with Mahardika brand identity
  const variantStyles = {
    'navy-primary': {
      background: theme.colors.gradients.primary,
      border: `1px solid ${theme.colors.navy}`,
      color: theme.colors.white,
      boxShadow: theme.shadows.brand.navy.lg,
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows.brand.navy.xl,
      },
      ...patternStyles[pattern || 'none'],
    },
    'gold-primary': {
      background: theme.colors.gradients.secondary,
      border: `1px solid ${theme.colors.gold}`,
      color: theme.colors.navy,
      boxShadow: theme.shadows.brand.gold.lg,
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows.brand.gold.xl,
      },
      ...patternStyles[pattern || 'none'],
    },
    'navy-outline': {
      backgroundColor: theme.colors.transparent,
      border: `2px solid ${theme.colors.navy}`,
      color: theme.colors.navy,
      backdropFilter: 'blur(8px)',
      ':hover': {
        backgroundColor: theme.colors.hover.navyLight,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.brand.navy.md,
      },
    },
    'gold-outline': {
      backgroundColor: theme.colors.transparent,
      border: `2px solid ${theme.colors.gold}`,
      color: theme.colors.gold,
      backdropFilter: 'blur(8px)',
      ':hover': {
        backgroundColor: theme.colors.hover.goldLight,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.brand.gold.md,
      },
    },
    gradient: {
      background: theme.colors.gradients.animated,
      border: 'none',
      color: theme.colors.white,
      backgroundSize: '200% 200%',
      animation: 'gradientShift 6s ease infinite',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows.brand.navy.xl,
      },
      ...patternStyles[pattern || 'none'],
    },
    'navy-glass': {
      background: theme.colors.background.glass.navy,
      border: `1px solid rgba(13, 27, 42, 0.2)`,
      color: theme.colors.white,
      backdropFilter: 'blur(16px) saturate(180%)',
      ':hover': {
        background: 'rgba(13, 27, 42, 0.9)',
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.brand.navy.lg,
      },
    },
    'gold-glass': {
      background: theme.colors.background.glass.gold,
      border: `1px solid rgba(244, 180, 0, 0.2)`,
      color: theme.colors.navy,
      backdropFilter: 'blur(16px) saturate(180%)',
      ':hover': {
        background: 'rgba(244, 180, 0, 0.9)',
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.brand.gold.lg,
      },
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size || 'md'],
    ...elevationStyles[elevation || 'medium'],
    ...variantStyles[variant || 'navy-primary'],
  };
};

const getBrandTitleStyles = (variant: BrandCardProps['variant']) => {
  const baseStyles = {
    margin: `0 0 ${theme.spacing[3]} 0`,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize['2xl'],
    lineHeight: theme.typography.lineHeight.tight,
    letterSpacing: theme.typography.letterSpacing.tight,
  };

  const variantStyles = {
    'navy-primary': { color: theme.colors.gold },
    'gold-primary': { color: theme.colors.navy },
    'navy-outline': { color: theme.colors.navy },
    'gold-outline': { color: theme.colors.gold },
    gradient: {
      color: theme.colors.white,
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    'navy-glass': { color: theme.colors.gold },
    'gold-glass': { color: theme.colors.navy },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant || 'navy-primary'],
  };
};

const getBrandSubtitleStyles = (variant: BrandCardProps['variant']) => {
  const baseStyles = {
    margin: `0 0 ${theme.spacing[6]} 0`,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.normal,
    opacity: 0.9,
  };

  const variantStyles = {
    'navy-primary': { color: theme.colors.white },
    'gold-primary': { color: theme.colors.navy },
    'navy-outline': { color: theme.colors.gray[600] },
    'gold-outline': { color: theme.colors.gray[600] },
    gradient: {
      color: theme.colors.white,
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    'navy-glass': { color: theme.colors.white },
    'gold-glass': { color: theme.colors.navy },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant || 'navy-primary'],
  };
};

export const BrandCard: React.FC<BrandCardProps> = ({
  variant = 'navy-primary',
  size = 'md',
  children,
  title,
  subtitle,
  icon,
  prompt,
  elevation = 'medium',
  pattern = 'none',
  style,
  onMouseEnter,
  onMouseLeave,
  title: htmlTitle,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyles = getBrandCardStyles(variant, size, elevation, pattern);
  const hoverStyles = isHovered ? cardStyles[':hover'] : {};
  const titleStyles = getBrandTitleStyles(variant);
  const subtitleStyles = getBrandSubtitleStyles(variant);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const cardTitle =
    htmlTitle ||
    prompt ||
    (title ? `Mahardika Brand Card: ${title}` : 'Mahardika Brand Card');

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div
        style={{
          ...cardStyles,
          ...hoverStyles,
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={cardTitle}
        {...props}
      >
        {/* Header with icon and title */}
        {(icon || title) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            {icon && (
              <div
                style={{
                  marginRight: '1rem',
                  fontSize: '1.5rem',
                  opacity: 0.9,
                }}
              >
                {icon}
              </div>
            )}
            <div style={{ flex: 1 }}>
              {title && <h3 style={titleStyles}>{title}</h3>}
              {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    </>
  );
};

// Prompt template variations for common use cases
export const BrandCardTemplates = {
  NavyHero: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-primary"
      size="xl"
      elevation="high"
      pattern="dots"
      prompt="Hero section card with navy background and gold accents"
      {...props}
    />
  ),
  GoldFeature: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-primary"
      size="lg"
      elevation="medium"
      prompt="Feature highlight card with gold background"
      {...props}
    />
  ),
  NavyOutlineInfo: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-outline"
      size="md"
      elevation="low"
      prompt="Information card with navy outline"
      {...props}
    />
  ),
  GoldOutlineAccent: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-outline"
      size="md"
      elevation="low"
      prompt="Accent card with gold outline"
      {...props}
    />
  ),
  GradientShowcase: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gradient"
      size="lg"
      elevation="high"
      pattern="grid"
      prompt="Showcase card with animated navy-gold gradient"
      {...props}
    />
  ),
  NavyGlassModal: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-glass"
      size="md"
      elevation="high"
      prompt="Glass morphism card with navy background"
      {...props}
    />
  ),
  GoldGlassHighlight: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-glass"
      size="md"
      elevation="high"
      prompt="Glass morphism card with gold background"
      {...props}
    />
  ),
};
