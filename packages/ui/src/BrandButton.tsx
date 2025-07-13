'use client';

import React from 'react';
import { colors } from './colors';

export type BrandButtonProps = {
  variant?: 'navy' | string;
  as?: 'button' | 'a';
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
};

export const BrandButton = ({ variant = 'navy', as = 'button', size = 'md', fullWidth = false, style, className = '', ...props }: BrandButtonProps) => {
  const mappedVariant = variant === 'navy' ? 'primary' : variant; // adjust as needed
  const brandStyle = { backgroundColor: colors.navy, color: 'white', ...style }; // adjust
  let classes = `btn btn-${mappedVariant} btn-${size} ${className}`;
  if (fullWidth) classes += ' w-100';
  const Component = as;
  return (
    <Component className={classes} style={brandStyle} {...props} />
  );
};

// Template variations for common use cases
export const BrandButtonTemplates = {
  NavyPrimary: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton variant="navy" {...props} />
  ),
  GoldSecondary: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton variant="gold" {...props} />
  ),
  NavyOutline: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton variant="navy-outline" {...props} />
  ),
  GoldOutline: (props: Omit<BrandButtonProps, 'variant'>) => (
    <BrandButton variant="gold-outline" {...props} />
  ),
};
