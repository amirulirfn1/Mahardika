'use client';

import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors, theme } from '@mahardika/ui';
import { HomeSkeleton } from '@/components/LoadingSkeleton';
import Image from 'next/image';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [heroAnimated, setHeroAnimated] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger hero animation
      setTimeout(() => setHeroAnimated(true), 300);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(244, 180, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(244, 180, 0, 0.6); }
        }

        .hero-animate {
          animation: slideInUp 0.8s ease-out;
        }
        
        .hero-animate-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .hero-animate-right {
          animation: slideInRight 0.8s ease-out;
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .pulse-element {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .glow-effect {
          animation: glow 3s ease-in-out infinite;
        }
        
        .search-container {
          position: relative;
          overflow: hidden;
        }
        
        .search-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .search-container.focused::before {
          left: 100%;
        }
        
        .service-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(244,180,0,0.1), transparent);
          transition: left 0.5s;
        }
        
        .service-card:hover::before {
          left: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          transition: all 0.3s ease;
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(5deg);
        }
        
        .cta-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .cta-button:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.gold} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .floating-badge {
          position: absolute;
          background: ${colors.gold};
          color: ${colors.navy};
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 15px rgba(244,180,0,0.3);
          animation: float 4s ease-in-out infinite;
        }
        
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .service-card:hover .service-arrow {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
      `}</style>

      <div style={{ backgroundColor: theme.colors.background.primary, overflow: 'hidden' }}>
        {/* Floating Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '100px', 
            height: '100px', 
            background: `linear-gradient(135deg, ${colors.gold}20, ${colors.navy}20)`,
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '150px', 
            height: '150px', 
            background: `linear-gradient(45deg, ${colors.navy}10, ${colors.gold}10)`,
            borderRadius: '30px',
            filter: 'blur(30px)',
            animationDelay: '2s'
          }} />
        </div>

        {/* Hero Section */}
        <section
          style={{
            padding: `${theme.spacing[20]} ${theme.spacing[4]} ${theme.spacing[24]}`,
            background: `
              radial-gradient(circle at 20% 80%, ${colors.navy}15 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${colors.gold}15 0%, transparent 50%),
              linear-gradient(180deg, ${theme.colors.background.secondary} 0%, ${theme.colors.background.primary} 100%)
            `,
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <div className={heroAnimated ? 'hero-animate-left' : ''}>
                  {/* Badge */}
                  <div className="floating-badge" style={{ top: '-20px', left: '0' }}>
                    🚀 New Platform Launch
                  </div>
                  
                  <h1
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                      fontWeight: theme.typography.fontWeight.bold,
                      fontFamily: theme.typography.fontFamily.heading,
                      color: theme.colors.text.primary,
                      lineHeight: theme.typography.lineHeight.tight,
                      marginBottom: theme.spacing[6],
                      letterSpacing: theme.typography.letterSpacing.tighter,
                      marginTop: theme.spacing[8]
                    }}
                  >
                    Find the perfect{' '}
                    <span className="gradient-text">
                      freelance
                    </span>{' '}
                    services for your business
                  </h1>

                  <p
                    style={{
                      fontSize: theme.typography.fontSize.xl,
                      color: theme.colors.text.secondary,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      marginBottom: theme.spacing[10],
                      fontWeight: theme.typography.fontWeight.regular,
                      maxWidth: '90%'
                    }}
                  >
                    Work with talented professionals and grow your business.
                    Join millions who use Mahardika to turn their ideas into reality.
                  </p>

                  {/* Enhanced Search Bar */}
                  <form onSubmit={handleSearch}>
                    <div
                      className={`search-container ${isSearchFocused ? 'focused' : ''}`}
                      style={{
                        backgroundColor: 'white',
                        padding: '8px',
                        borderRadius: '16px',
                        boxShadow: isSearchFocused 
                          ? '0 20px 60px rgba(0,0,0,0.15), 0 0 0 4px rgba(244,180,0,0.2)' 
                          : '0 10px 40px rgba(0,0,0,0.1)',
                        border: `2px solid ${isSearchFocused ? colors.gold : 'transparent'}`,
                        marginBottom: theme.spacing[8],
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ 
                          position: 'absolute', 
                          left: '16px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: colors.gray[400],
                          fontSize: '20px'
                        }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Try 'building mobile app' or 'logo design'"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: theme.typography.fontSize.lg,
                            padding: '16px 16px 16px 50px',
                            borderRadius: '12px',
                            width: '100%',
                            backgroundColor: 'transparent',
                            fontFamily: theme.typography.fontFamily.body,
                          }}
                        />
                      </div>
                      <BrandButton
                        variant="navy"
                        size="lg"
                        type="submit"
                        className="cta-button"
                        style={{ 
                          minWidth: '140px',
                          borderRadius: '12px',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        Search
                      </BrandButton>
                    </div>
                  </form>

                  {/* Enhanced Popular Searches */}
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <span
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium
                      }}
                    >
                      🔥 Trending:
                    </span>
                    {[
                      { term: 'Website Design', icon: '🎨' },
                      { term: 'WordPress', icon: '💻' },
                      { term: 'Logo Design', icon: '✨' },
                      { term: 'AI Services', icon: '🤖' },
                    ].map(({ term, icon }) => (
                      <a
                        key={term}
                        href={`/shop?search=${encodeURIComponent(term)}`}
                        className="text-decoration-none service-card"
                        style={{
                          color: theme.colors.text.secondary,
                          fontSize: theme.typography.fontSize.sm,
                          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                          borderRadius: '25px',
                          border: `1px solid ${theme.colors.border.light}`,
                          backgroundColor: 'white',
                          fontWeight: theme.typography.fontWeight.medium,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span>{icon}</span>
                        {term}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mt-8 mt-lg-0">
                <div className={heroAnimated ? 'hero-animate-right' : ''}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      height: '600px',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.15)'
                    }}
                  >
                    {/* Background Image */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop') center/cover`,
                        filter: 'brightness(0.9)',
                      }}
                    />
                    
                    {/* Floating Success Card */}
                    <div
                      className="pulse-element"
                      style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '30px',
                        right: '30px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '24px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="glow-effect"
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.navy} 100%)`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                          }}
                        >
                          ⭐
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: theme.typography.fontWeight.bold,
                              fontSize: '18px',
                              marginBottom: '4px'
                            }}
                          >
                            Andrea, Fashion Designer
                          </div>
                          <div
                            style={{
                              color: theme.colors.text.secondary,
                              fontSize: theme.typography.fontSize.sm,
                              marginBottom: '8px'
                            }}
                          >
                            "                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            "Increased sales by 300% using Mahardika services!""
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} style={{ color: colors.gold, fontSize: '16px' }}>⭐</span>
                            ))}
                            <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                              5.0 (127 reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Stats */}
                    <div
                      className="floating-element"
                      style={{
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        backgroundColor: colors.navy,
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 30px rgba(13,27,42,0.3)',
                        animationDelay: '1s'
                      }}
                    >
                      💼 1M+ Projects Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Trust Bar with animations */}
        <section
          className={heroAnimated ? 'hero-animate' : ''}
          style={{
            backgroundColor: 'white',
            padding: `${theme.spacing[12]} ${theme.spacing[4]}`,
            borderTop: `1px solid ${theme.colors.border.light}`,
            borderBottom: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <div className="container">
            <div className="text-center mb-8">
              <h3 style={{ 
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[8]
              }}>
                Trusted by millions worldwide
              </h3>
            </div>
            <div className="row align-items-center text-center">
              {[
                { value: '5M+', label: 'Active Buyers', icon: '👥' },
                { value: '2M+', label: 'Professional Sellers', icon: '⭐' },
                { value: '10M+', label: 'Completed Projects', icon: '🚀' },
                { value: '98%', label: 'Satisfaction Rate', icon: '💯' }
              ].map((stat, index) => (
                <div key={stat.label} className="col-6 col-md-3 mb-4 mb-md-0">
                  <div 
                    className="feature-card"
                    style={{
                      padding: theme.spacing[6],
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      border: `1px solid ${theme.colors.border.light}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
                    }}
                  >
                    <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: theme.spacing[2] }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize['3xl'],
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing[1]
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.tertiary,
                        fontWeight: theme.typography.fontWeight.medium
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Popular Services */}
        <section style={{ 
          padding: `${theme.spacing[20]} ${theme.spacing[4]}`,
          background: `linear-gradient(180deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)`
        }}>
          <div className="container">
            <div className="text-center mb-12">
              <h2
                className="gradient-text"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: theme.spacing[4],
                }}
              >
                Popular professional services
              </h2>
              <p style={{
                fontSize: theme.typography.fontSize.xl,
                color: theme.colors.text.secondary,
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Explore our most in-demand services from top-rated professionals
              </p>
            </div>

            <div className="row g-6">
              {[
                {
                  title: 'Logo Design',
                  subtitle: 'Build your brand identity',
                  image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #00732e, #4CAF50)`,
                  icon: '🎨'
                },
                {
                  title: 'WordPress Development',
                  subtitle: 'Customize your website',
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #ff7640, #FF9800)`,
                  icon: '💻'
                },
                {
                  title: 'Voice Over',
                  subtitle: 'Share your message',
                  image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #003912, #2E7D32)`,
                  icon: '🎙️'
                },
                {
                  title: 'Video Editing',
                  subtitle: 'Engage your audience',
                  image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #4d1727, #E91E63)`,
                  icon: '🎬'
                },
                {
                  title: 'Social Media Marketing',
                  subtitle: 'Reach more customers',
                  image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #687200, #8BC34A)`,
                  icon: '📱'
                },
                {
                  title: 'SEO Optimization',
                  subtitle: 'Unlock growth online',
                  image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #421300, #FF5722)`,
                  icon: '📈'
                },
              ].map((service, index) => (
                <div key={service.title} className="col-md-6 col-lg-4">
                  <a
                    href={`/shop?category=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-decoration-none service-card"
                    style={{ display: 'block' }}
                  >
                    <div
                      style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        height: '280px',
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        border: `1px solid ${theme.colors.border.light}`,
                      }}
                    >
                      {/* Background Image */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: service.gradient,
                          opacity: 0.8,
                        }}
                      />
                      
                      {/* Content */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: theme.spacing[6],
                          color: 'white',
                        }}
                      >
                        <div style={{ 
                          fontSize: '2.5rem', 
                          marginBottom: theme.spacing[3],
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}>
                          {service.icon}
                        </div>
                        <h3
                          style={{
                            fontSize: theme.typography.fontSize.xl,
                            fontWeight: theme.typography.fontWeight.bold,
                            marginBottom: theme.spacing[2],
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          {service.title}
                        </h3>
                        <p
                          style={{
                            fontSize: theme.typography.fontSize.base,
                            opacity: 0.9,
                            margin: 0,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {service.subtitle}
                        </p>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          opacity: 0,
                          transition: 'all 0.3s ease',
                          transform: 'scale(0.8)'
                        }}
                        className="service-arrow"
                      >
                        →
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section 
          className="parallax-bg"
          style={{ 
            padding: `${theme.spacing[20]} ${theme.spacing[4]}`,
            background: `
              linear-gradient(135deg, rgba(13, 27, 42, 0.95), rgba(13, 27, 42, 0.85)),
              url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop') center/cover
            `,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Floating particles */}
          <div style={{ position: 'absolute', top: '20%', left: '10%' }}>
            <div className="floating-element" style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: colors.gold,
              borderRadius: '50%',
              animationDelay: '0s'
            }} />
          </div>
          <div style={{ position: 'absolute', top: '60%', right: '15%' }}>
            <div className="floating-element" style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: '50%',
              animationDelay: '2s'
            }} />
          </div>
          <div style={{ position: 'absolute', bottom: '30%', left: '20%' }}>
            <div className="floating-element" style={{ 
              width: '6px', 
              height: '6px', 
              backgroundColor: colors.gold,
              borderRadius: '50%',
              animationDelay: '4s'
            }} />
          </div>

          <div className="container">
            <BrandCard
              variant="navy-outline"
              size="xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: `2px solid ${colors.gold}`,
                backdropFilter: 'blur(20px)',
                textAlign: 'center',
                color: 'white'
              }}
            >
              <div className="row align-items-center">
                <div className="col-lg-8 mx-auto">
                  <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: theme.spacing[4],
                    background: `linear-gradient(45deg, ${colors.gold}, #FFF176)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    🚀
                  </div>
                  <h2
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: theme.typography.fontWeight.bold,
                      marginBottom: theme.spacing[6],
                      color: 'white'
                    }}
                  >
                    Ready to bring your vision to life?
                  </h2>
                  <p
                    style={{
                      fontSize: theme.typography.fontSize.xl,
                      opacity: 0.9,
                      marginBottom: theme.spacing[8],
                      lineHeight: theme.typography.lineHeight.relaxed,
                      maxWidth: '600px',
                      margin: `0 auto ${theme.spacing[8]}`
                    }}
                  >
                    Join millions of entrepreneurs, agencies, and businesses who use Mahardika to grow and scale their operations.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
                    <BrandButton
                      variant="gold"
                      size="lg"
                      className="cta-button glow-effect"
                      style={{ 
                        minWidth: '200px',
                        fontSize: '18px',
                        padding: '16px 32px'
                      }}
                    >
                      Start Your Project
                    </BrandButton>
                    <BrandButton
                      variant="outline-navy"
                      size="lg"
                      style={{ 
                        minWidth: '200px',
                        fontSize: '18px',
                        padding: '16px 32px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                        color: 'white'
                      }}
                    >
                      Explore Services
                    </BrandButton>
                  </div>
                </div>
              </div>
            </BrandCard>
          </div>
        </section>
      </div>
    </>
  );
}
