import React from 'react';
import { colors } from './colors';

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'navy' | 'gold' | 'outline-navy' | 'outline-gold' | 'gradient';
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
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: '2px solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Size variants with enhanced spacing for brand components
  const sizeStyles = {
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
  };

  // Enhanced variant styles with Mahardika brand identity
  const variantStyles = {
    navy: {
      backgroundColor: colors.navy,
      borderColor: colors.navy,
      color: colors.white,
      boxShadow: '0 4px 14px 0 rgba(13, 27, 42, 0.39)',
      ':hover': !disabled
        ? {
            backgroundColor: '#1a2332',
            borderColor: '#1a2332',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(13, 27, 42, 0.5)',
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            boxShadow: '0 2px 8px 0 rgba(13, 27, 42, 0.4)',
          }
        : {},
    },
    gold: {
      backgroundColor: colors.gold,
      borderColor: colors.gold,
      color: colors.navy,
      boxShadow: '0 4px 14px 0 rgba(244, 180, 0, 0.39)',
      ':hover': !disabled
        ? {
            backgroundColor: '#FFD23F',
            borderColor: '#FFD23F',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(244, 180, 0, 0.5)',
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            boxShadow: '0 2px 8px 0 rgba(244, 180, 0, 0.4)',
          }
        : {},
    },
    'outline-navy': {
      backgroundColor: 'transparent',
      borderColor: colors.navy,
      color: colors.navy,
      ':hover': !disabled
        ? {
            backgroundColor: colors.navy,
            color: colors.white,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(13, 27, 42, 0.3)',
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            backgroundColor: '#1a2332',
          }
        : {},
    },
    'outline-gold': {
      backgroundColor: 'transparent',
      borderColor: colors.gold,
      color: colors.gold,
      ':hover': !disabled
        ? {
            backgroundColor: colors.gold,
            color: colors.navy,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(244, 180, 0, 0.3)',
          }
        : {},
      ':active': !disabled
        ? {
            transform: 'translateY(0px)',
            backgroundColor: '#E6A200',
          }
        : {},
    },
    gradient: {
      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 100%)`,
      borderColor: 'transparent',
      color: colors.white,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      ':before': {
        content: '""',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.navy} 100%)`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        zIndex: 1,
      },
      ':hover': !disabled
        ? {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px 0 rgba(13, 27, 42, 0.4)',
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

  return {
    ...baseStyles,
    ...sizeStyles[size || 'md'],
    ...variantStyles[variant || 'navy'],
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
      variant="outline-navy"
      prompt="Outlined button with navy border"
      {...props}
    />
  ),
  GoldOutline: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton
      variant="outline-gold"
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
