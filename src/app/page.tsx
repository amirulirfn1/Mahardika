'use client';

import React from 'react';
import { Button, Card } from '@mahardika/ui';
import { theme } from '@mahardika/ui/theme';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Hero Section */}
      <section 
        style={{
          padding: `${theme.spacing[20]} ${theme.spacing[4]} ${theme.spacing[16]}`,
          background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)`,
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: theme.typography.fontWeight.bold,
                  fontFamily: theme.typography.fontFamily.heading,
                  color: theme.colors.text.primary,
                  lineHeight: theme.typography.lineHeight.tight,
                  marginBottom: theme.spacing[6],
                  letterSpacing: theme.typography.letterSpacing.tighter,
                }}
              >
                Find the perfect{' '}
                <span 
                  style={{
                    background: theme.colors.background.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  solution
                </span>{' '}
                for your business
              </h1>
              
              <p 
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing[8],
                  fontWeight: theme.typography.fontWeight.regular,
                }}
              >
                Connect with top-rated professionals and agencies. Get your projects done with confidence and quality.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-4 mb-8">
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = '/shop'}
                  style={{ minWidth: '200px' }}
                >
                  Browse Services
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/agencies'}
                  style={{ minWidth: '200px' }}
                >
                  Become a Seller
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="d-flex flex-wrap align-items-center gap-6">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.success,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
                      Trusted
                    </div>
                    <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary }}>
                      by thousands
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
                      Fast
                    </div>
                    <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary }}>
                      delivery
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                    }}
                  >
                    ★
                  </div>
                  <div>
                    <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
                      Quality
                    </div>
                    <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary }}>
                      guaranteed
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-8 mt-lg-0">
              <div 
                style={{
                  position: 'relative',
                  borderRadius: theme.borderRadius['2xl'],
                  overflow: 'hidden',
                  boxShadow: theme.colors.shadow.xl,
                }}
              >
                <div 
                  style={{
                    background: theme.colors.background.gradient,
                    padding: theme.spacing[8],
                    color: 'white',
                    textAlign: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: theme.spacing[4] }}>🚀</div>
                  <h3 style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing[2] }}>
                    Launch Your Project
                  </h3>
                  <p style={{ fontSize: theme.typography.fontSize.base, opacity: 0.9 }}>
                    Join thousands of satisfied clients who found their perfect match
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 
              style={{
                fontSize: theme.typography.fontSize['4xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}
            >
              Popular Services
            </h2>
            <p 
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Browse our most in-demand professional services
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: '💼',
                title: 'Business Consulting',
                description: 'Strategic advice to grow your business',
                price: 'Starting at $99',
                category: 'Business',
                popular: true,
              },
              {
                icon: '🎨',
                title: 'Graphic Design',
                description: 'Creative designs for your brand',
                price: 'Starting at $49',
                category: 'Design',
                popular: false,
              },
              {
                icon: '💻',
                title: 'Web Development',
                description: 'Custom websites and applications',
                price: 'Starting at $199',
                category: 'Technology',
                popular: true,
              },
              {
                icon: '📱',
                title: 'Mobile Apps',
                description: 'iOS and Android applications',
                price: 'Starting at $299',
                category: 'Technology',
                popular: false,
              },
              {
                icon: '📈',
                title: 'Digital Marketing',
                description: 'Grow your online presence',
                price: 'Starting at $79',
                category: 'Marketing',
                popular: true,
              },
              {
                icon: '✍️',
                title: 'Content Writing',
                description: 'Engaging content for your audience',
                price: 'Starting at $29',
                category: 'Writing',
                popular: false,
              },
            ].map((service, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <Card
                  variant="default"
                  size="lg"
                  hoverable={true}
                  style={{
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => window.location.href = '/shop'}
                >
                  {service.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: theme.spacing[4],
                        right: theme.spacing[4],
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                        borderRadius: theme.borderRadius.full,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        letterSpacing: theme.typography.letterSpacing.wide,
                      }}
                    >
                      Popular
                    </div>
                  )}
                  <div className="text-center">
                    <div style={{ fontSize: '3rem', marginBottom: theme.spacing[4] }}>
                      {service.icon}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: theme.typography.letterSpacing.wide,
                        marginBottom: theme.spacing[2],
                      }}
                    >
                      {service.category}
                    </div>
                    <h3 
                      style={{
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing[2],
                      }}
                    >
                      {service.title}
                    </h3>
                    <p 
                      style={{
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.tertiary,
                        lineHeight: theme.typography.lineHeight.relaxed,
                        marginBottom: theme.spacing[4],
                      }}
                    >
                      {service.description}
                    </p>
                    <div 
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {service.price}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/shop'}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        style={{
          padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 
              style={{
                fontSize: theme.typography.fontSize['4xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}
            >
              Why Choose Mahardika?
            </h2>
            <p 
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Everything you need to succeed in one platform
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: '🛡️',
                title: 'Secure Payments',
                description: 'Your money is safe with our secure payment system and buyer protection.',
              },
              {
                icon: '⭐',
                title: 'Top Talent',
                description: 'Work with vetted professionals who deliver exceptional results.',
              },
              {
                icon: '💬',
                title: '24/7 Support',
                description: 'Get help whenever you need it with our responsive customer support.',
              },
              {
                icon: '🚀',
                title: 'Fast Delivery',
                description: 'Get your projects completed quickly with our efficient workflow.',
              },
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.background.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      margin: '0 auto',
                      marginBottom: theme.spacing[4],
                      boxShadow: theme.colors.shadow.md,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 
                    style={{
                      fontSize: theme.typography.fontSize.xl,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text.tertiary,
                      lineHeight: theme.typography.lineHeight.relaxed,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
        <div className="container">
          <Card
            variant="glass"
            size="lg"
            padding={false}
            style={{
              background: theme.colors.background.gradient,
              border: 'none',
              textAlign: 'center',
            }}
          >
            <div style={{ padding: `${theme.spacing[12]} ${theme.spacing[8]}`, color: 'white' }}>
              <h2 
                style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing[4],
                }}
              >
                Ready to get started?
              </h2>
              <p 
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  marginBottom: theme.spacing[8],
                  opacity: 0.9,
                }}
              >
                Join thousands of businesses already using our platform
              </p>
              <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                  style={{ 
                    minWidth: '200px',
                    backgroundColor: 'white',
                    color: theme.colors.primary,
                  }}
                >
                  Get Started Today
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/demo/upload'}
                  style={{ 
                    minWidth: '200px',
                    borderColor: 'white',
                    color: 'white',
                  }}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
