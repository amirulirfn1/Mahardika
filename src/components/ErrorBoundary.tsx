/**
 * Error Boundary Component - Mahardika Platform
 * Graceful error handling with Fiverr-inspired design
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, theme } from '@mahardika/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry or similar service
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background.secondary,
            padding: theme.spacing[4],
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius['2xl'],
              boxShadow: theme.colors.shadow.xl,
              padding: theme.spacing[8],
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: theme.colors.error,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto',
                marginBottom: theme.spacing[6],
              }}
            >
              ⚠️
            </div>

            {/* Error Message */}
            <h1
              style={{
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}
            >
              Oops! Something went wrong
            </h1>

            <p
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[6],
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              We're sorry for the inconvenience. An unexpected error has occurred.
              Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  marginBottom: theme.spacing[6],
                  padding: theme.spacing[4],
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing[2],
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: theme.spacing[4],
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleReload}
                style={{ minWidth: '160px' }}
              >
                Refresh Page
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                style={{ minWidth: '160px' }}
              >
                Go Back
              </Button>
            </div>

            {/* Support Link */}
            <p
              style={{
                marginTop: theme.spacing[8],
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
              }}
            >
              Need help?{' '}
              <a
                href="/support"
                style={{
                  color: theme.colors.primary,
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier use
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Default error page component
export const ErrorPage: React.FC<{
  error?: Error;
  reset?: () => void;
}> = ({ error, reset }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing[4],
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '6rem',
            marginBottom: theme.spacing[4],
          }}
        >
          😔
        </div>
        <h1
          style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[4],
          }}
        >
          Something went wrong!
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[6],
          }}
        >
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div style={{ display: 'flex', gap: theme.spacing[4], justifyContent: 'center' }}>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          {reset && (
            <Button
              variant="outline"
              onClick={reset}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 