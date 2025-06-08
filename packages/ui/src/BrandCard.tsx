import React from 'react';
import { colors } from './colors';

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
    borderRadius: '0.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Enhanced size variants for brand cards
  const sizeStyles = {
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
  };

  // Elevation styles
  const elevationStyles = {
    low: {
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    medium: {
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    high: {
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
      background: `linear-gradient(135deg, ${colors.navy} 0%, #1a2332 100%)`,
      border: `1px solid ${colors.navy}`,
      color: colors.white,
      boxShadow: '0 8px 32px 0 rgba(13, 27, 42, 0.37)',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 40px 0 rgba(13, 27, 42, 0.45)',
      },
      ...patternStyles[pattern || 'none'],
    },
    'gold-primary': {
      background: `linear-gradient(135deg, ${colors.gold} 0%, #FFD23F 100%)`,
      border: `1px solid ${colors.gold}`,
      color: colors.navy,
      boxShadow: '0 8px 32px 0 rgba(244, 180, 0, 0.37)',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 40px 0 rgba(244, 180, 0, 0.45)',
      },
      ...patternStyles[pattern || 'none'],
    },
    'navy-outline': {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.navy}`,
      color: colors.navy,
      backdropFilter: 'blur(8px)',
      ':hover': {
        backgroundColor: 'rgba(13, 27, 42, 0.05)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px 0 rgba(13, 27, 42, 0.15)',
      },
    },
    'gold-outline': {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.gold}`,
      color: colors.gold,
      backdropFilter: 'blur(8px)',
      ':hover': {
        backgroundColor: 'rgba(244, 180, 0, 0.05)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px 0 rgba(244, 180, 0, 0.15)',
      },
    },
    gradient: {
      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 50%, ${colors.navy} 100%)`,
      border: 'none',
      color: colors.white,
      backgroundSize: '200% 200%',
      animation: 'gradientShift 6s ease infinite',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 40px 0 rgba(13, 27, 42, 0.4)',
      },
      ...patternStyles[pattern || 'none'],
    },
    'navy-glass': {
      background: 'rgba(13, 27, 42, 0.85)',
      border: `1px solid rgba(13, 27, 42, 0.2)`,
      color: colors.white,
      backdropFilter: 'blur(16px) saturate(180%)',
      ':hover': {
        background: 'rgba(13, 27, 42, 0.9)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px 0 rgba(13, 27, 42, 0.3)',
      },
    },
    'gold-glass': {
      background: 'rgba(244, 180, 0, 0.85)',
      border: `1px solid rgba(244, 180, 0, 0.2)`,
      color: colors.navy,
      backdropFilter: 'blur(16px) saturate(180%)',
      ':hover': {
        background: 'rgba(244, 180, 0, 0.9)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px 0 rgba(244, 180, 0, 0.3)',
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
    margin: '0 0 0.75rem 0',
    fontWeight: '700',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    letterSpacing: '-0.025em',
  };

  const variantStyles = {
    'navy-primary': { color: colors.gold },
    'gold-primary': { color: colors.navy },
    'navy-outline': { color: colors.navy },
    'gold-outline': { color: colors.gold },
    gradient: { color: colors.white, textShadow: '0 2px 4px rgba(0,0,0,0.3)' },
    'navy-glass': { color: colors.gold },
    'gold-glass': { color: colors.navy },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant || 'navy-primary'],
  };
};

const getBrandSubtitleStyles = (variant: BrandCardProps['variant']) => {
  const baseStyles = {
    margin: '0 0 1.5rem 0',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    opacity: 0.9,
  };

  const variantStyles = {
    'navy-primary': { color: colors.white },
    'gold-primary': { color: colors.navy },
    'navy-outline': { color: colors.gray[600] },
    'gold-outline': { color: colors.gray[600] },
    gradient: { color: colors.white, textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
    'navy-glass': { color: colors.white },
    'gold-glass': { color: colors.navy },
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
