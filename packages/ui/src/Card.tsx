'use client';

import React from 'react';
import { theme } from './theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'navy-primary' | 'gold-primary' | 'navy-outline' | 'gold-outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'navy-outline',
  size = 'md',
  children,
  title,
  subtitle,
  header,
  footer,
  padding = true,
  hoverable = true,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Base styles from theme
  const baseStyles = theme.components.card.base;
  const sizeStyles = padding
    ? theme.components.card.sizes[size]
    : { padding: '0' };
  const variantStyles = theme.components.card.variants[variant];

  // Hover styles based on variant
  const getHoverStyles = () => {
    if (!isHovered || !hoverable) return {};

    const hoverEffects = {
      'navy-primary': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(13, 27, 42, 0.15)',
      },
      'gold-primary': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(244, 180, 0, 0.15)',
      },
      'navy-outline': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(13, 27, 42, 0.1)',
        backgroundColor: 'rgba(13, 27, 42, 0.02)',
      },
      'gold-outline': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(244, 180, 0, 0.1)',
        backgroundColor: 'rgba(244, 180, 0, 0.02)',
      },
    };

    return (
      hoverEffects[variant] || {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      }
    );
  };

  // Computed styles
  const computedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...getHoverStyles(),
    padding: sizeStyles.padding || '0',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  // Title styles based on variant
  const getTitleStyles = () => {
    const baseTitle = {
      margin: '0 0 0.5rem 0',
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize['xl'],
      lineHeight: theme.typography.lineHeight.tight,
    };

    const variantTitleStyles = {
      'navy-primary': { color: theme.colors.text.primary },
      'gold-primary': { color: theme.colors.text.primary },
      'navy-outline': { color: theme.colors.text.primary },
      'gold-outline': { color: theme.colors.text.primary },
    };

    return {
      ...baseTitle,
      ...variantTitleStyles[variant],
    };
  };

  // Subtitle styles based on variant
  const getSubtitleStyles = () => {
    const baseSubtitle = {
      margin: '0 0 1.5rem 0',
      fontFamily: theme.typography.fontFamily.body,
      fontWeight: theme.typography.fontWeight.normal,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.normal,
    };

    const variantSubtitleStyles = {
      'navy-primary': { color: theme.colors.text.tertiary },
      'gold-primary': { color: theme.colors.text.tertiary },
      'navy-outline': { color: theme.colors.text.tertiary },
      'gold-outline': { color: theme.colors.text.secondary },
    };

    return {
      ...baseSubtitle,
      ...variantSubtitleStyles[variant],
    };
  };

  // Header styles
  const headerStyles = {
    marginBottom: padding ? theme.spacing[4] : '0',
    paddingBottom: header && padding ? theme.spacing[4] : '0',
    borderBottom:
      header && padding ? `1px solid ${theme.colors.border.light}` : 'none',
  };

  // Footer styles
  const footerStyles = {
    marginTop: padding ? theme.spacing[4] : '0',
    paddingTop: footer && padding ? theme.spacing[4] : '0',
    borderTop:
      footer && padding ? `1px solid ${theme.colors.border.light}` : 'none',
  };

  return (
    <div
      style={computedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {/* Header Section */}
      {header && <div style={headerStyles}>{header}</div>}

      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div style={{ marginBottom: padding ? theme.spacing[4] : '0' }}>
          {title && <h3 style={getTitleStyles()}>{title}</h3>}
          {subtitle && <p style={getSubtitleStyles()}>{subtitle}</p>}
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: '1' }}>{children}</div>

      {/* Footer Section */}
      {footer && <div style={footerStyles}>{footer}</div>}
    </div>
  );
};
