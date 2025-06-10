'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard } from '@mahardika/ui';

const StyleGuidePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Brand colors
  const brandColors = [
    {
      name: 'Navy Primary',
      hex: '#0D1B2A',
      rgb: 'rgb(13, 27, 42)',
      usage: 'Primary brand color, headers, navigation',
    },
    {
      name: 'Gold Accent',
      hex: '#F4B400',
      rgb: 'rgb(244, 180, 0)',
      usage: 'Accent color, buttons, highlights',
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      rgb: 'rgb(255, 255, 255)',
      usage: 'Background, text on dark backgrounds',
    },
    {
      name: 'Gray 100',
      hex: '#F8F9FA',
      rgb: 'rgb(248, 249, 250)',
      usage: 'Light backgrounds, subtle sections',
    },
    {
      name: 'Gray 600',
      hex: '#6C757D',
      rgb: 'rgb(108, 117, 125)',
      usage: 'Secondary text, muted content',
    },
    {
      name: 'Gray 800',
      hex: '#343A40',
      rgb: 'rgb(52, 58, 64)',
      usage: 'Dark text, body content',
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
            Mahardika Style Guide
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
                <a
                  className="nav-link"
                  href="/style-guide"
                  style={{ color: '#F4B400', fontWeight: 'bold' }}
                >
                  Style Guide
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
            Mahardika Design System
          </h1>
          <p className="lead" style={{ color: '#6C757D' }}>
            Complete style guide and component library for the Mahardika
            platform
          </p>
          <div
            className="d-inline-block px-4 py-2 rounded-pill"
            style={{
              backgroundColor: 'rgba(244, 180, 0, 0.1)',
              border: '1px solid #F4B400',
            }}
          >
            <span style={{ color: '#0D1B2A', fontWeight: 'bold' }}>
              Navy #0D1B2A • Gold #F4B400 • 0.5rem radius
            </span>
          </div>
        </div>

        {/* Color Palette */}
        <section className="mb-5">
          <BrandCard variant="navy-primary" size="lg" className="mb-4">
            <h2 className="h3 mb-4 text-white">🎨 Color Palette</h2>
            <div className="row g-4">
              {brandColors.map((color, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <div className="card-body p-0">
                      <div
                        className="w-100"
                        style={{
                          height: '100px',
                          backgroundColor: color.hex,
                          borderRadius: '0.5rem 0.5rem 0 0',
                        }}
                      />
                      <div className="p-3">
                        <h5
                          className="card-title mb-2"
                          style={{ color: '#0D1B2A', fontSize: '1rem' }}
                        >
                          {color.name}
                        </h5>
                        <p className="card-text mb-1">
                          <code
                            className="bg-light px-2 py-1 rounded"
                            style={{ fontSize: '0.85rem' }}
                          >
                            {color.hex}
                          </code>
                        </p>
                        <p className="card-text mb-2">
                          <small className="text-muted">{color.rgb}</small>
                        </p>
                        <p className="card-text">
                          <small style={{ color: '#6C757D' }}>
                            {color.usage}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BrandCard>
        </section>

        {/* Typography */}
        <section className="mb-5">
          <BrandCard variant="gold-primary" size="lg" className="mb-4">
            <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
              ✍️ Typography
            </h2>
            <div className="row">
              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Headings
                </h3>
                <div className="mb-4">
                  <h1 className="display-1" style={{ color: '#0D1B2A' }}>
                    Display 1
                  </h1>
                  <h1 className="display-4" style={{ color: '#0D1B2A' }}>
                    Display 4
                  </h1>
                  <h1 style={{ color: '#0D1B2A' }}>Heading 1</h1>
                  <h2 style={{ color: '#0D1B2A' }}>Heading 2</h2>
                  <h3 style={{ color: '#0D1B2A' }}>Heading 3</h3>
                  <h4 style={{ color: '#0D1B2A' }}>Heading 4</h4>
                  <h5 style={{ color: '#0D1B2A' }}>Heading 5</h5>
                  <h6 style={{ color: '#0D1B2A' }}>Heading 6</h6>
                </div>
              </div>
              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Body Text
                </h3>
                <div className="mb-4">
                  <p className="lead" style={{ color: '#343A40' }}>
                    Lead paragraph - Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                  <p style={{ color: '#343A40' }}>
                    Regular paragraph text. Sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua.
                  </p>
                  <p className="small" style={{ color: '#6C757D' }}>
                    Small text - Ut enim ad minim veniam, quis nostrud
                    exercitation.
                  </p>
                  <p>
                    <strong style={{ color: '#0D1B2A' }}>Bold text</strong> and{' '}
                    <em style={{ color: '#6C757D' }}>italic text</em> examples.
                  </p>
                  <p>
                    <mark
                      style={{
                        backgroundColor: 'rgba(244, 180, 0, 0.3)',
                        color: '#0D1B2A',
                      }}
                    >
                      Highlighted text
                    </mark>
                  </p>
                </div>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* Buttons */}
        <section className="mb-5">
          <BrandCard variant="navy-outline" size="lg" className="mb-4">
            <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
              🔘 Buttons
            </h2>

            <div className="row">
              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Primary Buttons
                </h3>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <BrandButton variant="navy" size="sm">
                    Small Navy
                  </BrandButton>
                  <BrandButton variant="navy" size="md">
                    Medium Navy
                  </BrandButton>
                  <BrandButton variant="navy" size="lg">
                    Large Navy
                  </BrandButton>
                </div>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <BrandButton variant="gold" size="sm">
                    Small Gold
                  </BrandButton>
                  <BrandButton variant="gold" size="md">
                    Medium Gold
                  </BrandButton>
                  <BrandButton variant="gold" size="lg">
                    Large Gold
                  </BrandButton>
                </div>
              </div>

              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Outline Buttons
                </h3>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <BrandButton variant="outline-navy" size="sm">
                    Small Outline Navy
                  </BrandButton>
                  <BrandButton variant="outline-navy" size="md">
                    Medium Outline Navy
                  </BrandButton>
                  <BrandButton variant="outline-navy" size="lg">
                    Large Outline Navy
                  </BrandButton>
                </div>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <BrandButton variant="outline-gold" size="sm">
                    Small Outline Gold
                  </BrandButton>
                  <BrandButton variant="outline-gold" size="md">
                    Medium Outline Gold
                  </BrandButton>
                  <BrandButton variant="outline-gold" size="lg">
                    Large Outline Gold
                  </BrandButton>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Gradient Buttons
                </h3>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <BrandButton variant="gradient" size="sm">
                    Small Gradient
                  </BrandButton>
                  <BrandButton variant="gradient" size="md">
                    Medium Gradient
                  </BrandButton>
                  <BrandButton variant="gradient" size="lg">
                    Large Gradient
                  </BrandButton>
                </div>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* Forms */}
        <section className="mb-5">
          <BrandCard variant="navy-glass" size="lg" className="mb-4">
            <h2 className="h3 mb-4 text-white">📝 Forms</h2>

            <div className="row">
              <div className="col-lg-6">
                <h3 className="h5 mb-3 text-white">Basic Form Elements</h3>
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="nameInput"
                      className="form-label text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nameInput"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{
                        borderRadius: '0.5rem',
                        borderColor: '#F4B400',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="emailInput"
                      className="form-label text-white"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{
                        borderRadius: '0.5rem',
                        borderColor: '#F4B400',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="categorySelect"
                      className="form-label text-white"
                    >
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="categorySelect"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{
                        borderRadius: '0.5rem',
                        borderColor: '#F4B400',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <option value="">Choose a category</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Support</option>
                      <option value="sales">Sales</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="newsletterCheck"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      style={{ accentColor: '#F4B400' }}
                    />
                    <label
                      className="form-check-label text-white"
                      htmlFor="newsletterCheck"
                    >
                      Subscribe to newsletter
                    </label>
                  </div>
                </form>
              </div>

              <div className="col-lg-6">
                <h3 className="h5 mb-3 text-white">Textarea & Radio</h3>
                <div className="mb-3">
                  <label
                    htmlFor="messageTextarea"
                    className="form-label text-white"
                  >
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="messageTextarea"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message here..."
                    style={{
                      borderRadius: '0.5rem',
                      borderColor: '#F4B400',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">
                    Priority Level
                  </label>
                  <div className="mt-2">
                    {['Low', 'Medium', 'High'].map(priority => (
                      <div key={priority} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="priority"
                          id={`priority${priority}`}
                          style={{ accentColor: '#F4B400' }}
                        />
                        <label
                          className="form-check-label text-white"
                          htmlFor={`priority${priority}`}
                        >
                          {priority}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <BrandButton variant="gold" size="md">
                    Submit Form
                  </BrandButton>
                  <BrandButton variant="outline-gold" size="md">
                    Reset
                  </BrandButton>
                </div>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* Cards & Components */}
        <section className="mb-5">
          <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
            🎴 Card Components
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <BrandCard variant="navy-primary" size="md">
                <h5 className="text-white mb-3">Navy Primary Card</h5>
                <p className="text-white mb-3">
                  Perfect for headers, primary content sections, and main
                  call-to-action areas.
                </p>
                <BrandButton variant="gold" size="sm">
                  Learn More
                </BrandButton>
              </BrandCard>
            </div>

            <div className="col-md-6 col-lg-4">
              <BrandCard variant="gold-primary" size="md">
                <h5 style={{ color: '#0D1B2A' }} className="mb-3">
                  Gold Primary Card
                </h5>
                <p style={{ color: '#0D1B2A' }} className="mb-3">
                  Ideal for highlighting features, special offers, and important
                  announcements.
                </p>
                <BrandButton variant="navy" size="sm">
                  Explore
                </BrandButton>
              </BrandCard>
            </div>

            <div className="col-md-6 col-lg-4">
              <BrandCard variant="gradient" size="md">
                <h5 className="text-white mb-3">Gradient Card</h5>
                <p className="text-white mb-3">
                  Eye-catching gradient cards for showcase sections and featured
                  content.
                </p>
                <BrandButton variant="outline-gold" size="sm">
                  Discover
                </BrandButton>
              </BrandCard>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-5">
          <BrandCard variant="navy-outline" size="lg">
            <h2 className="h3 mb-4" style={{ color: '#0D1B2A' }}>
              📋 Usage Guidelines
            </h2>

            <div className="row">
              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Color Usage
                </h3>
                <ul style={{ color: '#343A40' }}>
                  <li className="mb-2">
                    <strong style={{ color: '#0D1B2A' }}>
                      Navy (#0D1B2A):
                    </strong>{' '}
                    Primary brand color for headers, navigation, and main CTAs
                  </li>
                  <li className="mb-2">
                    <strong style={{ color: '#F4B400' }}>
                      Gold (#F4B400):
                    </strong>{' '}
                    Accent color for highlights, secondary buttons, and active
                    states
                  </li>
                  <li className="mb-2">
                    <strong>Contrast:</strong> Always ensure sufficient contrast
                    for accessibility (WCAG AA compliance)
                  </li>
                  <li className="mb-2">
                    <strong>Backgrounds:</strong> Use light grays for subtle
                    backgrounds, white for content areas
                  </li>
                </ul>
              </div>

              <div className="col-lg-6">
                <h3 className="h5 mb-3" style={{ color: '#0D1B2A' }}>
                  Component Guidelines
                </h3>
                <ul style={{ color: '#343A40' }}>
                  <li className="mb-2">
                    <strong>Border Radius:</strong> Always use 0.5rem for
                    consistent rounded corners
                  </li>
                  <li className="mb-2">
                    <strong>Spacing:</strong> Follow Bootstrap's spacing scale
                    (rem-based)
                  </li>
                  <li className="mb-2">
                    <strong>Typography:</strong> Use Bootstrap's default font
                    stack and sizing
                  </li>
                  <li className="mb-2">
                    <strong>Shadows:</strong> Apply subtle shadows for depth and
                    hierarchy
                  </li>
                </ul>
              </div>
            </div>
          </BrandCard>
        </section>

        {/* Footer */}
        <footer
          className="text-center py-4"
          style={{ borderTop: '2px solid #F4B400' }}
        >
          <p style={{ color: '#6C757D' }} className="mb-0">
            Mahardika Design System • Bootstrap 5 • React Components
          </p>
          <p style={{ color: '#6C757D' }} className="mb-0 small">
            Built with ❤️ using Navy #0D1B2A and Gold #F4B400
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StyleGuidePage;
