'use client';

import React from 'react';
import { Button, Card, AIChat, colors } from '@mahardika/ui';
import { MAHARDIKA_COLORS, APP_CONFIG, FEATURE_FLAGS } from '../lib/env';

export default function HomePage() {
  const [clickCount, setClickCount] = React.useState(0);

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header Section */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem 0',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            background: `linear-gradient(45deg, ${MAHARDIKA_COLORS.gold} 0%, #FFD700 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {APP_CONFIG.name}
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: colors.gray[300],
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          A comprehensive UI component library featuring the official Mahardika
          brand colors. Built with React, TypeScript, and modern design
          principles.
        </p>
      </header>

      {/* Navigation Links */}
      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <Card
          title="Demo Applications"
          subtitle="Explore our sample applications built with Mahardika UI"
          variant="branded"
          size="md"
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              size="lg"
              onClick={() => window.open('/dashboard', '_blank')}
              style={{ minWidth: '200px' }}
            >
              🏢 Insurance Dashboard
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open('/brand-showcase', '_blank')}
              style={{ minWidth: '200px' }}
            >
              ✨ Brand Components
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('/shop', '_blank')}
              style={{ minWidth: '200px' }}
            >
              🛒 Shop
            </Button>
          </div>
        </Card>
      </section>

      {/* Button Showcase */}
      <section style={{ marginBottom: '3rem' }}>
        <Card
          title="Button Components"
          subtitle="Interactive buttons in various styles and sizes"
          variant="branded"
          size="lg"
        >
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {/* Primary Buttons */}
            <div>
              <h4 style={{ color: colors.gold, marginBottom: '1rem' }}>
                Primary Variant
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Button size="sm" onClick={handleButtonClick}>
                  Small Primary
                </Button>
                <Button size="md" onClick={handleButtonClick}>
                  Medium Primary
                </Button>
                <Button size="lg" onClick={handleButtonClick}>
                  Large Primary
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h4 style={{ color: colors.gold, marginBottom: '1rem' }}>
                Secondary Variant
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleButtonClick}
                >
                  Small Secondary
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleButtonClick}
                >
                  Medium Secondary
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleButtonClick}
                >
                  Large Secondary
                </Button>
              </div>
            </div>

            {/* Outline Buttons */}
            <div>
              <h4 style={{ color: colors.gold, marginBottom: '1rem' }}>
                Outline Variant
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Button variant="outline" size="sm" onClick={handleButtonClick}>
                  Small Outline
                </Button>
                <Button variant="outline" size="md" onClick={handleButtonClick}>
                  Medium Outline
                </Button>
                <Button variant="outline" size="lg" onClick={handleButtonClick}>
                  Large Outline
                </Button>
              </div>
            </div>

            {/* Disabled States */}
            <div>
              <h4 style={{ color: colors.gold, marginBottom: '1rem' }}>
                Disabled States
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Button disabled>Disabled Primary</Button>
                <Button variant="secondary" disabled>
                  Disabled Secondary
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </div>

          {/* Click Counter */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: 'rgba(244, 180, 0, 0.1)',
              borderRadius: '0.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: colors.gold }}>
              Buttons clicked: <strong>{clickCount}</strong> times
            </p>
          </div>
        </Card>
      </section>

      {/* Card Showcase */}
      <section style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          }}
        >
          {/* Default Cards */}
          <Card
            title="Default Card"
            subtitle="Clean and simple design"
            variant="default"
            size="md"
          >
            <p style={{ margin: '0 0 1rem 0', color: colors.text.secondary }}>
              This is a default card variant with subtle shadows and clean
              styling. Perfect for content display and information organization.
            </p>
            <Button size="sm">Learn More</Button>
          </Card>

          {/* Branded Cards */}
          <Card
            title="Branded Card"
            subtitle="Mahardika navy & gold styling"
            variant="branded"
            size="md"
          >
            <p style={{ margin: '0 0 1rem 0', color: colors.gray[300] }}>
              This card showcases the official Mahardika brand colors with a
              navy gradient background and gold accents.
            </p>
            <Button variant="secondary" size="sm">
              Get Started
            </Button>
          </Card>

          {/* Outlined Cards */}
          <Card
            title="Outlined Card"
            subtitle="Minimalist border design"
            variant="outlined"
            size="md"
          >
            <p style={{ margin: '0 0 1rem 0', color: colors.text.secondary }}>
              A clean outlined variant with navy borders, perfect for
              highlighting important content or call-to-action sections.
            </p>
            <Button variant="outline" size="sm">
              Explore
            </Button>
          </Card>
        </div>
      </section>

      {/* Different Sizes Showcase */}
      <section style={{ marginBottom: '3rem' }}>
        <Card
          title="Size Variations"
          subtitle="Components available in multiple sizes"
          variant="default"
        >
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            }}
          >
            <Card title="Small Size" size="sm" variant="outlined">
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: colors.text.secondary,
                }}
              >
                Compact size for dense layouts and smaller screens.
              </p>
            </Card>

            <Card title="Medium Size" size="md" variant="outlined">
              <p style={{ margin: 0, color: colors.text.secondary }}>
                Default medium size for balanced layouts and general use cases.
              </p>
            </Card>

            <Card title="Large Size" size="lg" variant="outlined">
              <p
                style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  color: colors.text.secondary,
                }}
              >
                Spacious large size for feature highlights and important content
                sections.
              </p>
            </Card>
          </div>
        </Card>
      </section>

      {/* AI Chat Component */}
      <section style={{ marginBottom: '3rem' }}>
        <Card
          title="AI Assistant"
          subtitle="DeepSeek-powered chat with Mahardika branding"
          variant="branded"
          size="lg"
        >
          <AIChat
            onMessage={(userMessage, aiResponse) => {
              console.log('Chat interaction:', { userMessage, aiResponse });
            }}
          />
        </Card>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '2rem 0',
          borderTop: `1px solid ${colors.gray[700]}`,
          marginTop: '3rem',
        }}
      >
        <p style={{ color: colors.gray[400], margin: 0 }}>
          Built with ❤️ using Mahardika UI Components
        </p>
        <p
          style={{
            color: colors.gray[500],
            margin: '0.5rem 0 0 0',
            fontSize: '0.875rem',
          }}
        >
          Navy #0D1B2A • Gold #F4B400 • React • TypeScript • Next.js
        </p>
      </footer>
    </div>
  );
}
