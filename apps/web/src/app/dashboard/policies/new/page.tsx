'use client';
import React from 'react';
import { PolicyWizard, PolicyWizardResult } from '@/components';
import { useRouter } from 'next/navigation';

export default function NewPolicyPage() {
  const router = useRouter();

  const handleComplete = async (data: PolicyWizardResult) => {
    const res = await fetch('/api/policies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const policy = await res.json();
    router.push(`/dashboard/policies/${policy.id}/edit`);
  };

  return (
    <div className="container py-4">
      <h2>Create Policy</h2>
      <PolicyWizard onComplete={handleComplete} />
    </div>
  );
} 