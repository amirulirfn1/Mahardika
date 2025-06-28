'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (
    email: string,
    password: string,
    _confirmPassword: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        alert(error.message);
      } else {
        alert('Check your inbox to confirm your email!');
        router.push('/auth/check-email');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <AuthForm
        onRegister={handleRegister}
        className="mx-auto"
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
} 