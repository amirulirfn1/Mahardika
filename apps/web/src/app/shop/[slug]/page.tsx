'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard } from '@mahardika/ui';

// Type definitions
interface Plan {
  name: string;
  price: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  role: string;
  comment: string;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
  category: string;
  image: string;
  badges?: string[];
  rating?: number;
  reviews?: number;
  description: string;
  features?: string[];
  plans?: Plan[];
  faqs?: FAQ[];
  testimonials?: Testimonial[];
  isCategory?: boolean;
  products?: string[];
}

interface SimpleProduct {
  name: string;
  price: string;
  image: string;
  description: string;
}

// Sample product database
const productDatabase: Record<string, Product> = {
  // Individual Products
  'comprehensive-health-insurance': {
    id: 'comprehensive-health-insurance',
    name: 'Comprehensive Health Insurance',
    subtitle: 'Complete Health Coverage for You and Your Family',
    price: 'From $89/month',
    originalPrice: '$120/month',
    category: 'Insurance Packages',
    image: '🏥',
    badges: ['Most Popular', 'Best Value'],
    rating: 4.8,
    reviews: 2847,
    description:
      'Our comprehensive health insurance plan provides complete medical coverage for you and your family. With nationwide network coverage, prescription benefits, and preventive care included.',
    features: [
      '✅ Nationwide network of doctors and hospitals',
      '✅ Prescription drug coverage included',
      '✅ Preventive care and wellness programs',
      '✅ Emergency and urgent care coverage',
      '✅ Mental health and substance abuse coverage',
      '✅ No waiting period for accidents',
      '✅ 24/7 telemedicine consultations',
      '✅ Dental and vision add-ons available',
    ],
    plans: [
      {
        name: 'Individual',
        price: '$89/month',
        description: 'Perfect for single coverage',
      },
      {
        name: 'Family (2 adults)',
        price: '$159/month',
        description: 'Coverage for couples',
      },
      {
        name: 'Family (with children)',
        price: '$229/month',
        description: 'Complete family protection',
      },
    ],
    faqs: [
      {
        question: 'What is the waiting period?',
        answer:
          'There is no waiting period for accidents. For pre-existing conditions, the waiting period is 12 months.',
      },
      {
        question: 'Are prescription drugs covered?',
        answer:
          'Yes, prescription drugs are covered with a $10 copay for generic drugs and $25 for brand name drugs.',
      },
      {
        question: 'Can I choose my own doctor?',
        answer:
          'Yes, you can choose any doctor within our extensive network of healthcare providers.',
      },
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Marketing Manager',
        comment:
          'Excellent coverage and customer service. The claims process was seamless.',
        rating: 5,
      },
      {
        name: 'Michael Chen',
        role: 'Small Business Owner',
        comment:
          'Great value for money. The family plan covers everything we need.',
        rating: 5,
      },
    ],
  },
  'business-liability-protection': {
    id: 'business-liability-protection',
    name: 'Business Liability Protection',
    subtitle: 'Comprehensive Protection for Your Business',
    price: 'From $199/month',
    originalPrice: '$299/month',
    category: 'Business Solutions',
    image: '🏢',
    badges: ['Best Value', 'Recommended'],
    rating: 4.9,
    reviews: 1523,
    description:
      'Protect your business from unexpected risks with our comprehensive liability protection. Covers general liability, professional liability, and cyber security protection.',
    features: [
      '✅ General liability coverage up to $2M',
      '✅ Professional liability protection',
      '✅ Cyber security and data breach coverage',
      '✅ Employment practices liability',
      '✅ Commercial property protection',
      '✅ Business interruption coverage',
      '✅ Equipment and inventory protection',
      '✅ Legal defense cost coverage',
    ],
    plans: [
      {
        name: 'Small Business',
        price: '$199/month',
        description: 'For businesses with 1-10 employees',
      },
      {
        name: 'Medium Business',
        price: '$399/month',
        description: 'For businesses with 11-50 employees',
      },
      {
        name: 'Enterprise',
        price: '$799/month',
        description: 'For large businesses with 50+ employees',
      },
    ],
    faqs: [
      {
        question: 'What does general liability cover?',
        answer:
          'General liability covers bodily injury, property damage, and personal injury claims against your business.',
      },
      {
        question: 'Is cyber security coverage included?',
        answer:
          'Yes, all plans include cyber security coverage for data breaches and cyber attacks.',
      },
    ],
    testimonials: [
      {
        name: 'David Rodriguez',
        role: 'Restaurant Owner',
        comment:
          'This insurance saved my business when we had a customer injury claim.',
        rating: 5,
      },
    ],
  },
  'investment-portfolio-management': {
    id: 'investment-portfolio-management',
    name: 'Investment Portfolio Management',
    subtitle: 'Professional Investment Management Services',
    price: 'From $299/month',
    originalPrice: '$399/month',
    category: 'Financial Services',
    image: '📈',
    badges: ['Premium', 'Expert Managed'],
    rating: 4.7,
    reviews: 892,
    description:
      'Let our certified financial advisors manage your investment portfolio with personalized strategies designed to maximize returns while managing risk.',
    features: [
      '✅ Certified financial advisor assigned',
      '✅ Personalized investment strategy',
      '✅ Monthly portfolio reviews',
      '✅ Risk assessment and management',
      '✅ Tax-optimized investing',
      '✅ Retirement planning included',
      '✅ Real-time portfolio tracking',
      '✅ Quarterly performance reports',
    ],
    plans: [
      {
        name: 'Starter Portfolio',
        price: '$299/month',
        description: 'For portfolios up to $100K',
      },
      {
        name: 'Growth Portfolio',
        price: '$599/month',
        description: 'For portfolios $100K-$500K',
      },
      {
        name: 'Premium Portfolio',
        price: '$999/month',
        description: 'For portfolios $500K+',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum investment?',
        answer:
          'The minimum investment to start is $10,000 for the Starter Portfolio plan.',
      },
      {
        question: 'How often do you review my portfolio?',
        answer:
          'We review your portfolio monthly and provide quarterly detailed reports.',
      },
    ],
    testimonials: [
      {
        name: 'Jennifer Kim',
        role: 'Software Engineer',
        comment:
          'My portfolio has grown 18% this year with their professional management.',
        rating: 5,
      },
    ],
  },

  // Category Pages
  'insurance-packages': {
    id: 'insurance-packages',
    name: 'Insurance Packages',
    subtitle: 'Comprehensive Insurance Solutions for Every Need',
    image: '🛡️',
    category: 'Category',
    description:
      'Explore our wide range of insurance packages designed to protect you, your family, and your business from unexpected risks.',
    isCategory: true,
    products: [
      'comprehensive-health-insurance',
      'auto-insurance-premium',
      'homeowners-protection',
      'life-insurance-term',
    ],
  },
  'financial-services': {
    id: 'financial-services',
    name: 'Financial Services',
    subtitle: 'Professional Financial Planning and Investment Services',
    image: '💰',
    category: 'Category',
    description:
      'Grow your wealth with our professional financial services including investment management, retirement planning, and financial consulting.',
    isCategory: true,
    products: [
      'investment-portfolio-management',
      'retirement-planning-401k',
      'financial-consulting',
      'tax-planning-services',
    ],
  },
  'business-solutions': {
    id: 'business-solutions',
    name: 'Business Solutions',
    subtitle: 'Enterprise Insurance and Risk Management',
    image: '🏢',
    category: 'Category',
    description:
      'Protect your business with our comprehensive enterprise solutions including liability protection, cyber security, and risk management.',
    isCategory: true,
    products: [
      'business-liability-protection',
      'cyber-security-insurance',
      'workers-compensation',
      'commercial-property-insurance',
    ],
  },
  'personal-protection': {
    id: 'personal-protection',
    name: 'Personal Protection',
    subtitle: 'Individual and Family Protection Plans',
    image: '👨‍👩‍👧‍👦',
    category: 'Category',
    description:
      "Safeguard your family's future with our personal protection plans including life insurance, disability coverage, and emergency funds.",
    isCategory: true,
    products: [
      'life-insurance-whole',
      'disability-insurance',
      'emergency-fund-protection',
      'identity-theft-protection',
    ],
  },
};

