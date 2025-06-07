import React from 'react';
import { colors } from './colors';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
}

const getButtonStyles = (variant: ButtonProps['variant'], size: ButtonProps['size'], disabled: boolean) => {
  const baseStyles = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '600',
    borderRadius: '0.5rem', // 0.5rem as specified in requirements
    border: '2px solid',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
  };

  // Size variants
  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    md: {
      padding: '0.75rem 1.5rem', 
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem', 
      lineHeight: '1.75rem',
    },
  };

  // Variant styles using Mahardika colors
  const variantStyles = {
    primary: {
      backgroundColor: colors.navy,
      borderColor: colors.navy,
      color: colors.white,
      ':hover': !disabled ? {
        backgroundColor: colors.gray[800],
        borderColor: colors.gray[800],
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(13, 27, 42, 0.2)',
      } : {},
    },
    secondary: {
      backgroundColor: colors.gold,
      borderColor: colors.gold,
      color: colors.navy,
      ':hover': !disabled ? {
        backgroundColor: '#E6A200',
        borderColor: '#E6A200', 
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(244, 180, 0, 0.2)',
      } : {},
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.navy,
      color: colors.navy,
      ':hover': !disabled ? {
        backgroundColor: colors.navy,
        color: colors.white,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(13, 27, 42, 0.2)',
      } : {},
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size || 'md'],
    ...variantStyles[variant || 'primary'],
  };
};

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md', 
  children,
  disabled = false,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const buttonStyles = getButtonStyles(variant, size, disabled);
  const hoverStyles = isHovered && !disabled ? buttonStyles[':hover'] : {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  return (
    <button
      style={{
        ...buttonStyles,
        ...hoverStyles,
        ...style,
      }}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}; 