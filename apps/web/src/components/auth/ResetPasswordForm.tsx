'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updatePassword } from '@/lib/supabase';
import { MAHARDIKA_COLORS } from '@/lib/env';
import { BrandButton } from '@mah/ui';

export default function ResetPasswordForm() {
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
                      <i className="bi bi-check-circle-fill" />
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
                className="card shadow"
                style={{
                  borderRadius: '0.5rem',
                  border: `2px solid ${MAHARDIKA_COLORS.navy}`,
                  backgroundColor: 'white',
                }}
              >
                <div className="card-body p-4 p-sm-5">
                  <div className="text-center mb-4">
                    <h2
                      className="card-title"
                      style={{ color: MAHARDIKA_COLORS.navy }}
                    >
                      Reset Your Password
                    </h2>
                    <p className="card-text text-muted">
                      Create a new, strong password.
                    </p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label"
                        style={{ color: MAHARDIKA_COLORS.navy }}
                      >
                        New Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: error ? 'red' : MAHARDIKA_COLORS.navy,
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label"
                        style={{ color: MAHARDIKA_COLORS.navy }}
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        required
                        style={{
                          borderRadius: '0.5rem',
                          borderColor: error ? 'red' : MAHARDIKA_COLORS.navy,
                        }}
                      />
                    </div>

                    <div className="d-grid">
                      <BrandButton
                        variant="gold"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="ms-2">Resetting...</span>
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </BrandButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
