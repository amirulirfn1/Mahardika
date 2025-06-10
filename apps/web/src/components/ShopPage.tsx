'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '../../components/ui';
import { Agency, AgencyReview } from '../lib/supabase';

interface ShopPageProps {
  agency: Agency;
  reviews: AgencyReview[];
}

export default function ShopPage({ agency, reviews }: ShopPageProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Handle review carousel navigation
  const nextReview = () => {
    setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? colors.gold : colors.gray[300],
          fontSize: '1.2rem',
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: colors.gray[50] }}>
      {/* Navigation */}
      <nav
        className="navbar navbar-expand-lg shadow-sm sticky-top"
        style={{
          backgroundColor: colors.navy,
          borderBottom: `3px solid ${colors.gold}`,
        }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/shop">
            Mahardika Shop
          </a>
          <div className="navbar-nav ms-auto">
            <a
              className="nav-link text-white d-flex align-items-center"
              href="/shop"
              style={{ textDecoration: 'none' }}
            >
              <span className="me-2">←</span>
              Back to Shop
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section
        className="position-relative"
        style={{
          backgroundImage: agency.banner_image_url
            ? `linear-gradient(rgba(13, 27, 42, 0.4), rgba(13, 27, 42, 0.4)), url(${agency.banner_image_url})`
            : `linear-gradient(135deg, ${colors.navy} 0%, rgba(13, 27, 42, 0.8) 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
        }}
      >
        <div className="container h-100 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-lg-8">
              <div className="text-white py-5">
                {agency.logo_url && (
                  <img
                    src={agency.logo_url}
                    alt={`${agency.name} logo`}
                    className="mb-4 rounded"
                    style={{
                      maxHeight: '80px',
                      border: `2px solid ${colors.gold}`,
                    }}
                  />
                )}
                <h1
                  className="display-4 fw-bold mb-3"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {agency.name}
                </h1>
                <p
                  className="lead mb-4"
                  style={{
                    fontSize: '1.5rem',
                    color: colors.gold,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {agency.tagline}
                </p>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    lineHeight: '1.6',
                  }}
                >
                  {agency.description}
                </p>

                {/* Rating Display */}
                {agency.rating && agency.review_count && (
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      {renderStars(Math.round(agency.rating))}
                    </div>
                    <span className="text-white">
                      <strong>{agency.rating.toFixed(1)}</strong> out of 5 (
                      {agency.review_count} reviews)
                    </span>
                  </div>
                )}

                {/* Contact Information */}
                <div className="d-flex flex-wrap gap-4 mb-4">
                  {agency.contact_phone && (
                    <div className="d-flex align-items-center">
                      <span className="me-2">📞</span>
                      <a
                        href={`tel:${agency.contact_phone}`}
                        className="text-white text-decoration-none"
                      >
                        {agency.contact_phone}
                      </a>
                    </div>
                  )}
                  {agency.contact_email && (
                    <div className="d-flex align-items-center">
                      <span className="me-2">✉️</span>
                      <a
                        href={`mailto:${agency.contact_email}`}
                        className="text-white text-decoration-none"
                      >
                        {agency.contact_email}
                      </a>
                    </div>
                  )}
                  {agency.website_url && (
                    <div className="d-flex align-items-center">
                      <span className="me-2">🌐</span>
                      <a
                        href={agency.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-decoration-none"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <BrandButton
                  variant="gold"
                  size="lg"
                  className="px-5 py-3"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 12px rgba(244, 180, 0, 0.3)',
                  }}
                  onClick={() => {
                    if (agency.contact_phone) {
                      window.location.href = `tel:${agency.contact_phone}`;
                    } else if (agency.contact_email) {
                      window.location.href = `mailto:${agency.contact_email}`;
                    }
                  }}
                >
                  Renew Now
                </BrandButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Carousel Section */}
      {reviews.length > 0 && (
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: colors.navy }}
              >
                What Our Customers Say
              </h2>
              <p style={{ color: colors.gray[600] }}>
                Real feedback from satisfied customers
              </p>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-8">
                <BrandCard
                  variant="navy-outline"
                  size="lg"
                  className="position-relative"
                  style={{
                    borderRadius: '0.5rem',
                    minHeight: '200px',
                  }}
                >
                  {/* Review Content */}
                  <div className="text-center p-4">
                    <div className="mb-3">
                      {renderStars(reviews[currentReviewIndex].rating)}
                    </div>
                    <blockquote
                      className="mb-4"
                      style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.6',
                        color: colors.gray[700],
                        fontStyle: 'italic',
                      }}
                    >
                      "{reviews[currentReviewIndex].comment}"
                    </blockquote>
                    <footer className="blockquote-footer">
                      <strong style={{ color: colors.navy }}>
                        {reviews[currentReviewIndex].reviewer_name}
                      </strong>
                    </footer>
                  </div>

                  {/* Carousel Controls */}
                  {reviews.length > 1 && (
                    <>
                      <button
                        className="btn position-absolute top-50 start-0 translate-middle-y ms-3"
                        style={{
                          backgroundColor: colors.navy,
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          color: 'white',
                        }}
                        onClick={prevReview}
                        aria-label="Previous review"
                      >
                        ‹
                      </button>
                      <button
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{
                          backgroundColor: colors.navy,
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          color: 'white',
                        }}
                        onClick={nextReview}
                        aria-label="Next review"
                      >
                        ›
                      </button>
                    </>
                  )}
                </BrandCard>

                {/* Review Indicators */}
                {reviews.length > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        className="btn p-0 mx-1"
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor:
                            index === currentReviewIndex
                              ? colors.gold
                              : colors.gray[300],
                          border: 'none',
                        }}
                        onClick={() => setCurrentReviewIndex(index)}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Additional Information Section */}
      <section className="py-5" style={{ backgroundColor: colors.gray[100] }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <BrandCard
                variant="navy-outline"
                size="md"
                className="h-100"
                style={{ backgroundColor: 'white' }}
              >
                <h3 className="h4 mb-3" style={{ color: colors.navy }}>
                  About Our Services
                </h3>
                <p style={{ color: colors.gray[700] }}>{agency.description}</p>
                {agency.website_url && (
                  <BrandButton
                    variant="outline-navy"
                    size="md"
                    onClick={() => window.open(agency.website_url, '_blank')}
                  >
                    Learn More
                  </BrandButton>
                )}
              </BrandCard>
            </div>

            <div className="col-lg-6 mb-4">
              <BrandCard variant="gold-outline" size="md" className="h-100">
                <h3 className="h4 mb-3" style={{ color: colors.navy }}>
                  Get in Touch
                </h3>
                <div className="mb-3">
                  {agency.contact_phone && (
                    <p className="mb-2">
                      <strong>Phone:</strong>{' '}
                      <a
                        href={`tel:${agency.contact_phone}`}
                        style={{ color: colors.navy, textDecoration: 'none' }}
                      >
                        {agency.contact_phone}
                      </a>
                    </p>
                  )}
                  {agency.contact_email && (
                    <p className="mb-2">
                      <strong>Email:</strong>{' '}
                      <a
                        href={`mailto:${agency.contact_email}`}
                        style={{ color: colors.navy, textDecoration: 'none' }}
                      >
                        {agency.contact_email}
                      </a>
                    </p>
                  )}
                </div>
                <BrandButton
                  variant="gold"
                  size="md"
                  className="w-100"
                  onClick={() => {
                    if (agency.contact_phone) {
                      window.location.href = `tel:${agency.contact_phone}`;
                    } else if (agency.contact_email) {
                      window.location.href = `mailto:${agency.contact_email}`;
                    }
                  }}
                >
                  Contact Us Now
                </BrandButton>
              </BrandCard>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-5 text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, rgba(13, 27, 42, 0.9) 100%)`,
          color: 'white',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Don't wait – secure your coverage today with {agency.name}
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <BrandButton
                  variant="gold"
                  size="lg"
                  className="px-5"
                  onClick={() => {
                    if (agency.contact_phone) {
                      window.location.href = `tel:${agency.contact_phone}`;
                    }
                  }}
                >
                  Call Now
                </BrandButton>
                <BrandButton
                  variant="outline-gold"
                  size="lg"
                  className="px-5"
                  style={{ color: 'white', borderColor: colors.gold }}
                  onClick={() => {
                    if (agency.contact_email) {
                      window.location.href = `mailto:${agency.contact_email}`;
                    }
                  }}
                >
                  Email Us
                </BrandButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
