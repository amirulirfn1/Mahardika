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
      setTimeout(() => setHeroAnimated(true), 200);
    }, 800);
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
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .hero-animate {
          animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .hero-animate-left {
          animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .hero-animate-right {
          animation: slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .floating-element {
          animation: float 4s ease-in-out infinite;
        }
        
        .pulse-element {
          animation: pulse 3s ease-in-out infinite;
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
          background: linear-gradient(90deg, transparent, rgba(244,180,0,0.1), transparent);
          transition: left 0.6s ease;
        }
        
        .search-container.focused::before {
          left: 100%;
        }
        
        .service-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.6s ease;
        }
        
        .service-card:hover::before {
          left: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .feature-card {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${colors.gold}10, transparent);
          transition: left 0.6s ease;
        }
        
        .feature-card:hover::before {
          left: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }
        
        .cta-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
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
          position: relative;
        }
        
        .floating-badge {
          position: absolute;
          background: linear-gradient(135deg, ${colors.gold} 0%, ${colors.gold}CC 100%);
          color: ${colors.navy};
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 20px rgba(244,180,0,0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: float 4s ease-in-out infinite;
        }
        
        .trust-stat {
          padding: 2rem;
          border-radius: 1rem;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        
        .trust-stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .trust-stat:hover::before {
          left: 100%;
        }
        
        .trust-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.8);
        }
        
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .testimonial-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.15);
        }
        
        .hero-background {
          background: 
            radial-gradient(circle at 25% 25%, ${colors.navy}08 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${colors.gold}08 0%, transparent 50%),
            linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
        }
        
        @media (max-width: 768px) {
          .hero-animate-left,
          .hero-animate-right {
            animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          .parallax-bg {
            background-attachment: scroll;
          }
        }
      `}</style>

      <div style={{ backgroundColor: colors.background.primary, overflow: 'hidden' }}>
        {/* Floating Background Elements */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '120px', 
            height: '120px', 
            background: `radial-gradient(circle, ${colors.gold}15, transparent)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            animationDelay: '0s'
          }} />
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '8%', zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '80px', 
            height: '80px', 
            background: `radial-gradient(circle, ${colors.navy}15, transparent)`,
            borderRadius: '50%',
            filter: 'blur(30px)',
            animationDelay: '2s'
          }} />
        </div>

        {/* Hero Section */}
        <section className="hero-background" style={{
          padding: '6rem 1rem 8rem',
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <div className={heroAnimated ? 'hero-animate-left' : ''}>
                  {/* Success Badge */}
                  <div className="floating-badge" style={{ top: '-1rem', left: '0' }}>
                    🚀 #1 Marketplace Platform
                  </div>
                  
                  <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 700,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: colors.navy,
                    lineHeight: 1.2,
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em',
                    marginTop: '2rem'
                  }}>
                    Find the perfect{' '}
                    <span className="gradient-text">
                      freelance services
                    </span>{' '}
                    for your business
                  </h1>

                  <p style={{
                    fontSize: '1.25rem',
                    color: colors.gray[600],
                    lineHeight: 1.6,
                    marginBottom: '2.5rem',
                    fontWeight: 400,
                    maxWidth: '95%'
                  }}>
                    Work with talented professionals from around the world. 
                    Join millions who trust Mahardika to bring their ideas to life.
                  </p>

                  {/* Enhanced Search Bar */}
                  <form onSubmit={handleSearch}>
                    <div className={`search-container ${isSearchFocused ? 'focused' : ''}`} style={{
                      background: 'rgba(255,255,255,0.95)',
                      padding: '0.5rem',
                      borderRadius: '1rem',
                      boxShadow: isSearchFocused 
                        ? `0 20px 40px rgba(0,0,0,0.15), 0 0 0 3px ${colors.gold}40` 
                        : '0 8px 32px rgba(0,0,0,0.1)',
                      border: `1px solid ${isSearchFocused ? colors.gold : 'rgba(255,255,255,0.2)'}`,
                      marginBottom: '2rem',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ 
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: colors.gray[400],
                          fontSize: '1.25rem'
                        }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Try 'logo design' or 'web development'"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '1.125rem',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '0.75rem',
                            width: '100%',
                            backgroundColor: 'transparent',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            color: colors.navy,
                          }}
                        />
                      </div>
                      <BrandButton
                        variant="navy"
                        size="lg"
                        type="submit"
                        className="cta-button"
                        style={{ 
                          minWidth: '120px',
                          borderRadius: '0.75rem',
                          padding: '1rem 2rem',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        Search
                      </BrandButton>
                    </div>
                  </form>

                  {/* Trending Tags */}
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                    <span style={{
                      color: colors.gray[500],
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Popular:
                    </span>
                    {[
                      { term: 'Website Design', icon: '🎨' },
                      { term: 'Mobile App', icon: '📱' },
                      { term: 'Logo Design', icon: '✨' },
                      { term: 'AI Services', icon: '🤖' },
                    ].map(({ term, icon }) => (
                      <a
                        key={term}
                        href={`/shop?search=${encodeURIComponent(term)}`}
                        className="text-decoration-none"
                        style={{
                          color: colors.gray[600],
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '2rem',
                          border: `1px solid ${colors.gray[200]}`,
                          background: 'rgba(255,255,255,0.8)',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.gold;
                          e.currentTarget.style.backgroundColor = `${colors.gold}10`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = colors.gray[200];
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontSize: '0.875rem' }}>{icon}</span>
                        {term}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mt-5 mt-lg-0">
                <div className={heroAnimated ? 'hero-animate-right' : ''}>
                  <div style={{
                    position: 'relative',
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    height: '500px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                  }}>
                    {/* Hero Image */}
                    <Image
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                      alt="Professional collaboration"
                      fill
                      style={{ objectFit: 'cover' }}
                      quality={90}
                      priority
                    />
                    
                    {/* Floating Success Card */}
                    <div className="testimonial-card pulse-element" style={{
                      position: 'absolute',
                      bottom: '2rem',
                      left: '2rem',
                      right: '2rem',
                      margin: 0
                    }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.navy} 100%)`,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          flexShrink: 0
                        }}>
                          ⭐
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            marginBottom: '0.25rem',
                            color: colors.navy
                          }}>
                            Sarah Chen, CEO
                          </div>
                          <div style={{
                            color: colors.gray[600],
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            fontStyle: 'italic'
                          }}>
                            &ldquo;Increased revenue by 200% with Mahardika&rdquo;
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} style={{ color: colors.gold, fontSize: '0.875rem' }}>★</span>
                            ))}
                            <span style={{ 
                              marginLeft: '0.5rem', 
                              fontSize: '0.75rem', 
                              color: colors.gray[500],
                              fontWeight: 500
                            }}>
                              5.0 (150+ reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Stats */}
                    <div className="floating-element" style={{
                      position: 'absolute',
                      top: '2rem',
                      right: '2rem',
                      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navy}F0 100%)`,
                      color: 'white',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      boxShadow: '0 8px 24px rgba(13,27,42,0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      animationDelay: '1s'
                    }}>
                      💼 1M+ Happy Clients
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Statistics */}
        <section className={heroAnimated ? 'hero-animate' : ''} style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
          padding: '4rem 1rem',
          position: 'relative'
        }}>
          <div className="container">
            <div className="text-center mb-5">
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 600,
                color: colors.gray[600],
                marginBottom: '3rem'
              }}>
                Trusted by professionals worldwide
              </h3>
            </div>
            <div className="row g-4">
              {[
                { value: '5M+', label: 'Active Users', icon: '👥' },
                { value: '2M+', label: 'Expert Freelancers', icon: '⭐' },
                { value: '15M+', label: 'Projects Completed', icon: '🚀' },
                { value: '99%', label: 'Success Rate', icon: '💯' }
              ].map((stat, index) => (
                <div key={stat.label} className="col-6 col-md-3">
                  <div className="trust-stat feature-card text-center">
                    <div className="feature-icon" style={{ 
                      fontSize: '2rem', 
                      marginBottom: '1rem'
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      fontSize: '2.25rem',
                      fontWeight: 700,
                      color: colors.navy,
                      marginBottom: '0.5rem'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: colors.gray[600],
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section style={{ 
          padding: '6rem 1rem',
          background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`
        }}>
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="gradient-text" style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                marginBottom: '1rem',
              }}>
                Popular Services
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: colors.gray[600],
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Discover our most in-demand services from top-rated professionals
              </p>
            </div>

            <div className="row g-4">
              {[
                {
                  title: 'Logo & Brand Design',
                  subtitle: 'Professional identity creation',
                  image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, ${colors.navy}E6, ${colors.gold}E6)`,
                  icon: '🎨'
                },
                {
                  title: 'Web Development',
                  subtitle: 'Custom website solutions',
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #3B82F6E6, #8B5CF6E6)`,
                  icon: '💻'
                },
                {
                  title: 'Mobile App Design',
                  subtitle: 'iOS & Android interfaces',
                  image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #10B981E6, #059669E6)`,
                  icon: '📱'
                },
                {
                  title: 'Video Production',
                  subtitle: 'Engaging video content',
                  image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #F59E0BE6, #EF4444E6)`,
                  icon: '🎬'
                },
                {
                  title: 'Digital Marketing',
                  subtitle: 'Grow your online presence',
                  image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #8B5CF6E6, #EC4899E6)`,
                  icon: '📊'
                },
                {
                  title: 'Content Writing',
                  subtitle: 'Compelling copy & articles',
                  image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
                  gradient: `linear-gradient(135deg, #06B6D4E6, #3B82F6E6)`,
                  icon: '✍️'
                }
              ].map((service, index) => (
                <div key={service.title} className="col-md-6 col-lg-4">
                  <a
                    href={`/shop?category=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-decoration-none service-card"
                    style={{ display: 'block' }}
                  >
                    <div style={{
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      height: '300px',
                      position: 'relative',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      border: `1px solid ${colors.gray[200]}`,
                    }}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={80}
                      />
                      
                      {/* Gradient Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: service.gradient,
                      }} />
                      
                      {/* Content */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2rem',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                        color: 'white',
                      }}>
                        <div style={{ 
                          fontSize: '2rem', 
                          marginBottom: '1rem',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                        }}>
                          {service.icon}
                        </div>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          marginBottom: '0.5rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                          {service.title}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          opacity: 0.9,
                          margin: 0,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}>
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="parallax-bg" style={{ 
          padding: '6rem 1rem',
          background: `
            linear-gradient(135deg, ${colors.navy}F0, ${colors.navy}E6),
            url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop') center/cover
          `,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Floating Particles */}
          <div style={{ position: 'absolute', top: '20%', left: '15%' }}>
            <div className="floating-element" style={{ 
              width: '6px', 
              height: '6px', 
              backgroundColor: colors.gold,
              borderRadius: '50%',
              animationDelay: '0s'
            }} />
          </div>
          <div style={{ position: 'absolute', top: '70%', right: '20%' }}>
            <div className="floating-element" style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              animationDelay: '2s'
            }} />
          </div>
          <div style={{ position: 'absolute', bottom: '40%', left: '25%' }}>
            <div className="floating-element" style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: colors.gold,
              borderRadius: '50%',
              animationDelay: '4s'
            }} />
          </div>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="glass-card" style={{
                  padding: '4rem 2rem',
                  borderRadius: '2rem',
                  border: `1px solid ${colors.gold}40`
                }}>
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '2rem',
                    background: `linear-gradient(45deg, ${colors.gold}, #FFD700)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    🚀
                  </div>
                  <h2 style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    color: 'white'
                  }}>
                    Ready to transform your business?
                  </h2>
                  <p style={{
                    fontSize: '1.125rem',
                    opacity: 0.9,
                    marginBottom: '2.5rem',
                    lineHeight: 1.6,
                    maxWidth: '500px',
                    margin: '0 auto 2.5rem'
                  }}>
                    Join millions of businesses that trust Mahardika to connect with top talent and achieve their goals.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <BrandButton
                      variant="gold"
                      size="lg"
                      className="cta-button"
                      style={{
                        minWidth: '180px',
                        padding: '1rem 2rem'
                      }}
                    >
                      Get Started Free
                    </BrandButton>
                    <BrandButton
                      variant="outline-gold"
                      size="lg"
                      className="cta-button"
                      style={{
                        minWidth: '180px',
                        padding: '1rem 2rem',
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white'
                      }}
                    >
                      Browse Services
                    </BrandButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
