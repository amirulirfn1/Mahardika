'use client';

import React from 'react';
import { theme } from './theme';
import { colors } from './colors';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'navy' | 'gold' | 'outline-navy' | 'outline-gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'navy',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Base styles from theme
  const baseStyles = theme.components.button.base;
  const sizeStyles = theme.components.button.sizes[size];
  const variantStyles = theme.components.button.variants[variant];

  // Hover styles based on variant
  const getHoverStyles = () => {
    if (!isHovered || disabled || loading) return {};
    
    const hoverEffects = {
      navy: {
        backgroundColor: colors.hover.navy,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(13, 27, 42, 0.15)',
      },
      gold: {
        backgroundColor: colors.hover.gold,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(244, 180, 0, 0.15)',
      },
      'outline-navy': {
        backgroundColor: colors.hover.overlay,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(13, 27, 42, 0.1)',
      },
      'outline-gold': {
        backgroundColor: 'rgba(244, 180, 0, 0.1)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(244, 180, 0, 0.1)',
      },
    };
    
    return hoverEffects[variant] || {};
  };

  // Computed styles
  const computedStyles = {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
    ...getHoverStyles(),
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    gap: leftIcon || rightIcon ? '0.5rem' : '0',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    onBlur?.(e);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="60"
        style={{
          animation: 'spin 1.5s ease-in-out infinite',
        }}
      />
    </svg>
  );

  return (
    <button
      style={computedStyles}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {leftIcon}
        </span>
      )}
      <span style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
      {!loading && rightIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};
