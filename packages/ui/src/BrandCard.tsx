'use client';

import React from 'react';
import { Card, CardProps } from './Card';

export interface BrandCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'navy-primary' | 'gold-primary' | 'navy-outline' | 'gold-outline';
}

export const BrandCard: React.FC<BrandCardProps> = ({
  variant = 'navy-primary',
  style,
  ...props
}) => {
  // Additional brand-specific styles
  const brandStyle = {
    // Add any brand-specific overrides here if needed
    ...style,
  };

  return <Card variant={variant} style={brandStyle} {...props} />;
};

// Template variations for common use cases
export const BrandCardTemplates = {
  NavyHero: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="navy-primary" size="lg" {...props} />
  ),
  GoldFeature: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="gold-primary" size="lg" {...props} />
  ),
  NavyOutlineInfo: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="navy-outline" size="md" {...props} />
  ),
  GoldOutlineAccent: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="gold-outline" size="md" {...props} />
  ),
};
