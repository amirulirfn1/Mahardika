'use client';

import React from 'react';
import { Card, CardProps } from './Card';
import { theme } from './theme';

export interface BrandCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'navy-primary' | 'gold-primary' | 'navy-outline' | 'gold-outline';
}

export const BrandCard: React.FC<BrandCardProps> = ({
  variant = 'navy-primary',
  style,
  ...props
}) => {
  // Map legacy brand variants to new variants
  const mappedVariant = 
    variant === 'navy-primary' ? 'elevated' :
    variant === 'gold-primary' ? 'glass' :
    variant === 'navy-outline' || variant === 'gold-outline' ? 'outlined' : 'default';

  // Additional brand-specific styles
  const brandStyle = {
    // Add any brand-specific overrides here if needed
    ...style,
  };

  return (
    <Card
      variant={mappedVariant}
      style={brandStyle}
      {...props}
    />
  );
};

// Prompt template variations for common use cases
export const BrandCardTemplates = {
  NavyHero: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-primary"
      size="xl"
      elevation="high"
      pattern="dots"
      prompt="Hero section card with navy background and gold accents"
      {...props}
    />
  ),
  GoldFeature: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-primary"
      size="lg"
      elevation="medium"
      prompt="Feature highlight card with gold background"
      {...props}
    />
  ),
  NavyOutlineInfo: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-outline"
      size="md"
      elevation="low"
      prompt="Information card with navy outline"
      {...props}
    />
  ),
  GoldOutlineAccent: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-outline"
      size="md"
      elevation="low"
      prompt="Accent card with gold outline"
      {...props}
    />
  ),
  GradientShowcase: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gradient"
      size="lg"
      elevation="high"
      pattern="grid"
      prompt="Showcase card with animated navy-gold gradient"
      {...props}
    />
  ),
  NavyGlassModal: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="navy-glass"
      size="md"
      elevation="high"
      prompt="Glass morphism card with navy background"
      {...props}
    />
  ),
  GoldGlassHighlight: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard
      variant="gold-glass"
      size="md"
      elevation="high"
      prompt="Glass morphism card with gold background"
      {...props}
    />
  ),
};
