'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, theme } from '@mahardika/ui';
import { HomeSkeleton } from '@/components/LoadingSkeleton';
import Image from 'next/image';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Hero Section - Fiverr Inspired */}
      <section
        style={{
          padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
          background: `linear-gradient(180deg, ${theme.colors.background.secondary} 0%, ${theme.colors.background.primary} 100%)`,
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
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
                    color: theme.colors.primary,
                  }}
                >
                  freelance
                </span>{' '}
                services for your business
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
                Work with talented professionals and grow your business.
                Millions of people use Mahardika to turn their ideas into
                reality.
              </p>

              {/* Search Bar */}
              <div
                className="d-flex gap-2 mb-8"
                style={{
                  backgroundColor: 'white',
                  padding: theme.spacing[2],
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.colors.shadow.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <input
                  type="text"
                  placeholder="Try 'building mobile app'"
                  className="form-control border-0"
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    padding: theme.spacing[3],
                  }}
                />
                <Button
                  variant="primary"
                  size="lg"
                  style={{ minWidth: '120px' }}
                >
                  Search
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span
                  style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                >
                  Popular:
                </span>
                {[
                  'Website Design',
                  'WordPress',
                  'Logo Design',
                  'AI Services',
                ].map(term => (
                  <a
                    key={term}
                    href={`/shop?search=${encodeURIComponent(term)}`}
                    className="text-decoration-none"
                    style={{
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.sm,
                      padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                      borderRadius: theme.borderRadius.full,
                      border: `1px solid ${theme.colors.border.light}`,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = theme.colors.primary;
                      e.currentTarget.style.color = theme.colors.primary;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor =
                        theme.colors.border.light;
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
            <div className="col-lg-6 mt-8 mt-lg-0">
              <div
                style={{
                  position: 'relative',
                  borderRadius: theme.borderRadius['2xl'],
                  overflow: 'hidden',
                  height: '500px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop') center/cover`,
                    filter: 'brightness(0.95)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: theme.spacing[8],
                    left: theme.spacing[8],
                    right: theme.spacing[8],
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: theme.spacing[4],
                    borderRadius: theme.borderRadius.xl,
                    boxShadow: theme.colors.shadow.xl,
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}
                    >
                      ★
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        Andrea, Fashion Designer
                      </div>
                      <div
                        style={{
                          color: theme.colors.text.secondary,
                          fontSize: theme.typography.fontSize.sm,
                        }}
                      >
                        Completed 50 projects with 5.0 rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
        }}
      >
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-6 col-md-3">
              <div
                style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}
              >
                5M+
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                }}
              >
                Active Buyers
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div
                style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}
              >
                2M+
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                }}
              >
                Professional Sellers
              </div>
            </div>
            <div className="col-6 col-md-3 mt-4 mt-md-0">
              <div
                style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}
              >
                10M+
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                }}
              >
                Completed Projects
              </div>
            </div>
            <div className="col-6 col-md-3 mt-4 mt-md-0">
              <div
                style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}
              >
                98%
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                }}
              >
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services - Fiverr Style */}
      <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
        <div className="container">
          <h2
            style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[8],
            }}
          >
            Popular professional services
          </h2>

          <div className="row g-4">
            {[
              {
                title: 'Logo Design',
                subtitle: 'Build your brand',
                image:
                  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
                color: '#00732e',
              },
              {
                title: 'WordPress',
                subtitle: 'Customize your site',
                image:
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                color: '#ff7640',
              },
              {
                title: 'Voice Over',
                subtitle: 'Share your message',
                image:
                  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
                color: '#003912',
              },
              {
                title: 'Video Editing',
                subtitle: 'Engage your audience',
                image:
                  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=400&h=300&fit=crop',
                color: '#4d1727',
              },
              {
                title: 'Social Media',
                subtitle: 'Reach more customers',
                image:
                  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
                color: '#687200',
              },
              {
                title: 'SEO',
                subtitle: 'Unlock growth online',
                image:
                  'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=300&fit=crop',
                color: '#421300',
              },
            ].map((service, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <a
                  href={`/shop?category=${service.title.toLowerCase().replace(' ', '-')}`}
                  className="text-decoration-none"
                >
                  <Card
                    variant="default"
                    size="sm"
                    padding={false}
                    hoverable={true}
                    style={{
                      height: '100%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        height: '240px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `url('${service.image}') center/cover`,
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(180deg, transparent 0%, ${service.color}dd 100%)`,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: theme.spacing[4],
                          left: theme.spacing[4],
                          color: 'white',
                        }}
                      >
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.xs,
                            opacity: 0.9,
                          }}
                        >
                          {service.subtitle}
                        </div>
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.xl,
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {service.title}
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Solutions */}
      <section
        style={{
          padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2
                style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[6],
                }}
              >
                A whole world of freelance talent at your fingertips
              </h2>

              {[
                {
                  icon: '🏆',
                  title: 'The best for every budget',
                  description:
                    'Find high-quality services at every price point. No hourly rates, just project-based pricing.',
                },
                {
                  icon: '⚡',
                  title: 'Quality work done quickly',
                  description:
                    'Find the right freelancer to begin working on your project within minutes.',
                },
                {
                  icon: '✅',
                  title: 'Protected payments, every time',
                  description:
                    "Always know what you'll pay upfront. Your payment isn't released until you approve the work.",
                },
                {
                  icon: '🌟',
                  title: '24/7 support',
                  description:
                    'Questions? Our round-the-clock support team is available to help anytime, anywhere.',
                },
              ].map((feature, index) => (
                <div key={index} className="d-flex gap-4 mb-5">
                  <div
                    style={{
                      fontSize: '2rem',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: theme.typography.fontSize.lg,
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
                        margin: 0,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6 mt-8 mt-lg-0">
              <div
                style={{
                  position: 'relative',
                  borderRadius: theme.borderRadius['2xl'],
                  overflow: 'hidden',
                  height: '500px',
                  boxShadow: theme.colors.shadow.xl,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop') center/cover`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
        <div className="container">
          <Card
            variant="default"
            size="lg"
            padding={false}
            style={{
              background: theme.colors.primary,
              border: 'none',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: `${theme.spacing[12]} ${theme.spacing[8]}`,
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing[4],
                }}
              >
                Find the talent needed to get your business growing
              </h2>
              <p
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  marginBottom: theme.spacing[8],
                  opacity: 0.9,
                  maxWidth: '600px',
                  margin: `0 auto ${theme.spacing[8]}`,
                }}
              >
                Get matched with perfect talent by a customer success manager
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => (window.location.href = '/auth')}
                style={{
                  minWidth: '200px',
                  backgroundColor: 'white',
                  color: theme.colors.primary,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
