'use client';

import React from 'react';
import { Button, Card } from '@mahardika/ui';
import { MAHARDIKA_COLORS } from '../lib/env';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, #0D1B2A 0%, #1a2c3d 100%)`
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '4rem 2rem',
          border: '1px solid rgba(244, 180, 0, 0.2)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            margin: '0 0 1.5rem 0',
            background: `linear-gradient(45deg, ${MAHARDIKA_COLORS.gold} 0%, #FFD700 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            Welcome to Mahardika
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '800px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Empowering businesses with intelligent solutions, seamless integrations, 
            and cutting-edge technology. Transform your operations with our comprehensive platform.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '2.5rem'
          }}>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/dashboard'}
              style={{ 
                minWidth: '200px',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/demo/upload'}
              style={{ 
                minWidth: '200px',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                borderColor: MAHARDIKA_COLORS.gold,
                color: MAHARDIKA_COLORS.gold
              }}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '600',
          textAlign: 'center',
          margin: '0 0 3rem 0',
          color: MAHARDIKA_COLORS.gold
        }}>
          Platform Features
        </h2>

        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          marginBottom: '3rem'
        }}>
          <Card
            title="🤖 AI-Powered Analytics"
            subtitle="Intelligent insights for better decisions"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Leverage advanced AI algorithms to analyze your data, predict trends, 
              and provide actionable insights that drive business growth.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/marketplace'}
            >
              Learn More
            </Button>
          </Card>

          <Card
            title="🏢 Agency Management"
            subtitle="Streamline your business operations"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Comprehensive tools to manage agencies, track performance, 
              handle client relationships, and optimize operational efficiency.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/agencies'}
            >
              Explore Agencies
            </Button>
          </Card>

          <Card
            title="📊 Real-time Dashboard"
            subtitle="Monitor everything in one place"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Beautiful, responsive dashboards that provide real-time insights 
              into your business metrics, KPIs, and operational status.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
            >
              View Dashboard
            </Button>
          </Card>

          <Card
            title="🛒 E-commerce Integration"
            subtitle="Seamless shopping experiences"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Built-in e-commerce capabilities with secure payment processing, 
              inventory management, and customer engagement tools.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/shop'}
            >
              Visit Shop
            </Button>
          </Card>

          <Card
            title="🔐 Enterprise Security"
            subtitle="Bank-grade security & compliance"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Advanced security features including end-to-end encryption, 
              multi-factor authentication, and compliance with industry standards.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/auth'}
            >
              Security Details
            </Button>
          </Card>

          <Card
            title="⚡ Cloud Infrastructure"
            subtitle="Scalable and reliable performance"
            variant="branded"
            size="lg"
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.6'
            }}>
              Built on modern cloud infrastructure ensuring 99.9% uptime, 
              automatic scaling, and global content delivery.
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/terms'}
            >
              Service Terms
            </Button>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: '600',
            margin: '0 0 1.5rem 0',
            color: 'white'
          }}>
            Ready to Transform Your Business?
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 2.5rem 0',
            lineHeight: '1.6'
          }}>
            Join thousands of businesses already using Mahardika to streamline operations, 
            boost productivity, and drive growth. Start your journey today.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/auth'}
              style={{ 
                minWidth: '180px',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/brand-showcase'}
              style={{ 
                minWidth: '180px',
                fontSize: '1.1rem',
                padding: '1rem 2rem',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              View Components
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem 2rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div>
              <h3 style={{
                color: MAHARDIKA_COLORS.gold,
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Platform
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <a href="/dashboard" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Dashboard</a>
                <a href="/agencies" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Agencies</a>
                <a href="/marketplace" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Marketplace</a>
              </div>
            </div>

            <div>
              <h3 style={{
                color: MAHARDIKA_COLORS.gold,
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Resources
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <a href="/demo/upload" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Demo</a>
                <a href="/brand-showcase" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Brand Guide</a>
                <a href="/style-guide" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Style Guide</a>
              </div>
            </div>

            <div>
              <h3 style={{
                color: MAHARDIKA_COLORS.gold,
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Legal
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <a href="/terms" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Terms of Service</a>
                <a href="/privacy" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>Privacy Policy</a>
              </div>
            </div>

            <div>
              <h3 style={{
                color: MAHARDIKA_COLORS.gold,
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Contact
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Built with modern technology stack:<br/>
                Next.js • React • TypeScript • Supabase
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0',
              fontSize: '0.875rem'
            }}>
              © 2024 Mahardika Platform. Built with ❤️ using our brand colors: Navy #0D1B2A • Gold #F4B400
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