// Additional sample products for categories
const additionalProducts: Record<string, SimpleProduct> = {
  'auto-insurance-premium': {
    name: 'Premium Auto Insurance',
    price: 'From $129/month',
    image: '🚗',
    description: 'Comprehensive auto coverage with roadside assistance',
  },
  'homeowners-protection': {
    name: 'Homeowners Protection',
    price: 'From $89/month',
    image: '🏠',
    description: 'Complete home and property protection',
  },
  'life-insurance-term': {
    name: 'Term Life Insurance',
    price: 'From $39/month',
    image: '🛡️',
    description: 'Affordable term life insurance coverage',
  },
  'retirement-planning-401k': {
    name: '401(k) Planning',
    price: 'From $99/month',
    image: '🏦',
    description: 'Professional 401(k) management and planning',
  },
  'financial-consulting': {
    name: 'Financial Consulting',
    price: 'From $199/hour',
    image: '💼',
    description: 'One-on-one financial advisory services',
  },
  'tax-planning-services': {
    name: 'Tax Planning',
    price: 'From $299/year',
    image: '📊',
    description: 'Strategic tax planning and optimization',
  },
  'cyber-security-insurance': {
    name: 'Cyber Security Insurance',
    price: 'From $149/month',
    image: '🔒',
    description: 'Protection against cyber threats and data breaches',
  },
  'workers-compensation': {
    name: 'Workers Compensation',
    price: 'From $79/month',
    image: '👷',
    description: 'Employee injury and disability coverage',
  },
  'commercial-property-insurance': {
    name: 'Commercial Property',
    price: 'From $199/month',
    image: '🏭',
    description: 'Business property and equipment protection',
  },
  'life-insurance-whole': {
    name: 'Whole Life Insurance',
    price: 'From $159/month',
    image: '💎',
    description: 'Permanent life insurance with cash value',
  },
  'disability-insurance': {
    name: 'Disability Insurance',
    price: 'From $69/month',
    image: '🦽',
    description: 'Income protection for disability situations',
  },
  'emergency-fund-protection': {
    name: 'Emergency Fund Protection',
    price: 'From $49/month',
    image: '🚨',
    description: 'Emergency fund building and protection',
  },
  'identity-theft-protection': {
    name: 'Identity Theft Protection',
    price: 'From $29/month',
    image: '🛡️',
    description: 'Complete identity monitoring and protection',
  },
};

