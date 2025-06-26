'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

interface AuthFormProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onRegister?: (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  className?: string;
}

export default function AuthForm({
  onLogin,
  onRegister,
  className = '',
}: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Register-specific validation
    if (activeTab === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (activeTab === 'login' && onLogin) {
        await onLogin(formData.email, formData.password);
      } else if (activeTab === 'register' && onRegister) {
        await onRegister(
          formData.email,
          formData.password,
          formData.confirmPassword,
          formData.firstName,
          formData.lastName
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `form-control ${errors ? 'border-danger' : ''}`;
  const inputStyle = {
    borderRadius: '0.5rem',
    borderColor: colors.gray[300],
    fontSize: '1rem',
    padding: '0.75rem 1rem',
  };

  return (
    <div className={className}>
      <BrandCard
        variant="navy-outline"
        size="lg"
        className="mx-auto"
        style={{ maxWidth: '500px', backgroundColor: 'white' }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.navy,
              borderRadius: '50%',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke={colors.gold}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke={colors.gold}
                strokeWidth="2"
              />
            </svg>
          </div>
          <h2 className="h3 fw-bold mb-2" style={{ color: colors.navy }}>
            Welcome to Mahardika
          </h2>
          <p className="text-muted mb-0">
            {activeTab === 'login'
              ? 'Sign in to your account to continue'
              : 'Create your account to get started'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4">
          <ul className="nav nav-pills nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <BrandButton
                variant={activeTab === 'login' ? 'navy' : 'outline-navy'}
                size="sm"
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrors({});
                }}
                style={{
                  borderRadius: '0.5rem 0 0 0.5rem',
                  borderRight: 'none',
                }}
              >
                Sign In
              </BrandButton>
            </li>
            <li className="nav-item" role="presentation">
              <BrandButton
                variant={activeTab === 'register' ? 'navy' : 'outline-navy'}
                size="sm"
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrors({});
                }}
                style={{
                  borderRadius: '0 0.5rem 0.5rem 0',
                  borderLeft: 'none',
                }}
              >
                Sign Up
              </BrandButton>
            </li>
          </ul>
        </div>

        {/* General Error */}
        {errors.general && (
          <div
            className="alert alert-danger"
            style={{
              borderRadius: '0.5rem',
              backgroundColor: `${colors.error}10`,
              borderColor: colors.error,
              color: colors.error,
            }}
          >
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Register-only fields */}
          {activeTab === 'register' && (
            <>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label
                    htmlFor="firstName"
                    className="form-label fw-semibold"
                    style={{ color: colors.navy }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={e =>
                      handleInputChange('firstName', e.target.value)
                    }
                    style={inputStyle}
                    required
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-6">
                  <label
                    htmlFor="lastName"
                    className="form-label fw-semibold"
                    style={{ color: colors.navy }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={e =>
                      handleInputChange('lastName', e.target.value)
                    }
                    style={inputStyle}
                    required
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label fw-semibold"
              style={{ color: colors.navy }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              style={inputStyle}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label fw-semibold"
              style={{ color: colors.navy }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              style={inputStyle}
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
            {activeTab === 'register' && (
              <div className="form-text">
                Password must be at least 8 characters long.
              </div>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {activeTab === 'register' && (
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="form-label fw-semibold"
                style={{ color: colors.navy }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={e =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                style={inputStyle}
                required
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
          )}

          {/* Terms and Conditions (Register only) */}
          {activeTab === 'register' && (
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                  style={{ borderColor: colors.navy }}
                />
                <label
                  className="form-check-label small"
                  htmlFor="terms"
                  style={{ color: colors.gray[600] }}
                >
                  I agree to the{' '}
                  <a
                    href="/terms"
                    style={{ color: colors.navy }}
                    className="text-decoration-none"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    style={{ color: colors.navy }}
                    className="text-decoration-none"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid mb-3">
            <BrandButton
              variant="navy"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="position-relative"
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {activeTab === 'login'
                    ? 'Signing In...'
                    : 'Creating Account...'}
                </>
              ) : (
                <>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </BrandButton>
          </div>

          {/* Forgot Password (Login only) */}
          {activeTab === 'login' && (
            <div className="text-center mb-3">
              <a
                href="/forgot-password"
                style={{ color: colors.navy, fontSize: '0.875rem' }}
                className="text-decoration-none"
              >
                Forgot your password?
              </a>
            </div>
          )}

          {/* Divider */}
          <div className="position-relative mb-3">
            <hr style={{ color: colors.gray[300] }} />
            <span
              className="position-absolute top-50 start-50 translate-middle px-3"
              style={{
                backgroundColor: 'white',
                color: colors.gray[500],
                fontSize: '0.875rem',
              }}
            >
              or
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="row g-2">
            <div className="col-6">
              <BrandButton
                variant="outline-navy"
                size="md"
                type="button"
                fullWidth
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  className="me-2"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </BrandButton>
            </div>
            <div className="col-6">
              <BrandButton
                variant="outline-navy"
                size="md"
                type="button"
                fullWidth
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  className="me-2"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </BrandButton>
            </div>
          </div>
        </form>

        {/* Footer Text */}
        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            {activeTab === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === 'login' ? 'register' : 'login')
              }
              style={{
                background: 'none',
                border: 'none',
                color: colors.navy,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </BrandCard>
    </div>
  );
}
