'use client';

import React from 'react';
import { Button, ButtonProps } from './Button';
import { theme } from './theme';

export interface BrandButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'navy' | 'gold' | 'navy-outline' | 'gold-outline';
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'navy',
  style,
  ...props
}) => {
  // Map legacy brand variants to new variants
  const mappedVariant = 
    variant === 'navy' || variant === 'navy-outline' ? 'primary' :
    variant === 'gold' || variant === 'gold-outline' ? 'secondary' : 'primary';

  const isOutline = variant.includes('outline');
  const actualVariant = isOutline ? 'outline' : mappedVariant;

  // Additional brand-specific styles
  const brandStyle = {
    ...style,
  };

  return (
    <Button
      variant={actualVariant}
      style={brandStyle}
      {...props}
    />
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
