'use client';

import React from 'react';
import { BrandButton, BrandCard } from '@mahardika/ui';

// Sample shop data
const shopCategories = [
  {
    slug: 'insurance-packages',
    name: 'Insurance Packages',
    description:
      'Comprehensive insurance solutions for individuals and businesses',
    icon: '🛡️',
    productCount: 12,
    featured: true,
  },
  {
    slug: 'financial-services',
    name: 'Financial Services',
    description: 'Investment and financial planning services',
    icon: '💰',
    productCount: 8,
    featured: true,
  },
  {
    slug: 'business-solutions',
    name: 'Business Solutions',
    description: 'Enterprise insurance and risk management',
    icon: '🏢',
    productCount: 15,
    featured: false,
  },
  {
    slug: 'personal-protection',
    name: 'Personal Protection',
    description: 'Individual and family protection plans',
    icon: '👨‍👩‍👧‍👦',
    productCount: 6,
    featured: true,
  },
];

const featuredProducts = [
  {
    slug: 'comprehensive-health-insurance',
    name: 'Comprehensive Health Insurance',
    price: 'From $89/month',
    description: 'Complete health coverage for you and your family',
    category: 'insurance-packages',
    image: '🏥',
    badge: 'Most Popular',
  },
  {
    slug: 'business-liability-protection',
    name: 'Business Liability Protection',
    price: 'From $199/month',
    description: 'Protect your business from unexpected risks',
    category: 'business-solutions',
    image: '🏢',
    badge: 'Best Value',
  },
  {
    slug: 'investment-portfolio-management',
    name: 'Investment Portfolio Management',
    price: 'From $299/month',
    description: 'Professional investment management services',
    category: 'financial-services',
    image: '📈',
    badge: 'Premium',
  },
];

const ShopIndexPage = () => {
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container my-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: '#0D1B2A' }}>
            Mahardika Shop
          </h1>
          <p className="lead" style={{ color: '#6C757D' }}>
            Discover our comprehensive range of insurance and financial services
          </p>
          <div
            className="d-inline-block px-4 py-2 rounded-pill"
            style={{
              backgroundColor: 'rgba(244, 180, 0, 0.1)',
              border: '1px solid #F4B400',
            }}
          >
            <span style={{ color: '#0D1B2A', fontWeight: 'bold' }}>
              🛡️ Trusted • 💰 Affordable • 🏆 Award-Winning
            </span>
          </div>
        </div>

        {/* Featured Products */}
        <section className="mb-5">
          <BrandCard variant="navy-primary" size="lg" className="mb-4">
            <h2 className="h3 mb-4 text-white">⭐ Featured Products</h2>
            <div className="row g-4">
              {featuredProducts.map((product, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm position-relative"
                    style={{
                      borderRadius: '0.5rem',
                      border: '2px solid #F4B400',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    {product.badge && (
                      <div
                        className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded"
                        style={{
                          backgroundColor: '#F4B400',
                          color: '#0D1B2A',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          zIndex: 1,
                        }}
                      >
                        {product.badge}
                      </div>
                    )}
                    <div className="card-body p-4">
                      <div
                        className="text-center mb-3"
                        style={{ fontSize: '3rem' }}
                      >
                        {product.image}
                      </div>
                      <h5
                        className="card-title mb-2"
                        style={{ color: '#0D1B2A' }}
                      >
                        {product.name}
                      </h5>
                      <p
                        className="card-text text-muted mb-3 small"
                        style={{ lineHeight: '1.4' }}
                      >
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className="fw-bold"
                          style={{ color: '#0D1B2A', fontSize: '1.1rem' }}
                        >
                          {product.price}
                        </span>
                        <BrandButton
                          variant="gold"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/shop/${product.slug}`)
                          }
                        >
                          Get Quote
                        </BrandButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BrandCard>
        </section>

        {/* Categories Grid */}
        <section className="mb-5">
          <div className="row mb-4">
            <div className="col">
              <h2 className="h3 mb-3" style={{ color: '#0D1B2A' }}>
                🏪 Shop by Category
              </h2>
              <p className="text-muted">
                Browse our comprehensive range of insurance and financial
                services
              </p>
            </div>
          </div>

          <div className="row g-4">
            {shopCategories.map((category, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <BrandCard
                  variant={category.featured ? 'navy-outline' : 'default'}
                  size="md"
                  className="h-100 text-center position-relative"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() =>
                    (window.location.href = `/shop?category=${category.slug}`)
                  }
                >
                  {category.featured && (
                    <div
                      className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded"
                      style={{
                        backgroundColor: '#F4B400',
                        color: '#0D1B2A',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                      }}
                    >
                      Featured
                    </div>
                  )}

                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                    {category.icon}
                  </div>

                  <h5 className="mb-2" style={{ color: '#0D1B2A' }}>
                    {category.name}
                  </h5>

                  <p className="text-muted mb-3 small">
                    {category.description}
                  </p>

                  <div className="mt-auto">
                    <span
                      className="badge rounded-pill mb-2"
                      style={{
                        backgroundColor: 'rgba(13, 27, 42, 0.1)',
                        color: '#0D1B2A',
                      }}
                    >
                      {category.productCount} products
                    </span>
                    <br />
                    <BrandButton variant="outline-navy" size="sm">
                      Explore →
                    </BrandButton>
                  </div>
                </BrandCard>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-5">
          <BrandCard variant="gold-primary" size="lg">
            <div className="text-center text-white">
              <h2 className="h3 mb-4">🏆 Why Choose Mahardika Shop?</h2>
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="mb-3" style={{ fontSize: '2rem' }}>
                    ⚡
                  </div>
                  <h6 className="fw-bold mb-2">Fast Processing</h6>
                  <p className="small mb-0 opacity-75">
                    Get quotes and approvals in minutes, not days
                  </p>
                </div>
                <div className="col-md-3">
                  <div className="mb-3" style={{ fontSize: '2rem' }}>
                    🛡️
                  </div>
                  <h6 className="fw-bold mb-2">Trusted Partners</h6>
                  <p className="small mb-0 opacity-75">
                    Work with vetted, licensed insurance providers
                  </p>
                </div>
                <div className="col-md-3">
                  <div className="mb-3" style={{ fontSize: '2rem' }}>
                    💰
                  </div>
                  <h6 className="fw-bold mb-2">Best Rates</h6>
                  <p className="small mb-0 opacity-75">
                    Compare multiple quotes to find the best deal
                  </p>
                </div>
                <div className="col-md-3">
                  <div className="mb-3" style={{ fontSize: '2rem' }}>
                    🎯
                  </div>
                  <h6 className="fw-bold mb-2">Expert Support</h6>
                  <p className="small mb-0 opacity-75">
                    Get help from insurance professionals 24/7
                  </p>
                </div>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div
            className="p-5 rounded"
            style={{
              backgroundColor: 'white',
              border: '2px solid #0D1B2A',
            }}
          >
            <h3 className="mb-3" style={{ color: '#0D1B2A' }}>
              Need Help Finding the Right Coverage?
            </h3>
            <p className="text-muted mb-4">
              Our insurance experts are standing by to help you choose the
              perfect plan for your needs and budget.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <BrandButton
                variant="navy"
                size="lg"
                onClick={() => (window.location.href = 'tel:+1-800-MAHARDIKA')}
              >
                📞 Call Expert
              </BrandButton>
              <BrandButton
                variant="outline-gold"
                size="lg"
                onClick={() => (window.location.href = '/agencies')}
              >
                💬 Browse Agencies
              </BrandButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopIndexPage;
