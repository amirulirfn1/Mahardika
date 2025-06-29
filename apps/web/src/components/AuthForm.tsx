'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';
import { supabaseClient } from '@/lib/supabaseClient';

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
  isLoading?: boolean;
  error?: string | null;
}

export default function AuthForm({
  onLogin,
  onRegister,
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null,
}: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [internalLoading, setInternalLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalLoading || internalLoading;
  // Use external error if provided, otherwise use internal
  const error = externalError || errors.general;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (externalError) {
      // Clear external error when user starts typing
      setErrors(prev => ({ ...prev, general: '' }));
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

    // Only use internal loading if external loading is not provided
    if (!externalLoading) {
      setInternalLoading(true);
    }
    
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
      if (!externalLoading) {
        setInternalLoading(false);
      }
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

        {/* OAuth buttons */}
        <div className="mb-3 text-center">
          <BrandButton
            variant="outline-navy"
            className="me-2"
            onClick={() => {
              supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            }}
          >
            Continue with Google
          </BrandButton>
          <BrandButton
            variant="outline-navy"
            onClick={() => {
              supabaseClient.auth.signInWithOAuth({
                provider: 'facebook',
                options: { redirectTo: `${window.location.origin}/auth/callback` },
              });
            }}
          >
            Facebook
          </BrandButton>
        </div>

        {/* General Error */}
        {error && (
          <div
            className="alert alert-danger"
            style={{
              borderRadius: '0.5rem',
              backgroundColor: `${colors.error}10`,
              borderColor: colors.error,
              color: colors.error,
            }}
          >
            {error}
          </div>
        )}

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading}
            >
              {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </BrandCard>
    </div>
  );
}
