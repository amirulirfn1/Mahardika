'use client';
import { useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        let session = data.session;

        if (!session) {
          const { data: exchanged } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);
          session = exchanged.session;
        }
        if (!session?.user) {
          // No session found
          return;
        }
        // upsert profile
        const { id, email = '', user_metadata } = session.user;
        const name = user_metadata?.name ?? '';
        await prisma.user.upsert({
          where: { id },
          create: { id, email, name, agency_id: '' },
          update: { email },
        }).catch(() => {});

        router.replace('/dashboard');
      } catch (e) {
        // Handle error (could log to monitoring service)
      }
    }
    handleAuth();
  }, [router]);

  return <p className="p-4">Signing in…</p>;
} 