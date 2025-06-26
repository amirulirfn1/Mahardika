'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title?: string;
  content?: string;
  created_at: string;
  response?: string;
  response_date?: string;
  response_by?: string;
  service_type?: string;
  is_verified: boolean;
}

interface ReviewReplyInterfaceProps {
  review: Review;
  onReplySubmit: (reviewId: string, reply: string) => Promise<void>;
  onReplyUpdate: (reviewId: string, reply: string) => Promise<void>;
  onReplyDelete: (reviewId: string) => Promise<void>;
  isSubmitting?: boolean;
  canEdit?: boolean;
  currentUserName?: string;
}

export default function ReviewReplyInterface({
  review,
  onReplySubmit,
  onReplyUpdate,
  onReplyDelete,
  isSubmitting = false,
  canEdit = true,
  currentUserName = 'Agency Representative',
}: ReviewReplyInterfaceProps) {
  const [replyText, setReplyText] = useState(review.response || '');
  const [isEditing, setIsEditing] = useState(!review.response);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string>('');

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

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      setError('Please enter a reply message');
      return;
    }

    if (replyText.length > 1000) {
      setError('Reply must be 1000 characters or less');
      return;
    }

    try {
      setError('');
      if (review.response) {
        await onReplyUpdate(review.id, replyText.trim());
      } else {
        await onReplySubmit(review.id, replyText.trim());
      }
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save reply. Please try again.');
    }
  };

  const handleDeleteReply = async () => {
    try {
      await onReplyDelete(review.id);
      setReplyText('');
      setIsEditing(true);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete reply. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container-fluid px-0">
      <BrandCard variant="navy-outline" size="lg">
        {/* Review Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h4 className="h5 mb-0 me-3" style={{ color: colors.navy }}>
                {review.customer_name}
              </h4>
              {review.is_verified && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: colors.gold,
                    color: colors.navy,
                    fontSize: '0.7rem',
                  }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="d-flex align-items-center mb-2">
              {renderStars(review.rating)}
              <span className="ms-2" style={{ color: colors.gray[600] }}>
                {formatDate(review.created_at)}
              </span>
            </div>
            {review.service_type && (
              <small
                className="badge"
                style={{
                  backgroundColor: `${colors.navy}20`,
                  color: colors.navy,
                  fontSize: '0.7rem',
                }}
              >
                {review.service_type}
              </small>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          {review.title && (
            <h5 className="h6 mb-2" style={{ color: colors.navy }}>
              {review.title}
            </h5>
          )}
          {review.content && (
            <p style={{ color: colors.gray[700], lineHeight: '1.6' }}>
              {review.content}
            </p>
          )}
        </div>

        {/* Reply Section */}
        <div
          className="border-top pt-4"
          style={{ borderColor: `${colors.gray[300]} !important` }}
        >
          <div className="d-flex align-items-center mb-3">
            <h5 className="h6 mb-0" style={{ color: colors.navy }}>
              Management Response
            </h5>
            {review.response_date && !isEditing && (
              <small className="ms-2" style={{ color: colors.gray[500] }}>
                Replied on {formatDate(review.response_date)}
              </small>
            )}
          </div>

          {/* Existing Reply Display */}
          {review.response && !isEditing && (
            <div className="mb-3">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: `${colors.gold}15`,
                  borderLeft: `4px solid ${colors.gold}`,
                }}
              >
                <p className="mb-2" style={{ color: colors.gray[700] }}>
                  {review.response}
                </p>
                <small style={{ color: colors.gray[500] }}>
                  — {currentUserName}
                </small>
              </div>
            </div>
          )}

          {/* Reply Form */}
          {isEditing && (
            <div className="mb-3">
              <textarea
                className="form-control mb-3"
                rows={4}
                maxLength={1000}
                value={replyText}
                onChange={e => {
                  setReplyText(e.target.value);
                  setError('');
                }}
                placeholder="Write a professional response to this review..."
                style={{
                  borderColor: colors.gray[300],
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                }}
                disabled={isSubmitting}
              />

              <div className="d-flex justify-content-between mb-3">
                <small style={{ color: colors.gray[500] }}>
                  Professional tip: Thank the customer and address their
                  feedback constructively
                </small>
                <small
                  style={{
                    color:
                      replyText.length > 900 ? '#dc3545' : colors.gray[500],
                  }}
                >
                  {replyText.length}/1000
                </small>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger mb-3"
              style={{ borderRadius: '0.5rem' }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <BrandButton
                  variant="gold"
                  size="md"
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyText.trim()}
                >
                  <>
                    {isSubmitting && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {(() => {
                      if (isSubmitting) {
                        return review.response ? 'Updating...' : 'Posting...';
                      } else {
                        return review.response ? 'Update Reply' : 'Post Reply';
                      }
                    })()}
                  </>
                </BrandButton>

                {review.response && (
                  <BrandButton
                    variant="navy-outline"
                    size="md"
                    onClick={() => {
                      setIsEditing(false);
                      setReplyText(review.response || '');
                      setError('');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </BrandButton>
                )}
              </>
            ) : (
              <>
                {canEdit && (
                  <BrandButton
                    variant="gold-outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Reply
                  </BrandButton>
                )}

                {canEdit && review.response && (
                  <BrandButton
                    variant="navy-outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Reply
                  </BrandButton>
                )}
              </>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div
              className="mt-3 p-3 border rounded"
              style={{
                borderColor: '#dc3545',
                backgroundColor: '#fff5f5',
              }}
            >
              <p className="mb-3" style={{ color: '#721c24' }}>
                Are you sure you want to delete this reply? This action cannot
                be undone.
              </p>
              <div className="d-flex gap-2">
                <BrandButton
                  variant="navy-outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </BrandButton>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteReply}
                  disabled={isSubmitting}
                  style={{ borderRadius: '0.5rem' }}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Reply'}
                </button>
              </div>
            </div>
          )}

          {/* Best Practices Tip */}
          {!review.response && !isEditing && (
            <div
              className="mt-3 p-3 rounded"
              style={{
                backgroundColor: `${colors.navy}10`,
                borderLeft: `4px solid ${colors.navy}`,
              }}
            >
              <small style={{ color: colors.navy }}>
                <strong>💡 Best Practice:</strong> Responding to reviews shows
                that you value customer feedback and helps build trust with
                potential customers. Aim to respond professionally and promptly.
              </small>
            </div>
          )}
        </div>

        {/* Reply Actions for Management */}
        {!review.response && !isEditing && canEdit && (
          <div className="text-center mt-4">
            <BrandButton
              variant="gold"
              size="lg"
              onClick={() => setIsEditing(true)}
            >
              Reply to This Review
            </BrandButton>
          </div>
        )}
      </BrandCard>
    </div>
  );
}
