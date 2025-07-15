'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BrandButton, BrandCard, colors } from '@mah/ui';
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
        className={`text-xl ${i < rating ? 'text-accent' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-primary shadow-lg sticky top-0 z-50 border-b-4 border-accent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a href="/shop" className="text-white font-bold text-xl">
              Mahardika Shop
            </a>
            <div className="flex items-center">
              <a
                href="/shop"
                className="text-white hover:text-accent transition-colors duration-200 flex items-center gap-2"
              >
                <span>←</span>
                Back to Shop
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section
        className="relative min-h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: agency.banner_image_url
            ? `linear-gradient(rgba(13, 27, 42, 0.4), rgba(13, 27, 42, 0.4)), url(${agency.banner_image_url})`
            : `linear-gradient(135deg, ${colors.navy} 0%, rgba(13, 27, 42, 0.8) 100%)`,
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="w-full">
            <div className="lg:w-2/3">
              <div className="text-white py-12">
                {agency.logo_url && (
                  <Image
                    src={agency.logo_url}
                    alt={`${agency.name} logo`}
                    width={80}
                    height={80}
                    className="mb-6 rounded-lg border-2 border-accent"
                  />
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  {agency.name}
                </h1>
                <p className="text-2xl text-accent mb-6 drop-shadow-md">
                  {agency.tagline}
                </p>
                <p className="text-lg mb-6 max-w-2xl leading-relaxed">
                  {agency.description}
                </p>

                {/* Rating Display */}
                {agency.rating && agency.review_count && (
                  <div className="flex items-center mb-6">
                    <div className="mr-4">
                      {renderStars(Math.round(agency.rating))}
                    </div>
                    <span className="text-white">
                      <strong>{agency.rating.toFixed(1)}</strong> out of 5 (
                      {agency.review_count} reviews)
                    </span>
                  </div>
                )}

                {/* Contact Information */}
                <div className="flex flex-wrap gap-6 mb-6">
                  {agency.contact_phone && (
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <a
                        href={`tel:${agency.contact_phone}`}
                        className="text-white hover:text-accent transition-colors duration-200"
                      >
                        {agency.contact_phone}
                      </a>
                      {/* WhatsApp chat link */}
                      <a
                        href={`https://wa.me/${agency.contact_phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(agency.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-accent transition-colors duration-200"
                        title="Chat on WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  )}
                  {agency.contact_email && (
                    <div className="flex items-center gap-2">
                      <span>✉️</span>
                      <a
                        href={`mailto:${agency.contact_email}`}
                        className="text-white hover:text-accent transition-colors duration-200"
                      >
                        {agency.contact_email}
                      </a>
                    </div>
                  )}
                  {agency.website_url && (
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <a
                        href={agency.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-accent transition-colors duration-200"
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
                  className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 text-lg">
                Real feedback from satisfied customers
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <BrandCard
                  variant="navy-outline"
                  size="lg"
                  className="relative min-h-[200px] rounded-lg"
                >
                  {/* Review Content */}
                  <div className="text-center p-8">
                    <div className="mb-6">
                      {renderStars(reviews[currentReviewIndex].rating)}
                    </div>
                    <blockquote className="text-xl leading-relaxed text-gray-700 italic mb-6">
                      "{reviews[currentReviewIndex].comment}"
                    </blockquote>
                    <footer className="text-primary font-semibold">
                      {reviews[currentReviewIndex].reviewer_name}
                    </footer>
                  </div>

                  {/* Carousel Controls */}
                  {reviews.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
                        onClick={prevReview}
                        aria-label="Previous review"
                      >
                        ‹
                      </button>
                      <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
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
                  <div className="flex justify-center mt-6 gap-2">
                    {reviews.map((review, index) => (
                      <button
                        key={review.id}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentReviewIndex
                            ? 'bg-accent'
                            : 'bg-gray-300'
                        }`}
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
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <BrandCard
                variant="navy-outline"
                size="md"
                className="h-full bg-white"
              >
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  About Our Services
                </h3>
                <p className="text-gray-700 mb-6">{agency.description}</p>
                {agency.website_url && (
                  <BrandButton
                    variant="navy-outline"
                    size="md"
                    onClick={() => window.open(agency.website_url, '_blank')}
                  >
                    Learn More
                  </BrandButton>
                )}
              </BrandCard>
            </div>

            <div>
              <BrandCard variant="gold-outline" size="md" className="h-full">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  Get in Touch
                </h3>
                <div className="mb-6">
                  {agency.contact_phone && (
                    <p className="mb-2">
                      <strong>Phone:</strong>{' '}
                      <a
                        href={`tel:${agency.contact_phone}`}
                        className="text-primary hover:underline"
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
                        className="text-primary hover:underline"
                      >
                        {agency.contact_email}
                      </a>
                    </p>
                  )}
                </div>
                <BrandButton
                  variant="gold"
                  size="md"
                  className="w-full"
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
        className="py-16 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, rgba(13, 27, 42, 0.9) 100%)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Don't wait – secure your coverage today with {agency.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrandButton
                variant="gold"
                size="lg"
                className="px-8 py-4"
                onClick={() => {
                  if (agency.contact_phone) {
                    window.location.href = `tel:${agency.contact_phone}`;
                  }
                }}
              >
                Call Now
              </BrandButton>
              <BrandButton
                variant="gold-outline"
                size="lg"
                className="px-8 py-4 text-white border-accent"
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
      </section>
    </div>
  );
}
