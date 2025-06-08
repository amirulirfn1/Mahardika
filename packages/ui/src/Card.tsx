'use client';

import React from 'react';
import { colors } from './colors';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'branded' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const getCardStyles = (
  variant: CardProps['variant'],
  size: CardProps['size']
) => {
  const baseStyles = {
    borderRadius: '0.5rem', // 0.5rem as specified in requirements
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // Size variants
  const sizeStyles = {
    sm: {
      padding: '1rem',
    },
    md: {
      padding: '1.5rem',
    },
    lg: {
      padding: '2rem',
    },
  };

  // Variant styles using Mahardika colors
  const variantStyles = {
    default: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.border.light}`,
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      ':hover': {
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'translateY(-1px)',
      },
    },
    branded: {
      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
      border: `1px solid ${colors.navy}`,
      color: colors.white,
      boxShadow:
        '0 4px 6px -1px rgba(13, 27, 42, 0.2), 0 2px 4px -1px rgba(13, 27, 42, 0.1)',
      ':hover': {
        boxShadow:
          '0 10px 15px -3px rgba(13, 27, 42, 0.3), 0 4px 6px -2px rgba(13, 27, 42, 0.2)',
        transform: 'translateY(-2px)',
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.navy}`,
      color: colors.navy,
      ':hover': {
        backgroundColor: colors.background.neutral,
        boxShadow:
          '0 4px 6px -1px rgba(13, 27, 42, 0.1), 0 2px 4px -1px rgba(13, 27, 42, 0.06)',
        transform: 'translateY(-1px)',
      },
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size || 'md'],
    ...variantStyles[variant || 'default'],
  };
};

const getTitleStyles = (variant: CardProps['variant']) => {
  const baseStyles = {
    margin: '0 0 0.5rem 0',
    fontWeight: '600',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  };

  const variantStyles = {
    default: {
      color: colors.text.primary,
    },
    branded: {
      color: colors.gold,
    },
    outlined: {
      color: colors.navy,
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant || 'default'],
  };
};

const getSubtitleStyles = (variant: CardProps['variant']) => {
  const baseStyles = {
    margin: '0 0 1rem 0',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  };

  const variantStyles = {
    default: {
      color: colors.text.secondary,
    },
    branded: {
      color: colors.gray[300],
    },
    outlined: {
      color: colors.text.secondary,
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant || 'default'],
  };
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  children,
  title,
  subtitle,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyles = getCardStyles(variant, size);
  const hoverStyles = isHovered ? cardStyles[':hover'] : {};
  const titleStyles = getTitleStyles(variant);
  const subtitleStyles = getSubtitleStyles(variant);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  return (
    <div
      style={{
        ...cardStyles,
        ...hoverStyles,
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {title && <h3 style={titleStyles}>{title}</h3>}
      {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
};
