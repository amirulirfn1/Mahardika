'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mah/ui';

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  statusCode?: number;
  title?: string;
  message?: string;
}

export default function ErrorPage({
  error,
  reset,
  statusCode = 500,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again or contact support if the problem persists.',
}: ErrorPageProps) {
  useEffect(() => {
    // Log error to an error reporting service
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  const getErrorIcon = () => {
    switch (statusCode) {
      case 404:
        return (
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke={colors.navy}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke={colors.gold}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke={colors.gray[400]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 403:
        return (
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              ry="2"
              stroke={colors.navy}
              strokeWidth="2"
            />
            <circle cx="12" cy="16" r="1" fill={colors.gold} />
            <path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              stroke={colors.navy}
              strokeWidth="2"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={colors.navy}
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke={colors.gold}
              strokeWidth="2"
            />
            <circle cx="12" cy="16" r="1" fill={colors.gold} />
          </svg>
        );
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <BrandCard
              variant="navy-outline"
              size="lg"
              className="text-center"
              style={{ backgroundColor: 'white' }}
            >
              {/* Error Code */}
              <div className="mb-4">
                <h1
                  className="display-2 fw-bold mb-0"
                  style={{
                    color: colors.gold,
                    fontSize: '6rem',
                    lineHeight: '1',
                  }}
                >
                  {statusCode}
                </h1>
                <div
                  className="h-2 mx-auto"
                  style={{
                    width: '100px',
                    backgroundColor: colors.navy,
                    borderRadius: '0.5rem',
                  }}
                />
              </div>

              {/* Error Icon */}
              <div className="mb-4">
                <div
                  className="mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: colors.gray[100],
                    borderRadius: '50%',
                  }}
                >
                  {getErrorIcon()}
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: colors.navy }}>
                  {title}
                </h2>
                <p className="lead mb-0" style={{ color: colors.gray[600] }}>
                  {message}
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mb-4">
                  <details className="text-start">
                    <summary
                      className="btn btn-sm"
                      style={{
                        color: colors.gray[600],
                        backgroundColor: colors.gray[100],
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      Show Error Details
                    </summary>
                    <div
                      className="mt-3 p-3"
                      style={{
                        backgroundColor: colors.gray[50],
                        borderRadius: '0.5rem',
                      }}
                    >
                      <pre
                        className="small text-start mb-0"
                        style={{
                          color: colors.gray[700],
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      >
                        {error.stack || error.message}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link href="/">
                  <BrandButton variant="navy" size="lg">
                    Go to Homepage
                  </BrandButton>
                </Link>
                {reset && (
                  <BrandButton variant="gold-outline" size="lg" onClick={reset}>
                    Try Again
                  </BrandButton>
                )}
                <Link href="/shop">
                  <BrandButton variant="navy-outline" size="lg">
                    Browse Insurance
                  </BrandButton>
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-4 pt-4 border-top">
                <p className="small mb-2" style={{ color: colors.gray[500] }}>
                  If this problem persists, please contact our support team:
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                  <a
                    href="mailto:support@mahardika.com"
                    style={{ color: colors.navy }}
                    className="text-decoration-none small"
                  >
                    📧 support@mahardika.com
                  </a>
                  <a
                    href="tel:+1-800-MAHARDIKA"
                    style={{ color: colors.navy }}
                    className="text-decoration-none small"
                  >
                    📞 1-800-MAHARDIKA
                  </a>
                </div>
                {error?.digest && (
                  <p
                    className="small mt-2 mb-0"
                    style={{ color: colors.gray[400] }}
                  >
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </BrandCard>
          </div>
        </div>
      </div>
    </div>
  );
}