interface ShopPageProps {
  params: {
    slug: string;
  };
}

const ShopPage: React.FC<ShopPageProps> = ({ params }) => {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { slug } = params;
  const product = productDatabase[slug as keyof typeof productDatabase];

  // Handle 404 for non-existent products
  if (!product) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <BrandCard variant="navy-outline" size="lg" className="text-center">
          <div style={{ fontSize: '4rem', color: '#F4B400' }}>🔍</div>
          <h1 className="h3 mb-3" style={{ color: '#0D1B2A' }}>
            Product Not Found
          </h1>
          <p style={{ color: '#6C757D' }} className="mb-4">
            The product you're looking for doesn't exist or has been moved.
          </p>
          <BrandButton
            variant="navy"
            size="lg"
            onClick={() => (window.location.href = '/shop')}
          >
            Back to Shop
          </BrandButton>
        </BrandCard>
      </div>
    );
  }

  // Category page rendering
  if (product.isCategory) {
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
            <a className="navbar-brand fw-bold text-white" href="/shop">
              Mahardika Shop
            </a>
            <div className="navbar-nav ms-auto">
              <a className="nav-link text-white" href="/shop">
                ← Back to Shop
              </a>
            </div>
          </div>
        </nav>

        <div className="container my-5">
          {/* Category Header */}
          <div className="text-center mb-5">
            <div style={{ fontSize: '4rem' }}>{product.image}</div>
            <h1 className="display-4 fw-bold" style={{ color: '#0D1B2A' }}>
              {product.name}
            </h1>
            <p className="lead" style={{ color: '#6C757D' }}>
              {product.subtitle}
            </p>
            <p
              style={{ color: '#343A40', maxWidth: '600px', margin: '0 auto' }}
            >
              {product.description}
            </p>
          </div>

          {/* Category Products */}
          <div className="row g-4">
            {product.products?.map(productId => {
              const categoryProduct =
                productDatabase[productId as keyof typeof productDatabase] ||
                additionalProducts[
                  productId as keyof typeof additionalProducts
                ];
              return (
                <div key={productId} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      borderRadius: '0.5rem',
                      border: '2px solid #F4B400',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    <div className="card-body p-4">
                      <div
                        className="text-center mb-3"
                        style={{ fontSize: '3rem' }}
                      >
                        {categoryProduct?.image || '📦'}
                      </div>
                      <h5
                        className="card-title mb-2"
                        style={{ color: '#0D1B2A' }}
                      >
                        {categoryProduct?.name || 'Product Name'}
                      </h5>
                      <p
                        className="card-text mb-3"
                        style={{ color: '#6C757D' }}
                      >
                        {categoryProduct?.description || 'Product description'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="fw-bold"
                          style={{ color: '#F4B400', fontSize: '1.1rem' }}
                        >
                          {categoryProduct?.price || 'Contact for pricing'}
                        </span>
                      </div>
                      <BrandButton
                        variant="navy"
                        size="md"
                        className="w-100"
                        onClick={() =>
                          (window.location.href = `/shop/${productId}`)
                        }
                      >
                        View Details
                      </BrandButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Individual product page rendering
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
          <a className="navbar-brand fw-bold text-white" href="/shop">
            Mahardika Shop
          </a>
          <div className="navbar-nav ms-auto">
            <a className="nav-link text-white" href="/shop">
              ← Back to Shop
            </a>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        {/* Product Header */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <div className="text-center mb-4">
              <div style={{ fontSize: '8rem', lineHeight: '1' }}>
                {product.image}
              </div>
              {product.badges && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                  {product.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: '#F4B400',
                        color: '#0D1B2A',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-2">
              <small
                style={{
                  color: '#F4B400',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                {product.category}
              </small>
            </div>
            <h1 className="h2 fw-bold mb-3" style={{ color: '#0D1B2A' }}>
              {product.name}
            </h1>
            <p className="lead mb-4" style={{ color: '#6C757D' }}>
              {product.subtitle}
            </p>
            <div className="d-flex align-items-center mb-3">
              <span className="h3 fw-bold me-3" style={{ color: '#F4B400' }}>
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="d-flex align-items-center mb-4">
                <div className="me-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color:
                          i < Math.floor(product.rating!)
                            ? '#F4B400'
                            : '#e9ecef',
                        fontSize: '1.2rem',
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span style={{ color: '#0D1B2A', fontWeight: 'bold' }}>
                  {product.rating}
                </span>
                <span style={{ color: '#6C757D' }} className="ms-2">
                  ({product.reviews} reviews)
                </span>
              </div>
            )}
            <p style={{ color: '#343A40' }} className="mb-4">
              {product.description}
            </p>
            <div className="d-flex gap-3">
              <BrandButton
                variant="gold"
                size="lg"
                onClick={() => setShowQuoteForm(!showQuoteForm)}
              >
                Get Free Quote
              </BrandButton>
              <BrandButton variant="outline-navy" size="lg">
                Contact Agent
              </BrandButton>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-5">
          {/* Tab Navigation */}
          <ul className="nav nav-tabs border-0 mb-4">
            {['overview', 'plans', 'faqs', 'reviews'].map(tab => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link border-0 px-0 me-4 ${
                    activeTab === tab ? 'active' : ''
                  }`}
                  style={{
                    color: activeTab === tab ? '#F4B400' : '#6C757D',
                    borderBottom:
                      activeTab === tab ? '3px solid #F4B400' : 'none',
                    backgroundColor: 'transparent',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <BrandCard variant="navy-outline" size="lg">
                <h3 className="h4 mb-4" style={{ color: '#0D1B2A' }}>
                  Key Features
                </h3>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      {product.features
                        ?.slice(0, Math.ceil(product.features.length / 2))
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="mb-2"
                            style={{ color: '#343A40' }}
                          >
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      {product.features
                        ?.slice(Math.ceil(product.features.length / 2))
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="mb-2"
                            style={{ color: '#343A40' }}
                          >
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </BrandCard>
            )}

            {activeTab === 'plans' && (
              <div className="row g-4">
                {product.plans?.map((plan, index) => (
                  <div key={index} className="col-lg-4">
                    <BrandCard
                      variant={
                        selectedPlan === index ? 'gold-primary' : 'navy-outline'
                      }
                      size="md"
                      className="h-100 text-center cursor-pointer"
                      onClick={() => setSelectedPlan(index)}
                    >
                      <h4
                        className="h5 mb-3"
                        style={{
                          color: selectedPlan === index ? '#0D1B2A' : '#0D1B2A',
                        }}
                      >
                        {plan.name}
                      </h4>
                      <div
                        className="h3 fw-bold mb-3"
                        style={{ color: '#F4B400' }}
                      >
                        {plan.price}
                      </div>
                      <p
                        style={{
                          color: selectedPlan === index ? '#0D1B2A' : '#6C757D',
                        }}
                      >
                        {plan.description}
                      </p>
                      <BrandButton
                        variant={
                          selectedPlan === index ? 'navy' : 'outline-gold'
                        }
                        size="sm"
                        className="w-100"
                      >
                        {selectedPlan === index ? 'Selected' : 'Select Plan'}
                      </BrandButton>
                    </BrandCard>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'faqs' && (
              <BrandCard variant="navy-outline" size="lg">
                <h3 className="h4 mb-4" style={{ color: '#0D1B2A' }}>
                  Frequently Asked Questions
                </h3>
                {product.faqs?.map((faq, index) => (
                  <div key={index} className="mb-4">
                    <h5 className="h6 mb-2" style={{ color: '#0D1B2A' }}>
                      {faq.question}
                    </h5>
                    <p style={{ color: '#343A40' }}>{faq.answer}</p>
                    {index < product.faqs!.length - 1 && (
                      <hr style={{ borderColor: '#e9ecef' }} />
                    )}
                  </div>
                ))}
              </BrandCard>
            )}

            {activeTab === 'reviews' && (
              <div className="row g-4">
                {product.testimonials?.map((testimonial, index) => (
                  <div key={index} className="col-lg-6">
                    <BrandCard variant="navy-outline" size="md">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#F4B400',
                            color: '#0D1B2A',
                            fontWeight: 'bold',
                          }}
                        >
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="mb-0" style={{ color: '#0D1B2A' }}>
                            {testimonial.name}
                          </h6>
                          <small style={{ color: '#6C757D' }}>
                            {testimonial.role}
                          </small>
                        </div>
                      </div>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color:
                                i < testimonial.rating ? '#F4B400' : '#e9ecef',
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <p style={{ color: '#343A40' }}>
                        "{testimonial.comment}"
                      </p>
                    </BrandCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quote Form */}
        {showQuoteForm && (
          <BrandCard variant="navy-primary" size="lg" className="mb-5">
            <h3 className="h4 mb-4 text-white">Get Your Free Quote</h3>
            <div className="row">
              <div className="col-lg-8">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: '#F4B400',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: '#F4B400',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: '#F4B400',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: '#F4B400',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        <option>Select Plan</option>
                        {product.plans?.map((plan, index) => (
                          <option key={index} value={plan.name}>
                            {plan.name} - {plan.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Additional Information or Questions"
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: '#F4B400',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex gap-3 mt-4">
                    <BrandButton variant="gold" size="lg">
                      Get My Quote
                    </BrandButton>
                    <BrandButton
                      variant="outline-gold"
                      size="lg"
                      onClick={() => setShowQuoteForm(false)}
                    >
                      Cancel
                    </BrandButton>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="text-white">
                  <h5 className="mb-3">Why Choose Mahardika?</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">✅ 25+ years of experience</li>
                    <li className="mb-2">✅ Award-winning customer service</li>
                    <li className="mb-2">✅ Competitive rates</li>
                    <li className="mb-2">✅ Fast claim processing</li>
                    <li className="mb-2">✅ 24/7 support</li>
                  </ul>
                </div>
              </div>
            </div>
          </BrandCard>
        )}

        {/* Related Products */}
        <section className="mb-5">
          <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
            Related Products
          </h2>
          <div className="row g-4">
            {Object.values(productDatabase)
              .filter(
                p =>
                  p.category === product.category &&
                  p.id !== product.id &&
                  !p.isCategory
              )
              .slice(0, 3)
              .map((relatedProduct, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid #e9ecef',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    <div className="card-body p-4 text-center">
                      <div className="mb-3" style={{ fontSize: '3rem' }}>
                        {relatedProduct.image}
                      </div>
                      <h5
                        className="card-title mb-2"
                        style={{ color: '#0D1B2A' }}
                      >
                        {relatedProduct.name}
                      </h5>
                      <p
                        className="card-text mb-3"
                        style={{ color: '#6C757D' }}
                      >
                        {relatedProduct.subtitle}
                      </p>
                      <div className="mb-3">
                        <span className="fw-bold" style={{ color: '#F4B400' }}>
                          {relatedProduct.price}
                        </span>
                      </div>
                      <BrandButton
                        variant="outline-navy"
                        size="sm"
                        className="w-100"
                        onClick={() =>
                          (window.location.href = `/shop/${relatedProduct.id}`)
                        }
                      >
                        Learn More
                      </BrandButton>
                    </div>
                  </div>
                </div>
              ))}
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
        </footer>
      </div>
    </div>
  );
};

export default ShopPage;
