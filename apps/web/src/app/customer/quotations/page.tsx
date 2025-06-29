"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from '@supabase/ssr';
import Link from 'next/link';
import TierBadge from '@/components/TierBadge';

interface Quotation {
  id: string;
  file_url: string;
  created_at: string;
}

const CustomerQuotationsPage = () => {
  const { session } = useSession();
  const customerId = session?.user?.id; // assuming
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}/quotations`)
      .then((r) => r.json())
      .then(setQuotes)
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
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