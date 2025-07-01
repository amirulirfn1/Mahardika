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

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord' | 'spotify') => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
      setErrors({ general: `Failed to sign in with ${provider}. Please try again.` });
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
      style: { 
        background: 'white', 
        border: '2px solid #e5e7eb', 
        color: '#374151',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }
    },
    {
      name: 'GitHub',
      provider: 'github' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      ),
      style: { 
        background: '#24292e', 
        color: 'white',
        border: '2px solid #24292e',
        boxShadow: '0 1px 3px rgba(36, 41, 46, 0.3)'
      }
    },
    {
      name: 'Discord',
      provider: 'discord' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.067-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.313-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.067-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.313-.946 2.38-2.157 2.38z"/>
        </svg>
      ),
      style: { 
        background: '#5865f2', 
        color: 'white',
        border: '2px solid #5865f2',
        boxShadow: '0 1px 3px rgba(88, 101, 242, 0.3)'
      }
    },
    {
      name: 'Spotify',
      provider: 'spotify' as const,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
      style: { 
        background: '#1db954', 
        color: 'white',
        border: '2px solid #1db954',
        boxShadow: '0 1px 3px rgba(29, 185, 84, 0.3)'
      }
    },
  ];

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center py-5 ${className}`}>
      <style jsx>{`
        .auth-container {
          background: linear-gradient(135deg, ${colors.navy}15 0%, ${colors.gold}10 100%);
          backdrop-filter: blur(10px);
          min-height: 100vh;
        }
        
        .auth-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: all 0.3s ease;
        }
        
        .auth-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3);
        }
        
        .form-control {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(13, 27, 42, 0.1);
          transition: all 0.3s ease;
          font-size: 1rem;
          padding: 0.875rem 1rem;
        }
        
        .form-control:focus {
          background: rgba(255, 255, 255, 1);
          border-color: ${colors.navy};
          box-shadow: 0 0 0 0.25rem rgba(13, 27, 42, 0.15);
          transform: translateY(-1px);
        }
        
        .oauth-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none !important;
          font-weight: 500;
          padding: 0.875rem 1rem;
          position: relative;
          overflow: hidden;
          font-size: 0.875rem;
          min-height: 44px;
        }
        
        .oauth-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .oauth-btn:hover::before {
          left: 100%;
        }
        
        .oauth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        }
        
        .oauth-btn:active {
          transform: translateY(0);
        }
        
        .tab-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .tab-button::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: ${colors.gold};
          transition: width 0.3s ease;
        }
        
        .tab-button.active::after {
          width: 100%;
        }
        
        .floating-label {
          position: relative;
        }
        
        .floating-label input:focus + label,
        .floating-label input:not(:placeholder-shown) + label {
          transform: translateY(-1.5rem) scale(0.8);
          color: ${colors.navy};
        }
        
        .floating-label label {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          background: white;
          padding: 0 0.5rem;
          transition: all 0.3s ease;
          pointer-events: none;
          color: #6b7280;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          z-index: 10;
        }
        
        .password-toggle:hover {
          color: ${colors.navy};
        }
        
        .w-4 {
          width: 1rem;
        }
        
        .h-4 {
          height: 1rem;
        }
      `}</style>
      
      <div className="auth-container position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: -1 }} />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="auth-card animate-fade-in" style={{ borderRadius: '1rem', padding: '3rem 2rem' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navy}dd 100%)`,
                    borderRadius: '50%',
                    boxShadow: '0 10px 30px rgba(13, 27, 42, 0.3)',
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
                <h1 className="h3 fw-bold mb-2" style={{ color: colors.navy }}>
                  Welcome to Mahardika
                </h1>
                <p className="text-muted mb-0">
                  {activeTab === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Create your account to get started'}
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="mb-4">
                <div className="row g-2">
                  {oauthProviders.map((provider) => (
                    <div key={provider.name} className="col-6">
                      <button
                        type="button"
                        className="oauth-btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                          ...provider.style,
                          borderRadius: '0.75rem',
                        }}
                        onClick={() => handleOAuthSignIn(provider.provider)}
                        disabled={isLoading}
                      >
                        {provider.icon}
                        <span className="d-none d-sm-inline fw-medium">{provider.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="position-relative mb-4">
                <hr style={{ color: '#e5e7eb', opacity: 0.5 }} />
                <span
                  className="position-absolute top-50 start-50 translate-middle px-3"
                  style={{
                    backgroundColor: 'white',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  or continue with email
                </span>
              </div>

              {/* General Error */}
              {error && (
                <div
                  className="alert alert-danger mb-4 animate-fade-in"
                  style={{
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    borderColor: '#f87171',
                    color: '#dc2626',
                    border: '1px solid #f87171',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <svg className="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="mb-4">
                <div className="d-flex rounded-pill" style={{ background: '#f3f4f6', padding: '0.25rem' }}>
                  <button
                    type="button"
                    className={`tab-button flex-1 py-2 px-3 rounded-pill fw-medium border-0 ${
                      activeTab === 'login' ? 'active' : ''
                    }`}
                    style={{
                      background: activeTab === 'login' ? 'white' : 'transparent',
                      color: activeTab === 'login' ? colors.navy : '#6b7280',
                      boxShadow: activeTab === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
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
                    className={`tab-button flex-1 py-2 px-3 rounded-pill fw-medium border-0 ${
                      activeTab === 'register' ? 'active' : ''
                    }`}
                    style={{
                      background: activeTab === 'register' ? 'white' : 'transparent',
                      color: activeTab === 'register' ? colors.navy : '#6b7280',
                      boxShadow: activeTab === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
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
              <form onSubmit={handleSubmit} className="animate-fade-in">
                {/* Register-only fields */}
                {activeTab === 'register' && (
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="floating-label">
                        <input
                          id="firstName"
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          placeholder=" "
                          value={formData.firstName}
                          onChange={e => handleInputChange('firstName', e.target.value)}
                          required
                          disabled={isLoading}
                          style={{ borderRadius: '0.75rem' }}
                        />
                        <label htmlFor="firstName" style={{ color: colors.navy, fontWeight: '500' }}>
                          First Name
                        </label>
                        {errors.firstName && (
                          <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="floating-label">
                        <input
                          id="lastName"
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          placeholder=" "
                          value={formData.lastName}
                          onChange={e => handleInputChange('lastName', e.target.value)}
                          required
                          disabled={isLoading}
                          style={{ borderRadius: '0.75rem' }}
                        />
                        <label htmlFor="lastName" style={{ color: colors.navy, fontWeight: '500' }}>
                          Last Name
                        </label>
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="mb-3">
                  <div className="floating-label">
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder=" "
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ borderRadius: '0.75rem' }}
                    />
                    <label htmlFor="email" style={{ color: colors.navy, fontWeight: '500' }}>
                      Email Address
                    </label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <div className="floating-label position-relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder=" "
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ borderRadius: '0.75rem', paddingRight: '3rem' }}
                    />
                    <label htmlFor="password" style={{ color: colors.navy, fontWeight: '500' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                    {activeTab === 'register' && (
                      <div className="form-text mt-2">
                        Password must be at least 8 characters long.
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {activeTab === 'register' && (
                  <div className="mb-3">
                    <div className="floating-label position-relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder=" "
                        value={formData.confirmPassword}
                        onChange={e => handleInputChange('confirmPassword', e.target.value)}
                        required
                        disabled={isLoading}
                        style={{ borderRadius: '0.75rem', paddingRight: '3rem' }}
                      />
                      <label htmlFor="confirmPassword" style={{ color: colors.navy, fontWeight: '500' }}>
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showConfirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
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
                        disabled={isLoading}
                        style={{ 
                          borderColor: colors.navy,
                          borderRadius: '0.25rem',
                        }}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="terms"
                        style={{ color: '#6b7280' }}
                      >
                        I agree to the{' '}
                        <a
                          href="/terms"
                          style={{ color: colors.navy }}
                          className="text-decoration-none fw-medium"
                        >
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                          href="/privacy"
                          style={{ color: colors.navy }}
                          className="text-decoration-none fw-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-lg position-relative"
                    style={{
                      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navy}dd 100%)`,
                      border: 'none',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontWeight: '600',
                      padding: '0.875rem',
                      transition: 'all 0.3s ease',
                      transform: isLoading ? 'none' : 'translateY(0)',
                      boxShadow: isLoading ? 'none' : `0 10px 25px ${colors.navy}40`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 15px 35px ${colors.navy}50`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 10px 25px ${colors.navy}40`;
                      }
                    }}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div 
                          className="spinner-border spinner-border-sm me-2" 
                          role="status"
                          style={{ width: '1rem', height: '1rem' }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      <>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</>
                    )}
                  </button>
                </div>

                {/* Forgot Password (Login only) */}
                {activeTab === 'login' && (
                  <div className="text-center mb-3">
                    <a
                      href="/auth/forgot-password"
                      style={{ 
                        color: colors.navy, 
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                      className="hover-underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                )}
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
                      fontWeight: '500',
                    }}
                    disabled={isLoading}
                  >
                    {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
