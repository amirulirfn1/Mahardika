'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { colors } from '@mahardika/ui';

export default function DSRVerificationPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams?.get('token');
  const requestId = searchParams?.get('id');

  useEffect(() => {
    if (!token || !requestId) {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. Missing token or request ID.');
      return;
    }

    verifyRequest();
  }, [token, requestId]);

  const verifyRequest = async () => {
    try {
      const response = await fetch('/api/dsr/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          request_id: requestId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setRequestInfo(data.request);
      } else {
        if (data.code === 'TOKEN_EXPIRED') {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
        }
        setErrorMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'export': return 'Data Export';
      case 'delete': return 'Data Deletion';
      case 'rectify': return 'Data Rectification';
      default: return 'Data Rights';
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'expired': return '⏰';
      default: return '⚠️';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'expired': return '#F59E0B';
      default: return colors.gray[600];
    }
  };

  const getStatusBgColor = () => {
    switch (verificationStatus) {
      case 'success': return '#D1FAE5';
      case 'error': return '#FEE2E2';
      case 'expired': return '#FEF3C7';
      default: return colors.gray[100];
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.gray[50],
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: '0.75rem',
        padding: '3rem',
        boxShadow: '0 4px 16px rgba(13, 27, 42, 0.1)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}>
          {getStatusIcon()}
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: colors.navy,
          marginBottom: '1rem',
        }}>
          {verificationStatus === 'loading' && 'Verifying Your Request...'}
          {verificationStatus === 'success' && 'Email Verified Successfully!'}
          {verificationStatus === 'error' && 'Verification Failed'}
          {verificationStatus === 'expired' && 'Verification Link Expired'}
        </h1>

        {verificationStatus === 'loading' && (
          <p style={{
            fontSize: '1.125rem',
            color: colors.gray[600],
            marginBottom: '2rem',
          }}>
            Please wait while we verify your email address and activate your request...
          </p>
        )}

        {verificationStatus === 'success' && requestInfo && (
          <div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: getStatusBgColor(),
              border: `2px solid ${getStatusColor()}`,
              borderRadius: '0.75rem',
              marginBottom: '2rem',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: getStatusColor(),
                marginBottom: '0.75rem',
              }}>
                Your {getRequestTypeLabel(requestInfo.type)} request has been verified and is now being processed.
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
                textAlign: 'left',
              }}>
                <div>
                  <strong style={{ color: colors.navy }}>Request ID:</strong>
                  <br />
                  <code style={{
                    fontSize: '0.875rem',
                    backgroundColor: colors.gray[100],
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                  }}>
                    {requestInfo.id}
                  </code>
                </div>
                
                <div>
                  <strong style={{ color: colors.navy }}>Status:</strong>
                  <br />
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {requestInfo.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <strong style={{ color: colors.navy }}>Priority:</strong>
                  <br />
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: requestInfo.priority === 'high' ? '#FEE2E2' : requestInfo.priority === 'normal' ? '#DBEAFE' : '#F3F4F6',
                    color: requestInfo.priority === 'high' ? '#DC2626' : requestInfo.priority === 'normal' ? '#2563EB' : '#6B7280',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {requestInfo.priority}
                  </span>
                </div>

                <div>
                  <strong style={{ color: colors.navy }}>Submitted:</strong>
                  <br />
                  <span style={{ fontSize: '0.875rem', color: colors.gray[700] }}>
                    {new Date(requestInfo.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: colors.gold + '10',
              border: `1px solid ${colors.gold}`,
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: colors.navy,
                marginBottom: '0.75rem',
              }}>
                What Happens Next?
              </h4>
              <ul style={{
                fontSize: '0.875rem',
                color: colors.gray[700],
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: '1.25rem',
              }}>
                <li>Your request is now in our processing queue</li>
                <li>We will begin data discovery and processing within 72 hours</li>
                <li>You will receive email updates as your request progresses</li>
                <li>
                  {requestInfo.type === 'export' && 'If approved, you will receive a secure download link'}
                  {requestInfo.type === 'delete' && 'You will receive confirmation once your data has been deleted'}
                  {requestInfo.type === 'rectify' && 'Our team will contact you to discuss the corrections needed'}
                </li>
                <li>Processing typically takes 10-30 business days depending on complexity</li>
              </ul>
            </div>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: getStatusBgColor(),
              border: `2px solid ${getStatusColor()}`,
              borderRadius: '0.75rem',
              marginBottom: '2rem',
            }}>
              <p style={{
                fontSize: '1.125rem',
                color: getStatusColor(),
                margin: 0,
              }}>
                {errorMessage}
              </p>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: colors.gray[600],
              marginBottom: '2rem',
            }}>
              If you continue to experience issues, please contact our support team with your request ID.
            </p>
          </div>
        )}

        {verificationStatus === 'expired' && (
          <div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: getStatusBgColor(),
              border: `2px solid ${getStatusColor()}`,
              borderRadius: '0.75rem',
              marginBottom: '2rem',
            }}>
              <p style={{
                fontSize: '1.125rem',
                color: getStatusColor(),
                margin: 0,
              }}>
                This verification link has expired. Verification links are valid for 24 hours after request submission.
              </p>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: colors.gray[600],
              marginBottom: '2rem',
            }}>
              You will need to submit a new request to proceed with your data rights request.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {verificationStatus === 'success' && (
            <a
              href={`/privacy/rights/track?id=${requestInfo?.id}`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.navy,
                color: colors.white,
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'background-color 0.2s',
              }}
            >
              📊 Track Your Request
            </a>
          )}

          {(verificationStatus === 'error' || verificationStatus === 'expired') && (
            <a
              href="/privacy/rights"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.navy,
                color: colors.white,
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'background-color 0.2s',
              }}
            >
              🔄 Submit New Request
            </a>
          )}

          <a
            href="/"
            style={{
              color: colors.navy,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            ← Back to Home
          </a>
        </div>

        {/* Support Information */}
        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          backgroundColor: colors.gray[50],
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: colors.gray[600],
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Need Help?</strong>
          </p>
          <p style={{ margin: 0 }}>
            Contact our Data Protection Officer at{' '}
            <a 
              href="mailto:privacy@mahardika.com" 
              style={{ color: colors.navy, textDecoration: 'underline' }}
            >
              privacy@mahardika.com
            </a>
            {requestInfo?.id && ` (Reference: ${requestInfo.id})`}
          </p>
        </div>
      </div>
    </div>
  );
} 