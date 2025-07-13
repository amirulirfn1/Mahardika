'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { colors } from './colors';

export type BrandCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: 'default' | 'navy' | 'gold';
};

export const BrandCard = ({
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}: BrandCardProps) => {
  const brandStyle =
    variant === 'navy'
      ? { backgroundColor: colors.navy, color: 'white' }
      : variant === 'gold'
        ? { backgroundColor: colors.gold, color: colors.navy }
        : {};
  return (
    <div
      className={`card brand-card ${className}`}
      style={{ ...brandStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

// Template variations for common use cases
export const BrandCardTemplates = {
  NavyHero: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="navy" {...props} />
  ),
  GoldFeature: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="gold" {...props} />
  ),
  NavyOutlineInfo: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="navy" {...props} />
  ),
  GoldOutlineAccent: (props: Omit<BrandCardProps, 'variant'>) => (
    <BrandCard variant="gold" {...props} />
  ),
};
