'use client';

import React from 'react';
import { theme } from './theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
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

  // Interactive states with proper typing
  const hoverStyles =
    isHovered && hoverable ? variantStyles[':hover'] || {} : {};

  // Computed styles
  const computedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...hoverStyles,
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
      default: { color: theme.colors.text.primary },
      elevated: { color: theme.colors.text.primary },
      outlined: { color: theme.colors.text.primary },
      glass: { color: theme.colors.text.primary },
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
      fontWeight: theme.typography.fontWeight.regular,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.normal,
    };

    const variantSubtitleStyles = {
      default: { color: theme.colors.text.tertiary },
      elevated: { color: theme.colors.text.tertiary },
      outlined: { color: theme.colors.text.tertiary },
      glass: { color: theme.colors.text.secondary },
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
