'use client';

import React from 'react';
import { Button, Card } from '@mahardika/ui';
import { theme } from '@mahardika/ui';

// Sample shop data with Fiverr-style categories
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
  {
    slug: 'writing-translation',
    name: 'Writing & Translation',
    description: 'Content writing, copywriting, and translation services',
    icon: '✍️',
    serviceCount: 54,
    featured: false,
  },
  {
    slug: 'video-animation',
    name: 'Video & Animation',
    description: 'Video editing, animation, and motion graphics',
    icon: '🎬',
    serviceCount: 67,
    featured: false,
  },
];

const featuredServices = [
  {
    slug: 'premium-logo-design',
    name: 'Professional Logo Design',
    seller: 'DesignPro',
    sellerLevel: 'Top Rated',
    price: 'From $99',
    originalPrice: '$149',
    description: 'I will create a modern, professional logo for your business',
    category: 'design-creative',
    image: '🎨',
    rating: 4.9,
    reviews: 127,
    deliveryTime: '3 days',
    badge: 'Best Seller',
  },
  {
    slug: 'full-stack-web-app',
    name: 'Full-Stack Web Application',
    seller: 'CodeMaster',
    sellerLevel: 'Level 2',
    price: 'From $299',
    originalPrice: '$399',
    description:
      'I will develop a complete web application with modern tech stack',
    category: 'programming-tech',
    image: '💻',
    rating: 4.8,
    reviews: 89,
    deliveryTime: '7 days',
    badge: 'Premium',
  },
  {
    slug: 'seo-optimization',
    name: 'Complete SEO Optimization',
    seller: 'SEOExpert',
    sellerLevel: 'Top Rated',
    price: 'From $149',
    originalPrice: '$199',
    description: 'I will optimize your website for top search engine rankings',
    category: 'digital-marketing',
    image: '📈',
    rating: 4.9,
    reviews: 203,
    deliveryTime: '5 days',
    badge: 'Hot',
  },
];

const ShopIndexPage = () => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.primary,
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: `${theme.spacing[12]} ${theme.spacing[4]} ${theme.spacing[16]}`,
          background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)`,
          borderBottom: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <div className="container">
          <div className="text-center">
            <h1
              style={{
                fontSize: theme.typography.fontSize['5xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
                fontFamily: theme.typography.fontFamily.heading,
              }}
            >
              Find services for your{' '}
              <span
                style={{
                  background: theme.colors.background.gradient,
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
                marginBottom: theme.spacing[8],
                maxWidth: '600px',
                margin: `0 auto ${theme.spacing[8]}`,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              Browse thousands of services from top-rated professionals around
              the world
            </p>

            {/* Search Bar */}
            <div
              className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center"
              style={{ maxWidth: '600px', margin: '0 auto' }}
            >
              <div style={{ flex: 1, width: '100%' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What service are you looking for?"
                  style={{
                    padding: theme.spacing[4],
                    fontSize: theme.typography.fontSize.base,
                    borderRadius: theme.borderRadius.lg,
                    border: `2px solid ${theme.colors.border.light}`,
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.body,
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.hover.overlay}`;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = theme.colors.border.light;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <Button variant="primary" size="lg" style={{ minWidth: '120px' }}>
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4">
              <span
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                  marginRight: theme.spacing[2],
                }}
              >
                Popular:
              </span>
              {['Logo Design', 'WordPress', 'SEO', 'Social Media'].map(
                (term, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                      marginRight: theme.spacing[2],
                      marginBottom: theme.spacing[2],
                      backgroundColor: theme.colors.background.primary,
                      color: theme.colors.text.secondary,
                      border: `1px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.full,
                      fontSize: theme.typography.fontSize.sm,
                      cursor: 'pointer',
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
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-8">
            <div>
              <h2
                style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[2],
                }}
              >
                Featured Services
              </h2>
              <p
                style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  margin: 0,
                }}
              >
                Hand-picked by our team
              </p>
            </div>
            <Button variant="outline" size="md">
              View All
            </Button>
          </div>

          <div className="row g-4">
            {featuredServices.map((service, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <Card
                  variant="default"
                  size="md"
                  hoverable={true}
                  style={{
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() =>
                    (window.location.href = `/shop/${service.slug}`)
                  }
                >
                  {service.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: theme.spacing[3],
                        left: theme.spacing[3],
                        backgroundColor:
                          service.badge === 'Best Seller'
                            ? theme.colors.primary
                            : service.badge === 'Premium'
                              ? theme.colors.secondary
                              : theme.colors.error,
                        color: 'white',
                        padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        zIndex: 1,
                      }}
                    >
                      {service.badge}
                    </div>
                  )}

                  {/* Service Image */}
                  <div
                    style={{
                      height: '160px',
                      backgroundColor: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      marginBottom: theme.spacing[4],
                    }}
                  >
                    {service.image}
                  </div>

                  {/* Seller Info */}
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        marginRight: theme.spacing[2],
                      }}
                    >
                      {service.seller.charAt(0)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {service.seller}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.tertiary,
                        }}
                      >
                        {service.sellerLevel}
                      </div>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3
                    style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[2],
                      lineHeight: theme.typography.lineHeight.tight,
                    }}
                  >
                    {service.name}
                  </h3>

                  {/* Rating & Reviews */}
                  <div className="d-flex align-items-center mb-3">
                    <span
                      style={{
                        color: '#FFD700',
                        marginRight: theme.spacing[1],
                      }}
                    >
                      ★
                    </span>
                    <span
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginRight: theme.spacing[2],
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
                      ({service.reviews})
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    <div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.tertiary,
                          textDecoration: 'line-through',
                        }}
                      >
                        {service.originalPrice}
                      </div>
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
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.tertiary,
                      }}
                    >
                      ⏱️ {service.deliveryTime}
                    </div>
                  </div>
                </Card>
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
              <div key={index} className="col-md-6 col-lg-4">
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
                <div key={index} className="col-md-6 col-lg-3">
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
  );
};

export default ShopIndexPage;
