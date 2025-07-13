'use client';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { colors } from '@mahardika/ui';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    async function handleAuth() {
      try {
        setStatus('loading');
        setMessage('Processing authentication...');

        const { data, error } = await supabaseClient.auth.getSession();
        const { session } = data;

        // If no session, try to exchange code for session
        if (!session) {
          const { data: exchanged, error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            setTimeout(() => router.push('/auth/sign-in'), 3000);
            return;
          }
          const { session } = exchanged;
        }

        if (!session?.user) {
          setStatus('error');
          setMessage('No user session found. Redirecting to sign in...');
          setTimeout(() => router.push('/auth/sign-in'), 3000);
          return;
        }

        // Get user information
        const { id, email = '', user_metadata } = session.user;
        const name = user_metadata?.full_name || user_metadata?.name || '';

        // Create or update user profile
        try {
          const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id,
              email,
              name,
              agency_id: '',
            }),
          });

          if (!response.ok) {
            console.warn('Failed to create/update user profile');
          }
        } catch (profileError) {
          console.warn('Profile creation error:', profileError);
          // Don't fail authentication if profile creation fails
        }

        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);

      } catch (e) {
        console.error('Authentication error:', e);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => router.push('/auth/sign-in'), 3000);
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: `linear-gradient(135deg, ${colors.navy}15 0%, ${colors.gold}10 100%)`,
    }}>
      <div className="text-center p-5" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '400px',
        width: '100%',
        margin: '0 1rem',
      }}>
        {status === 'loading' && (
          <>
            <div 
              className="spinner-border mb-3" 
              role="status"
              style={{ 
                color: colors.navy,
                width: '3rem',
                height: '3rem',
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="h5 fw-bold mb-2" style={{ color: colors.navy }}>
              Authenticating...
            </h3>
            <p className="text-muted mb-0">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div 
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successDark} 100%)`,
                borderRadius: '50%',
                margin: '0 auto',
              }}
            >
              <svg width="30" height="30" fill="white" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="h5 fw-bold mb-2" style={{ color: colors.successDark }}>
              Success!
            </h3>
            <p className="text-muted mb-0">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div 
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${colors.error} 0%, ${colors.errorDark} 100%)`,
                borderRadius: '50%',
                margin: '0 auto',
              }}
            >
              <svg width="30" height="30" fill="white" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="h5 fw-bold mb-2" style={{ color: colors.errorDark }}>
              Authentication Failed
            </h3>
            <p className="text-muted mb-0">{message}</p>
          </>
        )}
      </div>
    </div>
  );
} 