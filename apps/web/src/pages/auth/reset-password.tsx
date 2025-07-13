import { colors } from "@mahardika/ui";
/**
 * Reset Password Page - Mahardika Platform
 * Handles password reset after email verification
 * Brand Colors: Navy colors.navy, Gold colors.gold
 */

import React, { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
