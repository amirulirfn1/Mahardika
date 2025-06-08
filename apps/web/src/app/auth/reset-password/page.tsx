/**
 * Reset Password Page - Mahardika Platform
 * Handles password reset after email verification
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updatePassword } from '@/lib/supabase';
import { MAHARDIKA_COLORS } from '@/lib/env';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we have the required tokens from the URL
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setError(errorDescription || 'Invalid reset link. Please try again.');
    }
  }, [searchParams]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setIsSuccess(true);

      // Redirect to login after success
      setTimeout(() => {
        router.push('/auth?message=Password updated successfully');
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <style jsx global>{`
          body {
            background: linear-gradient(
              135deg,
              ${MAHARDIKA_COLORS.navy} 0%,
              rgba(13, 27, 42, 0.8) 100%
            );
            min-height: 100vh;
            font-family:
              'Inter',
              -apple-system,
              BlinkMacSystemFont,
              'Segoe UI',
              Roboto,
              sans-serif;
          }
        `}</style>

        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm"
                  style={{
                    borderRadius: '0.5rem',
                    border: `2px solid ${MAHARDIKA_COLORS.gold}`,
                  }}
                >
                  <div className="card-body text-center p-4">
                    <div
                      className="mb-3"
                      style={{ color: MAHARDIKA_COLORS.gold, fontSize: '3rem' }}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <h4
                      className="card-title mb-3"
                      style={{ color: MAHARDIKA_COLORS.navy }}
                    >
                      Password Updated!
                    </h4>
                    <p className="card-text text-muted mb-4">
                      Your password has been successfully updated. You will be
                      redirected to the login page.
                    </p>
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ color: MAHARDIKA_COLORS.gold }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <style jsx global>{`
        body {
          background: linear-gradient(
            135deg,
            ${MAHARDIKA_COLORS.navy} 0%,
            rgba(13, 27, 42, 0.8) 100%
          );
          min-height: 100vh;
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
        }

        .form-control:focus {
          border-color: ${MAHARDIKA_COLORS.gold};
          box-shadow: 0 0 0 0.2rem rgba(244, 180, 0, 0.25);
        }

        .btn-primary {
          background: linear-gradient(
            135deg,
            ${MAHARDIKA_COLORS.gold} 0%,
            rgba(244, 180, 0, 0.9) 100%
          );
          border: none;
          color: ${MAHARDIKA_COLORS.navy};
          font-weight: 600;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(244, 180, 0, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <div
                className="card shadow-sm"
                style={{ borderRadius: '0.5rem' }}
              >
                {/* Header */}
                <div
                  className="card-header text-center py-4"
                  style={{
                    background: `linear-gradient(135deg, ${MAHARDIKA_COLORS.navy} 0%, rgba(13, 27, 42, 0.9) 100%)`,
                    color: 'white',
                    borderRadius: '0.5rem 0.5rem 0 0',
                  }}
                >
                  <div
                    className="mb-2"
                    style={{ color: MAHARDIKA_COLORS.gold, fontSize: '2.5rem' }}
                  >
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <h3 className="mb-1">Reset Password</h3>
                  <p className="mb-0 opacity-75">Enter your new password</p>
                </div>

                {/* Form */}
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        New Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                          autoComplete="new-password"
                          autoFocus
                        />
                      </div>
                      <div className="form-text">
                        Password must be at least 8 characters with uppercase,
                        lowercase, and number
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label fw-semibold"
                      >
                        Confirm New Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !password || !confirmPassword}
                        style={{
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1.5rem',
                        }}
                      >
                        {isLoading ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              style={{ width: '1rem', height: '1rem' }}
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Password
                          </>
                        )}
                      </button>
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
                    ></i>
                    Your security is our priority
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
