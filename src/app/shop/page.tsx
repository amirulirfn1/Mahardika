'use client';

import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors, theme } from '@mahardika/ui';

// Enhanced shop data with more details
const shopCategories = [
  {
    slug: 'design-creative',
    name: 'Design & Creative',
    description: 'Logo design, web design, graphics, and creative services',
    icon: '🎨',
    serviceCount: 125,
    featured: true,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop'
  },
  {
    slug: 'programming-tech',
    name: 'Programming & Tech',
    description: 'Web development, mobile apps, and technical solutions',
    icon: '💻',
    serviceCount: 89,
    featured: true,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Consulting, market research, and business development',
    icon: '💼',
    serviceCount: 76,
    featured: false,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'SEO, social media, and online advertising',
    icon: '📈',
    serviceCount: 92,
    featured: true,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    slug: 'writing-translation',
    name: 'Writing & Translation',
    description: 'Content writing, copywriting, and translation services',
    icon: '✍️',
    serviceCount: 54,
    featured: false,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
  },
  {
    slug: 'video-animation',
    name: 'Video & Animation',
    description: 'Video editing, animation, and motion graphics',
    icon: '🎬',
    serviceCount: 67,
    featured: false,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=400&h=300&fit=crop'
  },
];

const featuredServices = [
  {
    slug: 'premium-logo-design',
    name: 'Professional Logo Design',
    seller: 'DesignPro',
    sellerLevel: 'Top Rated',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    price: 'From $99',
    originalPrice: '$149',
    description: 'I will create a modern, professional logo for your business',
    category: 'design-creative',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 127,
    deliveryTime: '3 days',
    badge: 'Best Seller',
    badgeColor: colors.gold,
    tags: ['Premium', 'Fast Delivery', 'Unlimited Revisions']
  },
  {
    slug: 'full-stack-web-app',
    name: 'Full-Stack Web Application',
    seller: 'CodeMaster',
    sellerLevel: 'Level 2',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    price: 'From $299',
    originalPrice: '$399',
    description: 'I will develop a complete web application with modern tech stack',
    category: 'programming-tech',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 89,
    deliveryTime: '7 days',
    badge: 'Premium',
    badgeColor: colors.navy,
    tags: ['React', 'Node.js', 'MongoDB']
  },
  {
    slug: 'seo-optimization',
    name: 'Complete SEO Optimization',
    seller: 'SEOExpert',
    sellerLevel: 'Top Rated',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    price: 'From $149',
    originalPrice: '$199',
    description: 'I will optimize your website for top search engine rankings',
    category: 'digital-marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 203,
    deliveryTime: '5 days',
    badge: 'Hot',
    badgeColor: '#FF5722',
    tags: ['White Hat', 'Guaranteed Results', 'Monthly Reports']
  },
];

const ShopIndexPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState(false);

  useEffect(() => {
    // Trigger card animations after component mounts
    setTimeout(() => setAnimatedCards(true), 500);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search logic
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .card-animate {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .card-animate-delay-1 { animation-delay: 0.1s; }
        .card-animate-delay-2 { animation-delay: 0.2s; }
        .card-animate-delay-3 { animation-delay: 0.3s; }
        .card-animate-delay-4 { animation-delay: 0.4s; }
        .card-animate-delay-5 { animation-delay: 0.5s; }
        .card-animate-delay-6 { animation-delay: 0.6s; }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .category-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }
        
        .category-card:hover::before {
          left: 100%;
        }
        
        .category-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .service-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        
        .search-glow {
          box-shadow: 0 0 30px rgba(244, 180, 0, 0.3);
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .service-card:hover .hover-overlay {
          opacity: 1 !important;
        }
        
        .category-card:hover .floating-icon {
          transform: scale(1.1) !important;
        }
        
        .service-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }
      `}</style>

      <div
        style={{
          backgroundColor: theme.colors.background.primary,
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {/* Enhanced Hero Section */}
        <section
          style={{
            padding: `${theme.spacing[16]} ${theme.spacing[4]} ${theme.spacing[20]}`,
            background: `
              radial-gradient(circle at 30% 20%, ${colors.navy}15 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, ${colors.gold}10 0%, transparent 50%),
              linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)
            `,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Floating decorative elements */}
          <div style={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.6 }}>
            <div className="floating-icon" style={{ fontSize: '3rem' }}>💼</div>
          </div>
          <div style={{ position: 'absolute', bottom: '20%', left: '8%', opacity: 0.6 }}>
            <div className="floating-icon" style={{ fontSize: '2.5rem', animationDelay: '1s' }}>🎯</div>
          </div>

          <div className="container">
            <div className="text-center">
              <div className="mb-4">
                <span style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.navy})`,
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(244,180,0,0.3)'
                }}>
                  🔥 Over 10,000+ Services Available
                </span>
              </div>
              
              <h1
                style={{
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[6],
                  fontFamily: theme.typography.fontFamily.heading,
                  background: `linear-gradient(135deg, ${theme.colors.text.primary} 0%, ${colors.navy} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Find services for your{' '}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold} 0%, #FFD700 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  business
                </span>
              </h1>
              
              <p
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing[10],
                  maxWidth: '700px',
                  margin: `0 auto ${theme.spacing[10]}`,
                  lineHeight: theme.typography.lineHeight.relaxed,
                }}
              >
                Browse thousands of services from top-rated professionals around
                the world. Get your project done right, on time, and on budget.
              </p>

              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch}>
                <div
                  style={{
                    maxWidth: '700px',
                    margin: '0 auto',
                    position: 'relative'
                  }}
                >
                  <div
                    className={isSearchFocused ? 'search-glow' : ''}
                    style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '20px',
                      boxShadow: isSearchFocused 
                        ? '0 25px 80px rgba(0,0,0,0.15), 0 0 0 4px rgba(244,180,0,0.2)' 
                        : '0 15px 50px rgba(0,0,0,0.1)',
                      border: `3px solid ${isSearchFocused ? colors.gold : 'transparent'}`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{ flex: 1, position: 'relative' }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '20px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: colors.gray[400],
                        fontSize: '24px'
                      }}>🔍</span>
                      <input
                        type="text"
                        placeholder="What service are you looking for today?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: theme.typography.fontSize.lg,
                          padding: '18px 20px 18px 60px',
                          borderRadius: '16px',
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
                      style={{ 
                        minWidth: '160px',
                        borderRadius: '16px',
                        fontSize: '18px',
                        padding: '16px 24px'
                      }}
                    >
                      Search
                    </BrandButton>
                  </div>
                </div>
              </form>

              {/* Enhanced Popular Searches */}
              <div className="mt-6">
                <span
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.tertiary,
                    marginRight: theme.spacing[3],
                    fontWeight: theme.typography.fontWeight.medium
                  }}
                >
                  🎯 Popular searches:
                </span>
                {[
                  { term: 'Logo Design', trend: '+150%' },
                  { term: 'Web Development', trend: '+89%' },
                  { term: 'SEO Services', trend: '+200%' },
                  { term: 'Content Writing', trend: '+67%' }
                ].map(({ term, trend }) => (
                  <span
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    style={{
                      display: 'inline-block',
                      margin: '8px',
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.sm,
                      borderRadius: '25px',
                      border: `2px solid ${theme.colors.border.light}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: theme.typography.fontWeight.medium,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.gold;
                      e.currentTarget.style.color = colors.navy;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(244,180,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border.light;
                      e.currentTarget.style.color = theme.colors.text.secondary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {term}
                    <span style={{ 
                      marginLeft: '8px', 
                      color: colors.gold, 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {trend}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Services */}
        <section style={{ 
          padding: `${theme.spacing[20]} ${theme.spacing[4]}`,
          background: `linear-gradient(180deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 50%, ${theme.colors.background.primary} 100%)`
        }}>
          <div className="container">
            <div className="text-center mb-12">
              <span style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.navy})`,
                color: 'white',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ⭐ Editor's Choice
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginTop: theme.spacing[4],
                  marginBottom: theme.spacing[4],
                  background: `linear-gradient(135deg, ${theme.colors.text.primary} 0%, ${colors.navy} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Featured Services
              </h2>
              <p
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  color: theme.colors.text.secondary,
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: theme.typography.lineHeight.relaxed
                }}
              >
                Hand-picked premium services from our top-rated professionals
              </p>
            </div>

            <div className="row g-6">
              {featuredServices.map((service, index) => (
                <div key={service.slug} className={`col-md-6 col-lg-4 ${animatedCards ? `card-animate card-animate-delay-${index + 1}` : ''}`}>
                  <div
                    className="service-card"
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      border: `1px solid ${theme.colors.border.light}`,
                      height: '100%',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => (window.location.href = `/shop/${service.slug}`)}
                  >
                    {service.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: service.badgeColor,
                          color: service.badge === 'Premium' ? 'white' : colors.navy,
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          zIndex: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {service.badge}
                      </div>
                    )}

                    {/* Enhanced Service Image */}
                    <div
                      style={{
                        height: '200px',
                        backgroundImage: `url(${service.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
                        }}
                      />
                      
                      {/* Hover overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(13,27,42,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        className="hover-overlay"
                      >
                        <BrandButton variant="gold" size="sm">
                          View Details
                        </BrandButton>
                      </div>
                    </div>

                      {/* Enhanced Seller Info */}
                      <div className="d-flex align-items-center mb-4">
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundImage: `url(${service.sellerAvatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            marginRight: '12px',
                            border: `2px solid ${colors.gold}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: theme.typography.fontSize.base,
                              fontWeight: theme.typography.fontWeight.semibold,
                              color: theme.colors.text.primary,
                              marginBottom: '2px'
                            }}
                          >
                            {service.seller}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                background: `linear-gradient(135deg, ${colors.gold}, #FFD700)`,
                                color: colors.navy,
                                padding: '2px 8px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                              }}
                            >
                              {service.sellerLevel}
                            </span>
                            <span style={{ color: colors.gold, fontSize: '12px' }}>⭐</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Service Title */}
                      <h3
                        style={{
                          fontSize: theme.typography.fontSize.xl,
                          fontWeight: theme.typography.fontWeight.bold,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing[3],
                          lineHeight: theme.typography.lineHeight.tight,
                          minHeight: '60px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {service.name}
                      </h3>

                      {/* Service Tags */}
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {service.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            style={{
                              fontSize: '11px',
                              background: `${colors.navy}15`,
                              color: colors.navy,
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontWeight: 'medium'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Enhanced Rating & Reviews */}
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center gap-1 me-2">
                            {[1,2,3,4,5].map(star => (
                              <span
                                key={star}
                                style={{
                                  color: star <= Math.floor(service.rating) ? colors.gold : colors.gray[300],
                                  fontSize: '14px'
                                }}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.bold,
                              color: theme.colors.text.primary,
                              marginRight: '8px',
                            }}
                          >
                            {service.rating}
                          </span>
                          <span
                            style={{
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.tertiary,
                            }}
                          >
                            ({service.reviews} reviews)
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: colors.navy,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ⚡ {service.deliveryTime}
                        </div>
                      </div>

                      {/* Enhanced Footer with Pricing */}
                      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${theme.colors.border.light}` }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div
                              style={{
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.text.tertiary,
                                textDecoration: 'line-through',
                                marginBottom: '2px'
                              }}
                            >
                              {service.originalPrice}
                            </div>
                            <div
                              style={{
                                fontSize: theme.typography.fontSize.xl,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: colors.navy,
                              }}
                            >
                              {service.price}
                            </div>
                          </div>
                          <BrandButton
                            variant="outline-navy"
                            size="sm"
                            style={{ 
                              borderRadius: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            Order Now
                          </BrandButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
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
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[4],
                }}
              >
                Browse by Category
              </h2>
              <p
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  color: theme.colors.text.secondary,
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                Explore our wide range of professional services
              </p>
            </div>

            <div className="row g-4">
              {shopCategories.map((category, index) => (
                <div key={category.slug} className="col-md-6 col-lg-4">
                  <Card
                    variant="default"
                    size="lg"
                    hoverable={true}
                    style={{
                      height: '100%',
                      cursor: 'pointer',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                    onClick={() =>
                      (window.location.href = `/shop?category=${category.slug}`)
                    }
                  >
                    {category.featured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: theme.spacing[4],
                          right: theme.spacing[4],
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: theme.colors.primary,
                        }}
                      />
                    )}

                    <div
                      style={{ fontSize: '4rem', marginBottom: theme.spacing[4] }}
                    >
                      {category.icon}
                    </div>

                    <h3
                      style={{
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing[2],
                      }}
                    >
                      {category.name}
                    </h3>

                    <p
                      style={{
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.tertiary,
                        lineHeight: theme.typography.lineHeight.relaxed,
                        marginBottom: theme.spacing[4],
                      }}
                    >
                      {category.description}
                    </p>

                    <div
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.primary,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {category.serviceCount} services available
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
          <div className="container">
            <div className="text-center">
              <h2
                style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[8],
                }}
              >
                Trusted by businesses worldwide
              </h2>

              <div className="row g-4">
                {[
                  {
                    icon: '🏆',
                    title: '10,000+',
                    subtitle: 'Projects completed',
                  },
                  { icon: '⭐', title: '4.9/5', subtitle: 'Average rating' },
                  { icon: '🌍', title: '150+', subtitle: 'Countries served' },
                  { icon: '👥', title: '5,000+', subtitle: 'Active sellers' },
                ].map((stat, index) => (
                  <div key={stat.title} className="col-md-6 col-lg-3">
                    <div className="text-center">
                      <div
                        style={{
                          fontSize: '3rem',
                          marginBottom: theme.spacing[2],
                        }}
                      >
                        {stat.icon}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize['2xl'],
                          fontWeight: theme.typography.fontWeight.bold,
                          color: theme.colors.primary,
                          marginBottom: theme.spacing[1],
                        }}
                      >
                        {stat.title}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.base,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        {stat.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopIndexPage;
