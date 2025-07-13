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
  },
  {
    slug: 'programming-tech',
    name: 'Programming & Tech',
    description: 'Web development, mobile apps, and technical solutions',
    icon: '💻',
    serviceCount: 89,
    featured: true,
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Consulting, market research, and business development',
    icon: '💼',
    serviceCount: 76,
    featured: false,
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'SEO, social media, and online advertising',
    icon: '📈',
    serviceCount: 92,
    featured: true,
  },
];

const featuredServices = [
  {
    slug: 'premium-logo-design',
    name: 'Professional Logo Design',
    seller: 'DesignPro',
    sellerLevel: 'Top Rated',
    sellerAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    price: 'From $99',
    originalPrice: '$149',
    description: 'I will create a modern, professional logo for your business',
    image:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 127,
    deliveryTime: '3 days',
    badge: 'Best Seller',
    badgeColor: colors.gold,
    tags: ['Premium', 'Fast Delivery', 'Unlimited Revisions'],
  },
  {
    slug: 'full-stack-web-app',
    name: 'Full-Stack Web Application',
    seller: 'CodeMaster',
    sellerLevel: 'Level 2',
    sellerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    price: 'From $299',
    originalPrice: '$399',
    description:
      'I will develop a complete web application with modern tech stack',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 89,
    deliveryTime: '7 days',
    badge: 'Premium',
    badgeColor: colors.navy,
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    slug: 'seo-optimization',
    name: 'Complete SEO Optimization',
    seller: 'SEOExpert',
    sellerLevel: 'Top Rated',
    sellerAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    price: 'From $149',
    originalPrice: '$199',
    description: 'I will optimize your website for top search engine rankings',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 203,
    deliveryTime: '5 days',
    badge: 'Hot',
    badgeColor: '#FF5722',
    tags: ['White Hat', 'Guaranteed Results', 'Monthly Reports'],
  },
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animatedCards, setAnimatedCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimatedCards(true), 500);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search logic here
    }
  };

  return (
    <div
      className="shop-page"
      style={{
        backgroundColor: theme.colors.background.primary,
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: '80px 20px 100px',
          background: `linear-gradient(135deg, ${colors.navy} 0%, #1e3a8a 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div className="text-center">
            <div className="mb-4">
              <span
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, #FFD700)`,
                  color: colors.navy,
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(244,180,0,0.3)',
                }}
              >
                🔥 Over 10,000+ Services Available
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, white 0%, #f0f9ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
                fontSize: '1.25rem',
                marginBottom: '3rem',
                maxWidth: '700px',
                margin: '0 auto 3rem',
                opacity: 0.9,
              }}
            >
              Browse thousands of services from top-rated professionals around
              the world. Get your project done right, on time, and on budget.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    border: `3px solid ${isSearchFocused ? colors.gold : 'transparent'}`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: colors.gray[400],
                        fontSize: '20px',
                      }}
                    >
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="What service are you looking for today?"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        padding: '16px 20px 16px 55px',
                        borderRadius: '16px',
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: colors.navy,
                      }}
                    />
                  </div>
                  <BrandButton
                    variant="navy"
                    size="lg"
                    type="submit"
                    style={{
                      minWidth: '140px',
                      borderRadius: '16px',
                    }}
                  >
                    Search
                  </BrandButton>
                </div>
              </div>
            </form>

            {/* Popular Searches */}
            <div style={{ marginTop: '2rem' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                  marginRight: '12px',
                }}
              >
                🎯 Popular:
              </span>
              {[
                'Logo Design',
                'Web Development',
                'SEO Services',
                'Content Writing',
              ].map(term => (
                <span
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  style={{
                    display: 'inline-block',
                    margin: '4px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: theme.colors.text.primary,
                marginBottom: '1rem',
              }}
            >
              Featured Services
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: theme.colors.text.secondary,
                margin: '0 auto',
              }}
            >
              Hand-picked by our team
            </p>
          </div>

          <div className="row g-6">
            {featuredServices.map((service, index) => (
              <div
                key={service.slug}
                className={`col-md-6 col-lg-4 ${animatedCards ? `animate-fade-in-up` : ''}`}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.colors.border.light}`,
                    height: '100%',
                    transition: 'all 0.4s ease',
                  }}
                  onClick={() =>
                    (window.location.href = `/shop/${service.slug}`)
                  }
                >
                  {service.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: service.badgeColor,
                        color:
                          service.badge === 'Premium' ? 'white' : colors.navy,
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        zIndex: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      {service.badge}
                    </div>
                  )}

                  {/* Service Image */}
                  <div
                    style={{
                      height: '200px',
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                      }}
                    />
                  </div>

                  <div style={{ padding: '20px' }}>
                    {/* Seller Info */}
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
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: theme.colors.text.primary,
                            marginBottom: '2px',
                          }}
                        >
                          {service.seller}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              background: `linear-gradient(135deg, ${colors.gold}, #FFD700)`,
                              color: colors.navy,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                            }}
                          >
                            {service.sellerLevel}
                          </span>
                          <span
                            style={{ color: colors.gold, fontSize: '12px' }}
                          >
                            ⭐
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: theme.colors.text.primary,
                        marginBottom: '12px',
                        lineHeight: '1.4',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {service.name}
                    </h3>

                    {/* Service Tags */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {service.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '11px',
                            background: `${colors.navy}15`,
                            color: colors.navy,
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontWeight: 'medium',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center gap-1 me-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              style={{
                                color:
                                  star <= Math.floor(service.rating)
                                    ? colors.gold
                                    : colors.gray[300],
                                fontSize: '14px',
                              }}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: theme.colors.text.primary,
                            marginRight: '8px',
                          }}
                        >
                          {service.rating}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: theme.colors.text.tertiary,
                          }}
                        >
                          ({service.reviews} reviews)
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: colors.navy,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        ⚡ {service.deliveryTime}
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: `1px solid ${theme.colors.border.light}`,
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: theme.colors.text.tertiary,
                              textDecoration: 'line-through',
                              marginBottom: '2px',
                            }}
                          >
                            {service.originalPrice}
                          </div>
                          <div
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
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
                            fontWeight: 'bold',
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
          padding: '80px 20px',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: theme.colors.text.primary,
                marginBottom: '1rem',
              }}
            >
              Browse by Category
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
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
              <div key={category.slug} className="col-md-6 col-lg-3">
                <BrandCard
                  variant="navy-outline"
                  size="lg"
                  style={{
                    height: '100%',
                    cursor: 'pointer',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() =>
                    (window.location.href = `/shop?category=${category.slug}`)
                  }
                >
                  {category.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary,
                      }}
                    />
                  )}

                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {category.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {category.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.colors.text.tertiary,
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                    }}
                  >
                    {category.description}
                  </p>

                  <div
                    style={{
                      fontSize: '14px',
                      color: theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    {category.serviceCount} services available
                  </div>
                </BrandCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <div className="text-center">
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: theme.colors.text.primary,
                marginBottom: '3rem',
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
                        marginBottom: '1rem',
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: theme.colors.primary,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {stat.title}
                    </div>
                    <div
                      style={{
                        fontSize: '1rem',
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
  );
}
