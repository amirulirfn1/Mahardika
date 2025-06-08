'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

interface Agency {
  id: string;
  name: string;
  slug: string;
  price: string;
  speed: string;
  reliability: number; // 1-5 stars
  description: string;
  logo_url?: string;
  website_url?: string;
  contact_phone?: string;
  specialties: string[];
  location: string;
}

interface AgencyGridProps {
  agencies: Agency[];
  className?: string;
}

type SortOption = 'name' | 'price' | 'speed' | 'reliability';

export default function AgencyGrid({
  agencies,
  className = '',
}: AgencyGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Filter and sort agencies
  const filteredAndSortedAgencies = useMemo(() => {
    const filtered = agencies.filter(
      agency =>
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        agency.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort agencies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          // Extract numeric value from price string for comparison
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        case 'speed':
          // Assume speed is in format like "24 hours", "2-3 days", etc.
          const speedA = parseFloat(a.speed.replace(/[^0-9]/g, ''));
          const speedB = parseFloat(b.speed.replace(/[^0-9]/g, ''));
          return speedA - speedB;
        case 'reliability':
          return b.reliability - a.reliability; // Higher reliability first
        default:
          return 0;
      }
    });

    return filtered;
  }, [agencies, searchTerm, sortBy]);

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i <= rating ? colors.gold : colors.gray[300]}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return stars;
  };

  const getPriceBadgeColor = (price: string) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (numericPrice < 100) return { bg: colors.success, text: 'white' };
    if (numericPrice < 300) return { bg: colors.gold, text: colors.navy };
    return { bg: colors.navy, text: 'white' };
  };

  const getSpeedBadgeColor = (speed: string) => {
    const speedNum = parseFloat(speed.replace(/[^0-9]/g, ''));
    if (speedNum <= 24 && speed.includes('hour'))
      return { bg: colors.success, text: 'white' };
    if (speedNum <= 2 && speed.includes('day'))
      return { bg: colors.gold, text: colors.navy };
    return { bg: colors.gray[500], text: 'white' };
  };

  return (
    <div className={className}>
      {/* Search and Filter Controls */}
      <BrandCard
        variant="navy-outline"
        size="md"
        className="mb-4"
        style={{ backgroundColor: 'white' }}
      >
        <div className="row g-3 align-items-end">
          <div className="col-lg-6">
            <label
              htmlFor="search"
              className="form-label fw-semibold"
              style={{ color: colors.navy }}
            >
              Search Agencies
            </label>
            <div className="position-relative">
              <input
                id="search"
                type="text"
                className="form-control ps-5"
                placeholder="Search by name, location, or specialty..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: '0.5rem',
                  borderColor: colors.gray[300],
                }}
              />
              <div
                className="position-absolute top-50 start-0 translate-middle-y ps-3"
                style={{ color: colors.gray[400] }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <label
              htmlFor="sort"
              className="form-label fw-semibold"
              style={{ color: colors.navy }}
            >
              Sort By
            </label>
            <select
              id="sort"
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              style={{
                borderRadius: '0.5rem',
                borderColor: colors.gray[300],
              }}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="speed">Speed (Fastest First)</option>
              <option value="reliability">Reliability (Highest First)</option>
            </select>
          </div>
          <div className="col-lg-3">
            <div className="d-flex align-items-center gap-2">
              <span
                className="small fw-semibold"
                style={{ color: colors.gray[600] }}
              >
                {filteredAndSortedAgencies.length} of {agencies.length} agencies
              </span>
            </div>
          </div>
        </div>
      </BrandCard>

      {/* Results */}
      {filteredAndSortedAgencies.length === 0 ? (
        <BrandCard
          variant="navy-outline"
          size="lg"
          className="text-center"
          style={{ backgroundColor: 'white' }}
        >
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.gray[100],
              borderRadius: '50%',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke={colors.gray[400]}
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke={colors.gray[400]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: colors.navy }}>
            No agencies found
          </h5>
          <p className="mb-3" style={{ color: colors.gray[600] }}>
            Try adjusting your search terms or filters.
          </p>
          <BrandButton
            variant="outline-navy"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSortBy('name');
            }}
          >
            Clear Filters
          </BrandButton>
        </BrandCard>
      ) : (
        <div className="row g-4">
          {filteredAndSortedAgencies.map(agency => {
            const priceBadge = getPriceBadgeColor(agency.price);
            const speedBadge = getSpeedBadgeColor(agency.speed);

            return (
              <div key={agency.id} className="col-lg-4 col-md-6">
                <BrandCard
                  variant="navy-outline"
                  size="md"
                  className="h-100 position-relative"
                  style={{
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 0.75rem 1.5rem rgba(13, 27, 42, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header with Logo and Badges */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      {agency.logo_url ? (
                        <img
                          src={agency.logo_url}
                          alt={`${agency.name} logo`}
                          className="me-3"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '0.5rem',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: colors.navy,
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          {agency.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h6
                          className="mb-1 fw-bold"
                          style={{ color: colors.navy }}
                        >
                          {agency.name}
                        </h6>
                        <p
                          className="small mb-0"
                          style={{ color: colors.gray[600] }}
                        >
                          {agency.location}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <span
                        className="badge small px-2 py-1"
                        style={{
                          backgroundColor: priceBadge.bg,
                          color: priceBadge.text,
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        {agency.price}
                      </span>
                      <span
                        className="badge small px-2 py-1"
                        style={{
                          backgroundColor: speedBadge.bg,
                          color: speedBadge.text,
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        {agency.speed}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-3 small" style={{ color: colors.gray[700] }}>
                    {agency.description}
                  </p>

                  {/* Specialties */}
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-1">
                      {agency.specialties
                        .slice(0, 3)
                        .map((specialty, index) => (
                          <span
                            key={index}
                            className="badge"
                            style={{
                              backgroundColor: colors.gray[100],
                              color: colors.gray[700],
                              borderRadius: '0.5rem',
                              fontSize: '0.7rem',
                              fontWeight: 'normal',
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      {agency.specialties.length > 3 && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: colors.gold,
                            color: colors.navy,
                            borderRadius: '0.5rem',
                            fontSize: '0.7rem',
                          }}
                        >
                          +{agency.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating and Actions */}
                  <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(agency.reliability)}
                        <span
                          className="ms-2 small fw-semibold"
                          style={{ color: colors.navy }}
                        >
                          {agency.reliability}.0
                        </span>
                      </div>
                      {agency.contact_phone && (
                        <a
                          href={`tel:${agency.contact_phone}`}
                          className="text-decoration-none"
                          style={{ color: colors.gold }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <Link href={`/shop/${agency.slug}`} className="flex-fill">
                        <BrandButton variant="navy" size="sm" className="w-100">
                          Get Quote
                        </BrandButton>
                      </Link>
                      {agency.website_url && (
                        <a
                          href={agency.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <BrandButton variant="outline-gold" size="sm">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15 3H21V9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 14L21 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </BrandButton>
                        </a>
                      )}
                    </div>
                  </div>
                </BrandCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
