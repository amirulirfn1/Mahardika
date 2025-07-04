'use client';

import React from 'react';
import { Button, ButtonProps } from './Button';

export interface BrandButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'navy' | 'gold' | 'navy-outline' | 'gold-outline';
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'navy',
  style,
  ...props
}) => {
  // Map brand variants to Button variants
  const mappedVariant =
    variant === 'navy'
      ? 'navy'
      : variant === 'gold'
        ? 'gold'
        : variant === 'navy-outline'
          ? 'outline-navy'
          : variant === 'gold-outline'
            ? 'outline-gold'
            : 'navy';

  // Additional brand-specific styles for backward compatibility
  const brandStyle = {
    ...style,
  };

  return <Button variant={mappedVariant} style={brandStyle} {...props} />;
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
