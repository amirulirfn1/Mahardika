'use client';

import React from 'react';
import {
  BrandButton,
  BrandCard,
} from '@mahardika/ui';

export default function BrandShowcasePage() {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#0D1B2A',
            marginBottom: '1rem',
          }}
        >
          Mahardika Brand Components
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          Comprehensive brand component library featuring navy (#0D1B2A) and
          gold (#F4B400) Mahardika colors with prompt template functionality for
          consistent UI development.
        </p>
      </header>

      {/* BrandButton Section */}
      <section style={{ marginBottom: '4rem' }}>
        <BrandCard
          variant="navy-primary"
          size="lg"
          title="BrandButton Components"
          subtitle="Enhanced buttons with Mahardika brand identity"
        >
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {/* Basic Variants */}
            <div>
              <h4 style={{ color: '#F4B400', marginBottom: '1rem' }}>
                Basic Variants
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <BrandButton variant="navy">Navy Primary</BrandButton>
                <BrandButton variant="gold">Gold Secondary</BrandButton>
                <BrandButton variant="navy-outline">Navy Outline</BrandButton>
                <BrandButton variant="gold-outline">Gold Outline</BrandButton>
                <BrandButton variant="navy">Feature Button</BrandButton>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 style={{ color: '#F4B400', marginBottom: '1rem' }}>
                Size Variations
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <BrandButton variant="navy" size="sm">
                  Small Button
                </BrandButton>
                <BrandButton variant="gold" size="md">
                  Medium Button
                </BrandButton>
                <BrandButton variant="navy-outline" size="lg">
                  Large Button
                </BrandButton>
              </div>
            </div>

            {/* Templates */}
            <div>
              <h4 style={{ color: '#F4B400', marginBottom: '1rem' }}>
                Template Components
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <BrandButton variant="navy">
                  Primary Action
                </BrandButton>
                <BrandButton variant="gold">
                  Secondary Action
                </BrandButton>
                <BrandButton variant="navy">
                  Feature Button
                </BrandButton>
              </div>
            </div>
          </div>
        </BrandCard>
      </section>

      {/* BrandCard Section */}
      <section style={{ marginBottom: '4rem' }}>
        <BrandCard
          variant="gold-primary"
          size="lg"
          title="BrandCard Components"
          subtitle="Professional cards with brand consistency"
        >
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            <BrandCard
              variant="navy-primary"
              title="Navy Primary"
              subtitle="Primary brand card"
            >
              <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>
                Perfect for hero sections and primary content areas.
              </p>
              <BrandButton variant="gold" size="sm">
                Learn More
              </BrandButton>
            </BrandCard>

            <BrandCard
              variant="gold-outline"
              title="Gold Outline"
              subtitle="Elegant accent card"
            >
              <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                Sophisticated gold borders for accent content.
              </p>
              <BrandButton variant="gold-outline" size="sm">
                View Details
              </BrandButton>
            </BrandCard>

            <BrandCard
              variant="navy-outline"
              title="Modern Showcase"
              subtitle="Modern outline card"
            >
              <p style={{ margin: '0 0 1.5rem 0', opacity: 0.95 }}>
                Dynamic navy-to-gold gradient with animation effects.
              </p>
              <BrandButton variant="gold" size="sm">
                Discover
              </BrandButton>
            </BrandCard>
          </div>
        </BrandCard>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <BrandButton
            variant="outline-navy"
            size="sm"
            onClick={() => window.history.back()}
          >
            ← Back to Main
          </BrandButton>
        </div>
      </footer>
    </div>
  );
}
