'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

const CustomerSignUpSchema = z.object({
  email: z.string().email('Valid email required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CustomerSignUpData = z.infer<typeof CustomerSignUpSchema>;

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    user_type: string;
  };
}

export default function CustomerSignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<CustomerSignUpData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Clear previous states
    setError(null);
    setSuccess(null);

    // Validate form
    const result = CustomerSignUpSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // Call the sign-up API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          user_type: 'customer',
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      if (data.success) {
        setSuccess(data.message || 'Account created successfully!');
        
        // Store user data in session storage for next step
        if (data.user) {
          sessionStorage.setItem('signup_user', JSON.stringify(data.user));
        }

        // Redirect to next step after a short delay
        setTimeout(() => {
          router.push('/auth/sign-up/customer/step-2');
        }, 1500);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const inputStyle = {
    borderRadius: '0.5rem',
    borderColor: colors.gray[300],
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    width: '100%',
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div
            className="card border-0 shadow-sm"
            style={{ backgroundColor: 'white' }}
          >
            <div className="card-body p-4">
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
                  Create Customer Account
                </h2>
                <p className="text-muted mb-0">
                  Step 1: Enter your basic information
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <div
                  className="alert alert-success mb-3"
                  style={{
                    borderRadius: '0.5rem',
                    backgroundColor: `${colors.success}10`,
                    borderColor: colors.success,
                    color: colors.success,
                  }}
                >
                  <div className="d-flex align-items-center">
                    <svg
                      className="me-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className="alert alert-danger mb-3"
                  style={{
                    borderRadius: '0.5rem',
                    backgroundColor: `${colors.error}10`,
                    borderColor: colors.error,
                    color: colors.error,
                  }}
                >
                  <div className="d-flex align-items-center">
                    <svg
                      className="me-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label fw-semibold"
                    style={{ color: colors.navy }}
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={isLoading}
                  />
                </div>

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
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={isLoading}
                  />
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
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={isLoading}
                  />
                  <div className="form-text">
                    Password must be at least 8 characters long
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label fw-semibold"
                    style={{ color: colors.navy }}
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <BrandButton
                    type="submit"
                    variant="navy"
                    size="lg"
                    fullWidth
                    disabled={isLoading || Boolean(success)}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </BrandButton>
                </div>

                {/* Back to Sign In */}
                <div className="text-center">
                  <p className="small text-muted mb-0">
                    Already have an account?{' '}
                    <a
                      href="/auth/sign-in"
                      style={{ color: colors.navy }}
                      className="text-decoration-none"
                    >
                      Sign in here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
