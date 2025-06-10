'use client';

import React from 'react';
import { BrandButton, BrandCard } from '../../../components/ui';

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
      {/* Navigation */}
      <nav
        className="navbar navbar-expand-lg sticky-top shadow-sm"
        style={{
          backgroundColor: '#0D1B2A',
          borderBottom: '3px solid #F4B400',
        }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/">
            Mahardika Shop
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ borderColor: '#F4B400' }}
          >
            <span
              className="navbar-toggler-icon"
              style={{ filter: 'invert(1)' }}
            />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/brand-showcase">
                  Brand Showcase
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/style-guide">
                  Style Guide
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/shop"
                  style={{ color: '#F4B400', fontWeight: 'bold' }}
                >
                  Shop
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
                        className="card-text mb-3"
                        style={{ color: '#6C757D' }}
                      >
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="fw-bold"
                          style={{ color: '#F4B400', fontSize: '1.1rem' }}
                        >
                          {product.price}
                        </span>
                        <small
                          className="text-muted"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {product.category.replace('-', ' ')}
                        </small>
                      </div>
                      <BrandButton
                        variant="navy"
                        size="md"
                        className="w-100"
                        onClick={() =>
                          (window.location.href = `/shop/${product.slug}`)
                        }
                      >
                        View Details
                      </BrandButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BrandCard>
        </section>

        {/* Categories */}
        <section className="mb-5">
          <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
            🏷️ Shop by Category
          </h2>
          <div className="row g-4">
            {shopCategories.map((category, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <BrandCard
                  variant={category.featured ? 'gold-primary' : 'navy-outline'}
                  size="md"
                  className="h-100 text-center"
                >
                  <div
                    className="mb-3"
                    style={{
                      fontSize: '3rem',
                      filter: category.featured ? 'none' : 'grayscale(0.3)',
                    }}
                  >
                    {category.icon}
                  </div>
                  <h5
                    className="mb-3"
                    style={{
                      color: category.featured ? '#0D1B2A' : '#0D1B2A',
                    }}
                  >
                    {category.name}
                  </h5>
                  <p
                    className="mb-3"
                    style={{
                      color: category.featured ? '#0D1B2A' : '#6C757D',
                      fontSize: '0.9rem',
                    }}
                  >
                    {category.description}
                  </p>
                  <div className="mb-3">
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: category.featured
                          ? 'rgba(13, 27, 42, 0.1)'
                          : 'rgba(244, 180, 0, 0.1)',
                        color: category.featured ? '#0D1B2A' : '#F4B400',
                        border: `1px solid ${
                          category.featured ? '#0D1B2A' : '#F4B400'
                        }`,
                      }}
                    >
                      {category.productCount} Products
                    </span>
                  </div>
                  <BrandButton
                    variant={category.featured ? 'navy' : 'outline-gold'}
                    size="sm"
                    className="w-100"
                    onClick={() =>
                      (window.location.href = `/shop/${category.slug}`)
                    }
                  >
                    Browse Category
                  </BrandButton>
                </BrandCard>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-5">
          <BrandCard variant="gradient" size="lg" className="text-center">
            <h2 className="h3 mb-3 text-white">🚀 Ready to Get Protected?</h2>
            <p className="lead text-white mb-4">
              Join thousands of satisfied customers who trust Mahardika for
              their insurance and financial needs
            </p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <BrandButton variant="gold" size="lg">
                    Get Free Quote
                  </BrandButton>
                  <BrandButton variant="outline-gold" size="lg">
                    Contact Us
                  </BrandButton>
                  <BrandButton variant="outline-navy" size="lg">
                    Learn More
                  </BrandButton>
                </div>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* Benefits */}
        <section className="mb-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{ fontSize: '3rem', color: '#F4B400' }}
                >
                  🏆
                </div>
                <h5 style={{ color: '#0D1B2A' }}>Award-Winning Service</h5>
                <p style={{ color: '#6C757D' }}>
                  Recognized industry leader with 25+ years of excellence
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{ fontSize: '3rem', color: '#F4B400' }}
                >
                  🛡️
                </div>
                <h5 style={{ color: '#0D1B2A' }}>Comprehensive Coverage</h5>
                <p style={{ color: '#6C757D' }}>
                  Complete protection plans tailored to your specific needs
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{ fontSize: '3rem', color: '#F4B400' }}
                >
                  💝
                </div>
                <h5 style={{ color: '#0D1B2A' }}>24/7 Support</h5>
                <p style={{ color: '#6C757D' }}>
                  Round-the-clock customer service and claims assistance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="text-center py-4"
          style={{ borderTop: '2px solid #F4B400' }}
        >
          <p style={{ color: '#6C757D' }} className="mb-0">
            Mahardika Shop • Trusted Insurance & Financial Services
          </p>
          <p style={{ color: '#6C757D' }} className="mb-0 small">
            Building financial security with Navy #0D1B2A and Gold #F4B400
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ShopIndexPage;
