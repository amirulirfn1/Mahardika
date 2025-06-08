import React from 'react';
import { BrandButton } from './BrandButton';
import { BrandCard } from './BrandCard';
import { theme } from './theme';

export const MahardikaDemo: React.FC = () => {
  return (
    <div
      style={{
        padding: theme.spacing[8],
        backgroundColor: theme.colors.background.neutral,
        fontFamily: theme.typography.fontFamily.primary,
        minHeight: '100vh',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: theme.spacing[12] }}>
        <h1
          style={{
            fontSize: theme.typography.fontSize['4xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.navy,
            marginBottom: theme.spacing[4],
          }}
        >
          Mahardika Brand Components
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.text.secondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          BrandButton and BrandCard components with Navy {theme.colors.navy} and
          Gold {theme.colors.gold}
        </p>
      </div>

      <BrandCard
        variant="navy-outline"
        size="lg"
        title="🎯 BrandButton Variants"
        subtitle="Interactive buttons with Mahardika brand styling"
        style={{ marginBottom: theme.spacing[8] }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing[4],
          }}
        >
          <BrandButton variant="navy" size="md">
            Navy Primary
          </BrandButton>
          <BrandButton variant="gold" size="md">
            Gold Primary
          </BrandButton>
          <BrandButton variant="outline-navy" size="md">
            Navy Outline
          </BrandButton>
          <BrandButton variant="outline-gold" size="md">
            Gold Outline
          </BrandButton>
          <BrandButton variant="gradient" size="md">
            Gradient
          </BrandButton>
        </div>
      </BrandCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: theme.spacing[6],
        }}
      >
        <BrandCard
          variant="navy-primary"
          size="md"
          title="Navy Primary"
          subtitle="Primary brand card"
          icon="🛡️"
        >
          <p
            style={{
              color: theme.colors.white,
              marginBottom: theme.spacing[4],
            }}
          >
            Navy background with gold accents
          </p>
          <BrandButton variant="gold" size="sm">
            Learn More
          </BrandButton>
        </BrandCard>

        <BrandCard
          variant="gold-primary"
          size="md"
          title="Gold Primary"
          subtitle="Secondary brand card"
          icon="⭐"
        >
          <p
            style={{ color: theme.colors.navy, marginBottom: theme.spacing[4] }}
          >
            Gold background with navy text
          </p>
          <BrandButton variant="navy" size="sm">
            Get Started
          </BrandButton>
        </BrandCard>

        <BrandCard
          variant="gradient"
          size="md"
          title="Gradient Card"
          subtitle="Animated gradient"
          icon="🌟"
        >
          <p
            style={{
              color: theme.colors.white,
              marginBottom: theme.spacing[4],
            }}
          >
            Dynamic brand gradient animation
          </p>
          <BrandButton variant="outline-gold" size="sm">
            Explore
          </BrandButton>
        </BrandCard>
      </div>
    </div>
  );
};

export default MahardikaDemo;
