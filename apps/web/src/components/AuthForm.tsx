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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleOAuthSignIn = async (
    provider: 'google' | 'github' | 'discord' | 'spotify'
  ) => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
      setErrors({
        general: `Failed to sign in with ${provider}. Please try again.`,
      });
    }
  };

  const oauthProviders = [
    {
      name: 'Google',
      provider: 'google' as const,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285f4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34a853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#fbbc05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#ea4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      style:
        'bg-white border-2 border-gray-200 text-gray-700 shadow-sm hover:shadow-md',
    },
    {
      name: 'GitHub',
      provider: 'github' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
      style:
        'bg-gray-900 border-2 border-gray-900 text-white shadow-sm hover:shadow-md',
    },
    {
      name: 'Discord',
      provider: 'discord' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.067-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.313-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.067-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.313-.946 2.38-2.157 2.38z" />
        </svg>
      ),
      style:
        'bg-indigo-600 border-2 border-indigo-600 text-white shadow-sm hover:shadow-md',
    },
    {
      name: 'Spotify',
      provider: 'spotify' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
      style:
        'bg-green-500 border-2 border-green-500 text-white shadow-sm hover:shadow-md',
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 -z-10" />

      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg">
              <svg
                width="32"
                height="32"
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
            <h1 className="text-2xl font-bold text-primary mb-2">
              Welcome to Mahardika
            </h1>
            <p className="text-gray-600">
              {activeTab === 'login'
                ? 'Sign in to your account to continue'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {oauthProviders.map(provider => (
                <button
                  key={provider.name}
                  type="button"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${provider.style}`}
                  onClick={() => handleOAuthSignIn(provider.provider)}
                  disabled={isLoading}
                >
                  {provider.icon}
                  <span className="hidden sm:inline font-medium text-sm">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* General Error */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => {
                  setActiveTab('login');
                  setErrors({});
                }}
                disabled={isLoading}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => {
                  setActiveTab('register');
                  setErrors({});
                }}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Register-only fields */}
            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.firstName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    value={formData.firstName}
                    onChange={e =>
                      handleInputChange('firstName', e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.lastName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    value={formData.lastName}
                    onChange={e =>
                      handleInputChange('lastName', e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              {activeTab === 'register' && (
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long.
                </p>
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {activeTab === 'register' && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.confirmPassword
                        ? 'border-red-300'
                        : 'border-gray-200'
                    }`}
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Terms and Conditions (Register only) */}
            {activeTab === 'register' && (
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a
                    href="/terms"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {activeTab === 'login'
                    ? 'Signing In...'
                    : 'Creating Account...'}
                </div>
              ) : (
                <>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>

            {/* Forgot Password (Login only) */}
            {activeTab === 'login' && (
              <div className="text-center">
                <a
                  href="/auth/forgot-password"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </form>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {activeTab === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === 'login' ? 'register' : 'login')
                }
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
