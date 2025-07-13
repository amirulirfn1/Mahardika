"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Session } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/env';
import Link from 'next/link';

interface Quotation {
  id: string;
  file_url: string;
  created_at: string;
}

const CustomerQuotationsPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const customerId = session?.user?.id;
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client once
  const [supabase] = useState(() => {
    const { url, anonKey } = getSupabaseConfig();
    return createBrowserClient(url, anonKey);
  });

  // Fetch current session on mount and subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}/quotations`)
      .then(r => r.json())
      .then(setQuotes)
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (!customerId) {
    return <div>Please sign in to view your quotations.</div>;
  }
  return (
    <div className="container py-4">
      <h2>My Quotations</h2>
      {quotes.length === 0 ? (
        <p>No quotations available.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, idx) => (
              <tr key={q.id}>
                <td>{idx + 1}</td>
                <td>{new Date(q.created_at).toLocaleDateString()}</td>
                <td>
                  <Link href={q.file_url} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerQuotationsPage; 
