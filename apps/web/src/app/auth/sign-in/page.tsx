'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { signInAction, redirectToDashboardAction } from '@/app/(auth)/signin/actions';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInAction(email, password);

      if (result.success && result.user) {
        // Redirect to appropriate dashboard based on user type
        await redirectToDashboardAction(result.user);
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <AuthForm
        onLogin={handleLogin}
        className="mx-auto"
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
