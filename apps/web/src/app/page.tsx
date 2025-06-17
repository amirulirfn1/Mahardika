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
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          textAlign: 'center',
          padding: '3rem 0'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: MAHARDIKA_COLORS.gold,
              margin: '0 0 0.5rem 0'
            }}>
              50+
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              UI Components
            </p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: MAHARDIKA_COLORS.gold,
              margin: '0 0 0.5rem 0'
            }}>
              99.9%
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Uptime
            </p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: MAHARDIKA_COLORS.gold,
              margin: '0 0 0.5rem 0'
            }}>
              1000+
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Happy Users
            </p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: MAHARDIKA_COLORS.gold,
              margin: '0 0 0.5rem 0'
            }}>
              24/7
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              Support
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(244, 180, 0, 0.1)',
          border: '1px solid rgba(244, 180, 0, 0.3)',
          borderRadius: '20px',
          padding: '3rem 2rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: MAHARDIKA_COLORS.gold
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.125rem',
            margin: '0 0 2rem 0',
            lineHeight: '1.6'
          }}>
            Join thousands of businesses already using Mahardika to streamline their operations and drive growth.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            style={{ 
              minWidth: '250px',
              fontSize: '1.2rem',
              padding: '1.25rem 2.5rem'
            }}
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}
