import React, { useState } from 'react';
import { colors, BrandButton } from '@mah/ui';

// Simple CSRF hook replacement
function useSimpleCSRF() {
  const [isLoading, setIsLoading] = useState(false);

  const addToFetchOptions = (options: any = {}) => {
    // Get CSRF token from cookie if available
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf-token='))
      ?.split('=')[1];

    return {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { 'X-CSRF-Token': token }),
      },
    };
  };

  return { addToFetchOptions, isLoading };
}

interface DSRRequest {
  id: string;
  type: 'export' | 'delete' | 'rectify';
  email: string;
  full_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  description: string;
  data_types: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  resolution_notes?: string;
  rejected_reason?: string;
}

const STATUS_INFO = {
  pending: {
    icon: '⏳',
    label: 'Pending',
    description: 'Your request has been received and is awaiting review',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  in_progress: {
    icon: '🔄',
    label: 'In Progress',
    description: 'We are currently processing your request',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  completed: {
    icon: '✅',
    label: 'Completed',
    description: 'Your request has been successfully processed',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  rejected: {
    icon: '❌',
    label: 'Rejected',
    description: 'Your request could not be processed',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
  cancelled: {
    icon: '⭕',
    label: 'Cancelled',
    description: 'Your request has been cancelled',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
};

const REQUEST_TYPE_INFO = {
  export: { icon: '📦', label: 'Data Export' },
  delete: { icon: '🗑️', label: 'Data Deletion' },
  rectify: { icon: '✏️', label: 'Data Rectification' },
};

const priorityStyles = {
  high: { bg: '#FEE2E2', color: '#DC2626' },
  normal: { bg: '#DBEAFE', color: '#2563EB' },
  low: { bg: '#F3F4F6', color: '#6B7280' },
};

export default function DSRTrackingPage() {
  const [requestId, setRequestId] = useState('');
  const [email, setEmail] = useState('');
  const [dsrRequest, setDsrRequest] = useState<DSRRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(true);

  const { addToFetchOptions } = useSimpleCSRF();

  const handleTrackRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestId.trim() || !email.trim()) {
      setError('Please provide both Request ID and Email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setDsrRequest(null);

    try {
      const requestOptions = addToFetchOptions({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId.trim(),
          email: email.trim(),
        }),
      });

      const response = await fetch('/api/dsr/track', requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track request');
      }

      const data = await response.json();
      setDsrRequest(data.request);
      setShowRequestForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while tracking your request'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['pending', 'in_progress', 'completed'];
    const currentIndex = statuses.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0;
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${colors.gray[300]}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.navy,
    marginBottom: '0.5rem',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.gray[50],
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: colors.navy,
              marginBottom: '0.5rem',
            }}
          >
            🔍 Track Your Request
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: colors.gray[600],
              lineHeight: '1.6',
            }}
          >
            Check the status of your data subject rights request
          </p>
        </div>

        {/* Search Form */}
        {showRequestForm && (
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(13, 27, 42, 0.1)',
              marginBottom: '2rem',
            }}
          >
            <form
              onSubmit={handleTrackRequest}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div>
                <label style={labelStyles}>Request ID *</label>
                <input
                  type="text"
                  value={requestId}
                  onChange={e => setRequestId(e.target.value)}
                  style={inputStyles}
                  placeholder="e.g., dsr_1234567890_abc123def"
                  required
                />
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: colors.gray[600],
                    marginTop: '0.25rem',
                  }}
                >
                  You can find your Request ID in the confirmation email we sent
                  you
                </p>
              </div>

              <div>
                <label style={labelStyles}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyles}
                  placeholder="The email address used when submitting the request"
                  required
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#FEE2E2',
                    border: `2px solid #EF4444`,
                    color: '#DC2626',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  ❌ {error}
                </div>
              )}

              <BrandButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isLoading ? colors.gray[400] : colors.navy,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {isLoading ? 'Tracking...' : 'Track Request'}
              </BrandButton>
            </form>
          </div>
        )}

        {/* Request Details */}
        {dsrRequest && (
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(13, 27, 42, 0.1)',
            }}
          >
            {/* Header with back button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: colors.navy,
                  margin: 0,
                }}
              >
                Request Details
              </h2>
              <BrandButton
                variant="secondary"
                onClick={() => {
                  setShowRequestForm(true);
                  setDsrRequest(null);
                  setRequestId('');
                  setEmail('');
                  setError('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: colors.navy,
                  border: `2px solid ${colors.navy}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Track Another Request
              </BrandButton>
            </div>

            {/* Status Banner */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: STATUS_INFO[dsrRequest.status].bgColor,
                border: `2px solid ${STATUS_INFO[dsrRequest.status].color}`,
                borderRadius: '0.75rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                }}
              >
                {STATUS_INFO[dsrRequest.status].icon}
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: STATUS_INFO[dsrRequest.status].color,
                  margin: '0 0 0.5rem 0',
                }}
              >
                {STATUS_INFO[dsrRequest.status].label}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: STATUS_INFO[dsrRequest.status].color,
                  margin: 0,
                }}
              >
                {STATUS_INFO[dsrRequest.status].description}
              </p>
            </div>

            {/* Progress Bar (for non-terminal statuses) */}
            {!['rejected', 'cancelled'].includes(dsrRequest.status) && (
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    color: colors.gray[600],
                  }}
                >
                  <span>Submitted</span>
                  <span>Processing</span>
                  <span>Completed</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: colors.gray[200],
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: STATUS_INFO[dsrRequest.status].color,
                      width: `${getStatusProgress(dsrRequest.status)}%`,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Request Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: colors.gray[50],
                  borderRadius: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Request Type
                </h4>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                    {REQUEST_TYPE_INFO[dsrRequest.type].icon}
                  </span>
                  <span
                    style={{ fontSize: '0.875rem', color: colors.gray[700] }}
                  >
                    {REQUEST_TYPE_INFO[dsrRequest.type].label}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: colors.gray[50],
                  borderRadius: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Priority
                </h4>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: priorityStyles[dsrRequest.priority].bg,
                    color: priorityStyles[dsrRequest.priority].color,
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {dsrRequest.priority}
                </span>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: colors.gray[50],
                  borderRadius: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Submitted
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: colors.gray[700],
                    margin: 0,
                  }}
                >
                  {formatDate(dsrRequest.created_at)}
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: colors.gray[50],
                  borderRadius: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '0.5rem',
                  }}
                >
                  Last Updated
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: colors.gray[700],
                    margin: 0,
                  }}
                >
                  {formatDate(dsrRequest.updated_at)}
                </p>
              </div>
            </div>

            {/* Data Types */}
            {dsrRequest.data_types && dsrRequest.data_types.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '1rem',
                  }}
                >
                  Data Types Requested
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {dsrRequest.data_types.map(type => (
                    <span
                      key={type}
                      style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: `${colors.gold}20`,
                        color: colors.navy,
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {dsrRequest.description && (
              <div style={{ marginBottom: '2rem' }}>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '1rem',
                  }}
                >
                  Description
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: colors.gray[700],
                    lineHeight: '1.5',
                    padding: '1rem',
                    backgroundColor: colors.gray[50],
                    borderRadius: '0.5rem',
                    margin: 0,
                  }}
                >
                  {dsrRequest.description}
                </p>
              </div>
            )}

            {/* Resolution Notes */}
            {dsrRequest.resolution_notes && (
              <div style={{ marginBottom: '2rem' }}>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '1rem',
                  }}
                >
                  Resolution Notes
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: colors.gray[700],
                    lineHeight: '1.5',
                    padding: '1rem',
                    backgroundColor: STATUS_INFO[dsrRequest.status].bgColor,
                    border: `1px solid ${STATUS_INFO[dsrRequest.status].color}`,
                    borderRadius: '0.5rem',
                    margin: 0,
                  }}
                >
                  {dsrRequest.resolution_notes}
                </p>
              </div>
            )}

            {/* Rejection Reason */}
            {dsrRequest.status === 'rejected' && dsrRequest.rejected_reason && (
              <div style={{ marginBottom: '2rem' }}>
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.navy,
                    marginBottom: '1rem',
                  }}
                >
                  Rejection Reason
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#DC2626',
                    lineHeight: '1.5',
                    padding: '1rem',
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #EF4444',
                    borderRadius: '0.5rem',
                    margin: 0,
                  }}
                >
                  {dsrRequest.rejected_reason}
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: `${colors.gold}10`,
                border: `1px solid ${colors.gold}`,
                borderRadius: '0.5rem',
              }}
            >
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.navy,
                  marginBottom: '0.75rem',
                }}
              >
                What&apos;s Next?
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: colors.gray[700],
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                {dsrRequest.status === 'pending' &&
                  'We will review your request and begin processing within 72 hours. You will receive an email update when we start working on your request.'}
                {dsrRequest.status === 'in_progress' &&
                  'We are currently processing your request. We will contact you via email once it&apos;s completed or if we need any additional information.'}
                {dsrRequest.status === 'completed' &&
                  'Your request has been completed! If this was a data export request, you should have received a download link via email. The link will be valid for 7 days.'}
                {dsrRequest.status === 'rejected' &&
                  'If you believe this rejection was made in error, please contact our Data Protection Officer at privacy@mahardika.com with your request ID.'}
                {dsrRequest.status === 'cancelled' &&
                  'This request has been cancelled. If you would like to submit a new request, you can do so using our data subject rights portal.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
