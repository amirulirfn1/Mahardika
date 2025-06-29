'use client';

import { colors, BrandButton } from '@mahardika/ui';
/**
 * Forgot Password Form Component - Mahardika Platform
 * Bootstrap 5 styled form with Mahardika brand colors
 * Brand Colors: Navy colors.navy (Primary), Gold colors.gold (Accent)
 */


import React, { useState } from 'react';
import { MAHARDIKA_COLORS } from '@/lib/env';


interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void>;
  onBackToLogin?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  className = '',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    // Validate email
    if (!email.trim()) {
      setError('Email address is required');
      setIsValidating(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsValidating(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className={`forgot-password-form ${className}`}>
        <style jsx>{`
          .forgot-password-form {
            --mahardika-navy: ${MAHARDIKA_COLORS.navy};
            --mahardika-gold: ${MAHARDIKA_COLORS.gold};
          }

          .success-icon {
            color: var(--mahardika-gold);
            font-size: 3rem;
          }

          .success-card {
            border: 2px solid var(--mahardika-gold);
            border-radius: 0.5rem;
            background: linear-gradient(
              135deg,
              rgba(13, 27, 42, 0.05) 0%,
              rgba(244, 180, 0, 0.05) 100%
            );
          }

          .btn-back {
            background-color: var(--mahardika-navy);
            border-color: var(--mahardika-navy);
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .btn-back:hover {
            background-color: rgba(13, 27, 42, 0.9);
            border-color: rgba(13, 27, 42, 0.9);
            transform: translateY(-1px);
          }
        `}</style>

        <div className="card success-card shadow-sm">
          <div className="card-body text-center p-4">
            <div className="success-icon mb-3">
              <i className="bi bi-check-circle-fill" />
            </div>
            <h4
              className="card-title mb-3"
              style={{ color: MAHARDIKA_COLORS.navy }}
            >
              Check Your Email
            </h4>
            <p className="card-text text-muted mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="small text-muted mb-4">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <BrandButton variant="navy-primary"
              type="button"
              className="btn btn-primary btn-back w-100"
              onClick={onBackToLogin}
            >
              <i className="bi bi-arrow-left me-2" />
              Back to Login
            </BrandButton>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className={`forgot-password-form ${className}`}>
      <style jsx>{`
        .forgot-password-form {
          --mahardika-navy: ${MAHARDIKA_COLORS.navy};
          --mahardika-gold: ${MAHARDIKA_COLORS.gold};
        }

        .form-card {
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background: white;
        }

        .form-header {
          background: linear-gradient(
            135deg,
            var(--mahardika-navy) 0%,
            rgba(13, 27, 42, 0.9) 100%
          );
          color: white;
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .form-icon {
          color: var(--mahardika-gold);
          font-size: 2.5rem;
        }

        .form-control {
          border-radius: 0.5rem;
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: var(--mahardika-gold);
          box-shadow: 0 0 0 0.2rem rgba(244, 180, 0, 0.25);
        }

        .form-control.is-invalid {
          border-color: #dc3545;
        }

        .btn-reset {
          background: linear-gradient(
            135deg,
            var(--mahardika-gold) 0%,
            rgba(244, 180, 0, 0.9) 100%
          );
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          color: var(--mahardika-navy);
        }

        .btn-reset:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(244, 180, 0, 0.3);
          color: var(--mahardika-navy);
        }

        .btn-reset:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-back-link {
          color: var(--mahardika-navy);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-back-link:hover {
          color: var(--mahardika-gold);
          text-decoration: underline;
        }

        .invalid-feedback {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .form-description {
          color: #6c757d;
          line-height: 1.5;
        }
      `}</style>

      <div className="card form-card">
        {/* Header */}
        <div className="form-header p-4 text-center">
          <div className="form-icon mb-2">
            <i className="bi bi-key-fill" />
          </div>
          <h3 className="mb-1">Forgot Password?</h3>
          <p className="mb-0 opacity-75">
            No worries, we&apos;ll send you reset instructions
          </p>
        </div>

        {/* Form Body */}
        <div className="card-body p-4">
          <p className="form-description text-center mb-4">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email Address
              </label>
              <div className="input-group">
                <span
                  className="input-group-text bg-light border-end-0"
                  style={{
                    borderColor: error ? '#dc3545' : '#e9ecef',
                    borderRadius: '0.5rem 0 0 0.5rem',
                  }}
                >
                  <i className="bi bi-envelope text-muted" />
                </span>
                <input
                  type="email"
                  className={`form-control border-start-0 ${error ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                  autoFocus
                  style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
                />
                {error && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="d-grid gap-2 mb-3">
              <BrandButton
                variant="gold"
                size="lg"
                type="submit"
                disabled={isLoading || isValidating || !email.trim()}
                fullWidth
              >
                {isLoading || isValidating ? (
                  <>
                    <div className="loading-spinner me-2 d-inline-block" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </BrandButton>
            </div>

            <div className="text-center">
              <BrandButton
                variant="outline-navy"
                size="sm"
                type="button"
                onClick={onBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                }}
              >
                <i className="bi bi-arrow-left me-1" />
                Back to Login
              </BrandButton>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="card-footer bg-light text-center py-3"
          style={{ borderRadius: '0 0 0.5rem 0.5rem' }}
        >
          <small className="text-muted">
            <i
              className="bi bi-shield-check me-1"
              style={{ color: MAHARDIKA_COLORS.gold }}
            />
            Your security is our priority
          </small>
        </div>
      </div>
    </div>
  );
}

// Example usage component for demonstration
export function ForgotPasswordExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      const { resetPassword } = await import('@/lib/supabase');
      await resetPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
