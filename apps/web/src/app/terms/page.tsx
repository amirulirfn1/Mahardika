'use client';

import React from 'react';
import { BrandButton, BrandCard } from '@mahardika/ui';

const TermsOfServicePage = () => {
  const termsData = {
    lastUpdated: 'December 15, 2024',
    effectiveDate: 'January 1, 2024',
    companyName: 'Mahardika Insurance & Financial Services',
    contactEmail: 'legal@mahardika.com',
    contactPhone: '+1 (555) 123-4567',
    website: 'www.mahardika.com',
  };

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using Mahardika Insurance & Financial Services ("Mahardika," "we," "us," or "our") website, mobile applications, and services, you agree to be bound by these Terms of Service ("Terms").',
        'If you do not agree to these Terms, please do not use our services. These Terms constitute a legally binding agreement between you and Mahardika.',
        'We reserve the right to modify these Terms at any time. Your continued use of our services after changes indicates your acceptance of the modified Terms.',
      ],
    },
    {
      title: '2. Description of Services',
      content: [
        'Mahardika provides comprehensive insurance solutions, financial planning services, investment management, and related financial products.',
        'Our services include but are not limited to: health insurance, business liability protection, investment portfolio management, retirement planning, and financial consulting.',
        'All services are subject to applicable laws, regulations, and licensing requirements in your jurisdiction.',
        'We reserve the right to modify, suspend, or discontinue any service at any time with or without notice.',
      ],
    },
    {
      title: '3. User Responsibilities',
      content: [
        'You must provide accurate, current, and complete information when using our services.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to notify us immediately of any unauthorized use of your account.',
        'You must be at least 18 years old to use our services or have parental consent.',
        'You agree not to use our services for any unlawful or prohibited activities.',
      ],
    },
    {
      title: '4. Privacy and Data Protection',
      content: [
        'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.',
        'By using our services, you consent to the collection and use of information as described in our Privacy Policy.',
        'We implement industry-standard security measures to protect your personal and financial information.',
        'We may share information with third parties as necessary to provide services, comply with legal requirements, or protect our rights.',
      ],
    },
    {
      title: '5. Financial Services Disclaimers',
      content: [
        'Insurance products and financial services are subject to underwriting approval and regulatory requirements.',
        'Past performance does not guarantee future results for investment products.',
        'All investment products carry risk, including potential loss of principal.',
        'Insurance coverage is subject to policy terms, conditions, and exclusions.',
        'We recommend consulting with qualified professionals for personalized financial advice.',
      ],
    },
    {
      title: '6. Intellectual Property',
      content: [
        'All content, trademarks, service marks, logos, and intellectual property on our platform are owned by or licensed to Mahardika.',
        'You may not reproduce, distribute, modify, or create derivative works without our written permission.',
        'The Mahardika brand colors (Navy #0D1B2A and Gold #F4B400) and design elements are proprietary to Mahardika.',
        'Any feedback or suggestions you provide may be used by us without compensation or attribution.',
      ],
    },
    {
      title: '7. Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, Mahardika shall not be liable for any indirect, incidental, special, or consequential damages.',
        'Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.',
        'We do not warrant that our services will be uninterrupted, error-free, or completely secure.',
        'You acknowledge that insurance and financial services involve inherent risks and uncertainties.',
      ],
    },
    {
      title: '8. Indemnification',
      content: [
        'You agree to indemnify and hold harmless Mahardika, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services.',
        'This includes, but is not limited to, any violations of these Terms, applicable laws, or third-party rights.',
        'You are responsible for any losses resulting from unauthorized use of your account.',
      ],
    },
    {
      title: '9. Governing Law and Dispute Resolution',
      content: [
        'These Terms are governed by the laws of [Your State/Country] without regard to conflict of law principles.',
        'Any disputes arising from these Terms or our services shall be resolved through binding arbitration.',
        'Arbitration proceedings shall be conducted in accordance with the rules of the American Arbitration Association.',
        'You waive any right to participate in class action lawsuits or class-wide arbitrations.',
      ],
    },
    {
      title: '10. Contact Information',
      content: [
        'If you have questions about these Terms of Service, please contact us:',
        `Email: ${termsData.contactEmail}`,
        `Phone: ${termsData.contactPhone}`,
        `Website: ${termsData.website}`,
        'Mailing Address: Mahardika Insurance & Financial Services, 123 Financial District, Suite 456, Business City, BC 12345',
      ],
    },
  ];

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
            Mahardika Legal
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
                <a className="nav-link text-white" href="/shop">
                  Shop
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
                  href="/terms"
                  style={{ color: '#F4B400', fontWeight: 'bold' }}
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        {/* Header */}
        <div className="text-center mb-5">
          <BrandCard variant="navy-primary" size="lg" className="mb-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold text-white mb-3">
                  📋 Terms of Service
                </h1>
                <p className="lead text-white mb-0">
                  Legal terms and conditions governing the use of Mahardika
                  services
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div
                  className="d-inline-block px-4 py-3 text-center"
                  style={{
                    backgroundColor: 'rgba(244, 180, 0, 0.2)',
                    borderRadius: '0.5rem',
                    border: '2px solid #F4B400',
                  }}
                >
                  <div
                    style={{
                      color: '#F4B400',
                      fontSize: '2rem',
                      lineHeight: '1',
                    }}
                  >
                    ⚖️
                  </div>
                  <div className="text-white mt-2">
                    <small className="d-block">Last Updated</small>
                    <strong>{termsData.lastUpdated}</strong>
                  </div>
                </div>
              </div>
            </div>
          </BrandCard>

          {/* Important Notice */}
          <BrandCard variant="gold-outline" size="md" className="mb-4">
            <div className="d-flex align-items-start">
              <div
                style={{
                  fontSize: '2rem',
                  color: '#F4B400',
                  marginRight: '1rem',
                }}
              >
                ⚠️
              </div>
              <div className="text-start">
                <h5 className="mb-2" style={{ color: '#0D1B2A' }}>
                  Important Legal Notice
                </h5>
                <p style={{ color: '#343A40' }} className="mb-3">
                  Please read these Terms of Service carefully before using our
                  services. By accessing or using any part of Mahardika
                  services, you agree to be bound by these terms.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span
                    className="badge px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(13, 27, 42, 0.1)',
                      color: '#0D1B2A',
                      borderRadius: '0.5rem',
                      border: '1px solid #0D1B2A',
                    }}
                  >
                    Effective: {termsData.effectiveDate}
                  </span>
                  <span
                    className="badge px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(244, 180, 0, 0.1)',
                      color: '#F4B400',
                      borderRadius: '0.5rem',
                      border: '1px solid #F4B400',
                    }}
                  >
                    Legally Binding
                  </span>
                  <span
                    className="badge px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(13, 27, 42, 0.1)',
                      color: '#0D1B2A',
                      borderRadius: '0.5rem',
                      border: '1px solid #0D1B2A',
                    }}
                  >
                    Financial Services
                  </span>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>

        {/* Table of Contents */}
        <BrandCard variant="navy-outline" size="lg" className="mb-5">
          <h2 className="h4 mb-4" style={{ color: '#0D1B2A' }}>
            📑 Table of Contents
          </h2>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                {sections.slice(0, 5).map((section, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href={`#section-${index + 1}`}
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span
                        className="me-2"
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#F4B400',
                          borderRadius: '50%',
                          fontSize: '12px',
                          lineHeight: '20px',
                          textAlign: 'center',
                          color: '#0D1B2A',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                {sections.slice(5).map((section, index) => (
                  <li key={index + 5} className="mb-2">
                    <a
                      href={`#section-${index + 6}`}
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span
                        className="me-2"
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#F4B400',
                          borderRadius: '50%',
                          fontSize: '12px',
                          lineHeight: '20px',
                          textAlign: 'center',
                          color: '#0D1B2A',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 6}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BrandCard>

        {/* Terms Sections */}
        <div className="row">
          <div className="col-lg-8">
            {sections.map((section, index) => (
              <BrandCard
                key={index}
                variant="navy-outline"
                size="lg"
                className="mb-4"
                id={`section-${index + 1}`}
              >
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#F4B400',
                      borderRadius: '0.5rem',
                      color: '#0D1B2A',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow-1">
                    <h2 className="h4 mb-3" style={{ color: '#0D1B2A' }}>
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="ms-5">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      style={{
                        color: '#343A40',
                        lineHeight: '1.7',
                        marginBottom: '1rem',
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </BrandCard>
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              {/* Quick Contact */}
              <BrandCard variant="gold-primary" size="md" className="mb-4">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  📞 Need Legal Help?
                </h3>
                <p style={{ color: '#0D1B2A' }} className="mb-3">
                  Have questions about our Terms of Service? Contact our legal
                  team for assistance.
                </p>
                <div className="d-grid gap-2">
                  <BrandButton variant="navy" size="sm">
                    Contact Legal Team
                  </BrandButton>
                  <BrandButton variant="outline-navy" size="sm">
                    Download PDF
                  </BrandButton>
                </div>
              </BrandCard>

              {/* Related Documents */}
              <BrandCard variant="navy-outline" size="md" className="mb-4">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  📄 Related Documents
                </h3>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a
                      href="/privacy"
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span className="me-2" style={{ color: '#F4B400' }}>
                        🔒
                      </span>
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="/cookies"
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span className="me-2" style={{ color: '#F4B400' }}>
                        🍪
                      </span>
                      Cookie Policy
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="/compliance"
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span className="me-2" style={{ color: '#F4B400' }}>
                        ✅
                      </span>
                      Compliance Guide
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="/security"
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: '#0D1B2A' }}
                    >
                      <span className="me-2" style={{ color: '#F4B400' }}>
                        🛡️
                      </span>
                      Security Policy
                    </a>
                  </li>
                </ul>
              </BrandCard>

              {/* Company Information */}
              <BrandCard variant="gradient" size="md" className="mb-4">
                <h3 className="h5 mb-3 text-white">🏢 Company Information</h3>
                <div className="text-white">
                  <p className="mb-2">
                    <strong>{termsData.companyName}</strong>
                  </p>
                  <p className="mb-1">
                    <small>📧 {termsData.contactEmail}</small>
                  </p>
                  <p className="mb-1">
                    <small>📞 {termsData.contactPhone}</small>
                  </p>
                  <p className="mb-0">
                    <small>🌐 {termsData.website}</small>
                  </p>
                </div>
              </BrandCard>

              {/* Legal Notice */}
              <BrandCard variant="navy-outline" size="md">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: '2rem',
                      color: '#F4B400',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ⚖️
                  </div>
                  <h4 className="h6 mb-2" style={{ color: '#0D1B2A' }}>
                    Professional Legal Advice
                  </h4>
                  <p style={{ color: '#6C757D', fontSize: '0.9rem' }}>
                    This document provides general information. For specific
                    legal questions, please consult with a qualified attorney.
                  </p>
                </div>
              </BrandCard>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5">
          <BrandCard variant="navy-primary" size="lg" className="text-center">
            <h2 className="h3 mb-3 text-white">
              ✅ Ready to Get Started with Mahardika?
            </h2>
            <p className="lead text-white mb-4">
              By proceeding, you acknowledge that you have read, understood, and
              agree to these Terms of Service
            </p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <BrandButton variant="gold" size="lg">
                    I Accept Terms
                  </BrandButton>
                  <BrandButton variant="outline-gold" size="lg">
                    Browse Services
                  </BrandButton>
                  <BrandButton variant="outline-navy" size="lg">
                    Contact Legal
                  </BrandButton>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>

        {/* Legal Footer */}
        <footer
          className="mt-5 pt-4"
          style={{ borderTop: '2px solid #F4B400' }}
        >
          <div className="row">
            <div className="col-md-8">
              <p style={{ color: '#6C757D' }} className="mb-2">
                <strong style={{ color: '#0D1B2A' }}>
                  {termsData.companyName}
                </strong>{' '}
                • Terms of Service
              </p>
              <p style={{ color: '#6C757D' }} className="mb-2 small">
                Last updated: {termsData.lastUpdated} • Effective date:{' '}
                {termsData.effectiveDate}
              </p>
              <p style={{ color: '#6C757D' }} className="mb-0 small">
                Built with Mahardika brand colors: Navy #0D1B2A and Gold #F4B400
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a
                  href="/privacy"
                  className="text-decoration-none"
                  style={{ color: '#0D1B2A' }}
                >
                  Privacy
                </a>
                <a
                  href="/cookies"
                  className="text-decoration-none"
                  style={{ color: '#0D1B2A' }}
                >
                  Cookies
                </a>
                <a
                  href="/contact"
                  className="text-decoration-none"
                  style={{ color: '#F4B400' }}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
