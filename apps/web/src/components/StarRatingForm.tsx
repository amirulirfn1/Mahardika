'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '@mah/ui';

interface StarRatingFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialRating?: number;
  initialComment?: string;
  title?: string;
  subtitle?: string;
}

export default function StarRatingForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialRating = 0,
  initialComment = '',
  title = 'Rate Your Experience',
  subtitle = 'Help us improve by sharing your feedback',
}: StarRatingFormProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(initialComment);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.length > 200) {
      setError('Comment must be 200 characters or less');
      return;
    }

    setError('');
    onSubmit(rating, comment);
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    setError('');
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      stars.push(
        <button
          key={i}
          type="button"
          className="btn p-0 me-2"
          style={{
            fontSize: '2rem',
            color: isFilled ? colors.gold : colors.gray[300],
            background: 'none',
            border: 'none',
            transition: 'color 0.2s ease',
            outline: 'none',
          }}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
          disabled={isSubmitting}
        >
          ★
        </button>
      );
    }

    return stars;
  };

  const getRatingText = () => {
    const currentRating = hoveredRating || rating;
    switch (currentRating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select a rating';
    }
  };

  const getRatingColor = () => {
    const currentRating = hoveredRating || rating;
    if (currentRating === 0) return colors.gray[500];
    if (currentRating <= 2) return '#dc3545'; // Red
    if (currentRating === 3) return '#ffc107'; // Yellow
    return colors.gold; // Gold for 4-5 stars
  };

  return (
    <div className="container-fluid px-0">
      <div className="row justify-content-center">
        <div className="col-12">
          <BrandCard variant="navy-outline" size="lg">
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="text-center mb-4">
                <h2
                  className="h3 mb-2"
                  style={{ color: colors.navy, fontWeight: '600' }}
                >
                  {title}
                </h2>
                <p className="mb-0" style={{ color: colors.gray[600] }}>
                  {subtitle}
                </p>
              </div>

              {/* Star Rating */}
              <div className="text-center mb-4">
                <div className="mb-3">{renderStars()}</div>
                <div
                  style={{
                    color: getRatingColor(),
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    minHeight: '1.5rem',
                  }}
                >
                  {getRatingText()}
                </div>
              </div>

              {/* Comment Section */}
              <div className="mb-4">
                <label
                  className="form-label"
                  style={{ color: colors.navy, fontWeight: '600' }}
                  htmlFor="rating-comment"
                >
                  Share Your Experience (Optional)
                </label>
                <textarea
                  id="rating-comment"
                  className="form-control"
                  rows={4}
                  maxLength={200}
                  value={comment}
                  onChange={e => {
                    setComment(e.target.value);
                    setError('');
                  }}
                  placeholder="Tell us about your experience..."
                  style={{
                    borderColor: colors.gray[300],
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                  }}
                  disabled={isSubmitting}
                />
                <div className="d-flex justify-content-between mt-2">
                  <small style={{ color: colors.gray[500] }}>
                    Maximum 200 characters
                  </small>
                  <small
                    style={{
                      color:
                        comment.length > 180 ? '#dc3545' : colors.gray[500],
                    }}
                  >
                    {comment.length}/200
                  </small>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="alert alert-danger mb-4"
                  style={{ borderRadius: '0.5rem' }}
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                {onCancel && (
                  <BrandButton
                    variant="navy-outline"
                    size="lg"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="col-sm-auto px-4"
                  >
                    Cancel
                  </BrandButton>
                )}
                <BrandButton
                  variant="gold"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="col-sm-auto px-4"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </BrandButton>
              </div>

              {/* Mobile-First Responsive Notes */}
              <div className="mt-4 pt-3 border-top">
                <div className="row text-center">
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <small style={{ color: colors.gray[500] }}>
                      📱 Mobile Optimized
                    </small>
                  </div>
                  <div className="col-12 col-md-4 mb-2 mb-md-0">
                    <small style={{ color: colors.gray[500] }}>
                      ⚡ Quick & Easy
                    </small>
                  </div>
                  <div className="col-12 col-md-4">
                    <small style={{ color: colors.gray[500] }}>
                      🔒 Secure & Private
                    </small>
                  </div>
                </div>
              </div>
            </form>
          </BrandCard>
        </div>
      </div>

      {/* Responsive Enhancement Styles */}
      <style jsx>{`
        @media (max-width: 576px) {
          .container-fluid {
            padding: 0 10px;
          }

          .btn {
            font-size: 1.8rem !important;
          }

          .form-control {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        @media (max-width: 768px) {
          .h3 {
            font-size: 1.5rem;
          }
        }

        /* Focus states for accessibility */
        .btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(244, 180, 0, 0.25);
        }

        .form-control:focus {
          border-color: ${colors.gold};
          box-shadow: 0 0 0 0.2rem rgba(244, 180, 0, 0.25);
        }

        /* Animation for stars */
        .btn {
          transform: scale(1);
          transition: transform 0.1s ease;
        }

        .btn:hover {
          transform: scale(1.1);
        }

        .btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
