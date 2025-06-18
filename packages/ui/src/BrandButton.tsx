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
  // Map legacy brand variants to new modern variants
  const mappedVariant = 
    variant === 'navy' ? 'primary' :
    variant === 'gold' ? 'secondary' :
    variant === 'navy-outline' ? 'outline' :
    variant === 'gold-outline' ? 'ghost' : 'primary';

  // Additional brand-specific styles for backward compatibility
  const brandStyle = {
    ...style,
  };

  return (
    <Button
      variant={mappedVariant}
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
      variant=\"gold-outline\"
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
