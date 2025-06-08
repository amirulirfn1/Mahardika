'use client';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TokenUsageStats {
  currentUsage: number;
  limit: number;
  remaining: number;
  planType: string;
  percentage: number;
}

interface TokenUsageCardProps {
  agencyId: string;
  className?: string;
}

const MAHARDIKA_COLORS = {
  navy: '#0D1B2A',
  gold: '#F4B400',
};

const TokenUsageCard: React.FC<TokenUsageCardProps> = ({
  agencyId,
  className = '',
}) => {
  const [stats, setStats] = useState<TokenUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenUsage();
  }, [agencyId]);

  const fetchTokenUsage = async () => {
    try {
      setLoading(true);
      setError(null);

      // This would be a real API call to get usage stats
      const response = await fetch(`/api/ai/usage?agencyId=${agencyId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch token usage');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching token usage:', err);
      setError('Failed to load token usage');

      // Mock data for demo purposes
      setStats({
        currentUsage: 75000,
        limit: 100000,
        remaining: 25000,
        planType: 'growth',
        percentage: 75,
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getPlanBadgeColor = (planType: string): string => {
    switch (planType) {
      case 'starter':
        return 'secondary';
      case 'growth':
        return 'primary';
      case 'scale':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div
        className={`card ${className}`}
        style={{
          borderRadius: '0.5rem',
          border: `2px solid ${MAHARDIKA_COLORS.gold}`,
        }}
      >
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0 text-muted">Loading token usage...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div
        className={`card ${className}`}
        style={{
          borderRadius: '0.5rem',
          border: `2px solid ${MAHARDIKA_COLORS.gold}`,
        }}
      >
        <div className="card-body text-center">
          <i className="bi bi-exclamation-triangle text-warning fs-2" />
          <p className="mt-2 mb-2 text-muted">
            {error || 'Unable to load data'}
          </p>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={fetchTokenUsage}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card ${className}`}
      style={{
        borderRadius: '0.5rem',
        border: `2px solid ${MAHARDIKA_COLORS.gold}`,
        boxShadow: '0 4px 6px rgba(13, 27, 42, 0.1)',
      }}
    >
      {/* Header */}
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: MAHARDIKA_COLORS.navy,
          color: 'white',
          borderRadius: '0.5rem 0.5rem 0 0',
        }}
      >
        <div>
          <h6 className="mb-0 fw-bold">AI Token Usage</h6>
          <small className="opacity-75">Current Month</small>
        </div>
        <span
          className={`badge bg-${getPlanBadgeColor(stats.planType)} text-uppercase fw-bold`}
          style={{ fontSize: '0.7rem' }}
        >
          {stats.planType}
        </span>
      </div>

      {/* Body */}
      <div className="card-body p-3">
        {/* Usage Numbers */}
        <div className="row text-center mb-3">
          <div className="col-4">
            <div
              className="fw-bold"
              style={{ color: MAHARDIKA_COLORS.navy, fontSize: '1.2rem' }}
            >
              {formatNumber(stats.currentUsage)}
            </div>
            <small className="text-muted">Used</small>
          </div>
          <div className="col-4">
            <div
              className="fw-bold"
              style={{ color: MAHARDIKA_COLORS.gold, fontSize: '1.2rem' }}
            >
              {formatNumber(stats.limit)}
            </div>
            <small className="text-muted">Limit</small>
          </div>
          <div className="col-4">
            <div
              className="fw-bold text-success"
              style={{ fontSize: '1.2rem' }}
            >
              {formatNumber(stats.remaining)}
            </div>
            <small className="text-muted">Remaining</small>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Usage Progress</small>
            <small className="fw-bold" style={{ color: MAHARDIKA_COLORS.navy }}>
              {stats.percentage}%
            </small>
          </div>
          <div
            className="progress"
            style={{ height: '8px', borderRadius: '0.5rem' }}
          >
            <div
              className={`progress-bar bg-${getProgressBarColor(stats.percentage)}`}
              role="progressbar"
              style={{
                width: `${stats.percentage}%`,
                borderRadius: '0.5rem',
              }}
              aria-valuenow={stats.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          {stats.percentage >= 90 ? (
            <div
              className="alert alert-danger py-1 px-2 mb-0"
              style={{ borderRadius: '0.5rem', fontSize: '0.8rem' }}
            >
              <i className="bi bi-exclamation-triangle-fill me-1" />
              <strong>Limit almost reached!</strong> Consider upgrading.
            </div>
          ) : stats.percentage >= 75 ? (
            <div
              className="alert alert-warning py-1 px-2 mb-0"
              style={{ borderRadius: '0.5rem', fontSize: '0.8rem' }}
            >
              <i className="bi bi-info-circle-fill me-1" />
              <strong>High usage detected.</strong> Monitor carefully.
            </div>
          ) : (
            <div
              className="alert alert-success py-1 px-2 mb-0"
              style={{ borderRadius: '0.5rem', fontSize: '0.8rem' }}
            >
              <i className="bi bi-check-circle-fill me-1" />
              <strong>Usage healthy.</strong> {formatNumber(stats.remaining)}{' '}
              tokens remaining.
            </div>
          )}
        </div>
      </div>

      {/* Footer with Action */}
      <div
        className="card-footer text-center py-2"
        style={{
          backgroundColor: `${MAHARDIKA_COLORS.gold}10`,
          borderRadius: '0 0 0.5rem 0.5rem',
          borderTop: `1px solid ${MAHARDIKA_COLORS.gold}40`,
        }}
      >
        <button
          className="btn btn-sm text-decoration-none fw-bold"
          style={{
            color: MAHARDIKA_COLORS.navy,
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '0.8rem',
          }}
          onClick={() => window.open('/dashboard/ai-usage', '_blank')}
        >
          View Detailed Usage <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
};

export default TokenUsageCard;
