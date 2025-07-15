'use client';

import React from 'react';
import { theme } from './theme';

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'navy'
    | 'gold'
    | 'navy-outline'
    | 'gold-outline'
    | 'outline-navy'
    | 'outline-gold'
    | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  prompt?: string;
}

const getBrandButtonStyles = (
  variant: BrandButtonProps['variant'],
  size: BrandButtonProps['size'],
  disabled: boolean
) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    borderRadius: theme.borderRadius.lg,
    border: '2px solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.brand,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Size variants with enhanced spacing for brand components
  const sizeStyles = theme.components.button.sizes;

  // Map new variant names to legacy names for backward compatibility
  let mappedVariant;
  switch (variant) {
    case 'navy-outline':
      mappedVariant = 'outline-navy';
      break;
    case 'gold-outline':
      mappedVariant = 'outline-gold';
      break;
    default:
      mappedVariant = variant;
  }

  // Enhanced variant styles with Mahardika brand identity
  const variantStyles = {
    navy: {
      backgroundColor: theme.colors.navy,
      borderColor: theme.colors.navy,
      color: theme.colors.white,
      boxShadow: theme.shadows.brand.navy.sm,
      ':hover': !disabled
        ? {
            backgroundColor: theme.colors.hover.navy,
            borderColor: theme.colors.hover.navy,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.brand.navy.md,
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            boxShadow: theme.shadows.brand.navy.sm,
          }
        : {},
    },
    gold: {
      backgroundColor: theme.colors.gold,
      borderColor: theme.colors.gold,
      color: theme.colors.navy,
      boxShadow: theme.shadows.brand.gold.sm,
      ':hover': !disabled
        ? {
            backgroundColor: theme.colors.hover.gold,
            borderColor: theme.colors.hover.gold,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.brand.gold.md,
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            boxShadow: theme.shadows.brand.gold.sm,
          }
        : {},
    },
    'outline-navy': {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.navy,
      color: theme.colors.navy,
      ':hover': !disabled
        ? {
            backgroundColor: theme.colors.navy,
            color: theme.colors.white,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.brand.navy.md,
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            backgroundColor: theme.colors.hover.navy,
          }
        : {},
    },
    'outline-gold': {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.gold,
      color: theme.colors.gold,
      ':hover': !disabled
        ? {
            backgroundColor: theme.colors.gold,
            color: theme.colors.navy,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.brand.gold.md,
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            backgroundColor: theme.colors.active.gold,
          }
        : {},
    },
    gradient: {
      background: theme.colors.gradients.brand,
      borderColor: theme.colors.transparent,
      color: theme.colors.white,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      ':before': {
        content: '""',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.colors.gradients.brandReverse,
        opacity: 0,
        transition: theme.transitions.opacity,
        zIndex: 1,
      },
      ':hover': !disabled
        ? {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.brand.navy.xl,
            ':before': {
              opacity: 1,
            },
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
          }
        : {},
    },
  };

  const safeVariant = (mappedVariant || 'navy') as keyof typeof variantStyles;
  return {
    ...baseStyles,
    ...sizeStyles[size || 'md'],
    ...variantStyles[safeVariant],
  };
};

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'navy',
  size = 'md',
  children,
  disabled = false,
  icon,
  prompt,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  title,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const buttonStyles = getBrandButtonStyles(variant, size, disabled);
  const hoverStyles = isHovered && !disabled ? buttonStyles[':hover'] : {};
  const activeStyles = isActive && !disabled ? buttonStyles[':active'] : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    setIsActive(false);
    onMouseLeave?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive(true);
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive(false);
    onMouseUp?.(e);
  };

  const buttonTitle =
    title ||
    prompt ||
    (typeof children === 'string' ? children : 'Mahardika Brand Button');

  return (
    <button
      style={{
        ...buttonStyles,
        ...hoverStyles,
        ...activeStyles,
        ...style,
      }}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      title={buttonTitle}
      {...props}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </button>
  );
};

// Prompt template variations for common use cases
export const BrandButtonTemplates = {
  NavyPrimary: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="navy"
      prompt="Primary action button in Mahardika navy"
      {...props}
    />
  ),
  GoldSecondary: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="gold"
      prompt="Secondary action button in Mahardika gold"
      {...props}
    />
  ),
  NavyOutline: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="navy-outline"
      prompt="Outlined button with navy border"
      {...props}
    />
  ),
  GoldOutline: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="gold-outline"
      prompt="Outlined button with gold border"
      {...props}
    />
  ),
  GradientFeature: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="gradient"
      prompt="Feature button with navy-to-gold gradient"
      {...props}
    />
  ),
};
