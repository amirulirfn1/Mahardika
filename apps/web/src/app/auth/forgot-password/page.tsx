'use client';
import { colors } from "@mahardika/ui";
/**
 * Forgot Password Page - Mahardika Platform
 * Demonstration page for the ForgotPasswordForm component
 * Brand Colors: Navy colors.navy, Gold colors.gold
 */


import React from 'react';
import { ForgotPasswordExample } from '@/components/auth/ForgotPasswordForm';
import { MAHARDIKA_COLORS } from '@/lib/env';

export default function ForgotPasswordPage() {
  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(
            135deg,
            ${MAHARDIKA_COLORS.navy} 0%,
            rgba(13, 27, 42, 0.8) 100%
          );
          min-height: 100vh;
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
        }

        .demo-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(244, 180, 0, 0.2);
        }

        .demo-title {
          color: ${MAHARDIKA_COLORS.gold};
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .demo-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }

        .demo-badge {
          background: linear-gradient(
            135deg,
            ${MAHARDIKA_COLORS.gold} 0%,
            rgba(244, 180, 0, 0.8) 100%
          );
          color: ${MAHARDIKA_COLORS.navy};
          font-weight: 600;
          border-radius: 0.5rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
        }

        .demo-footer {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(244, 180, 0, 0.2);
          color: rgba(255, 255, 255, 0.7);
        }

        .demo-link {
          color: ${MAHARDIKA_COLORS.gold};
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .demo-link:hover {
          color: rgba(244, 180, 0, 0.8);
          text-decoration: underline;
        }
      `}</style>

      <div className="min-vh-100 d-flex flex-column">
        {/* Header */}
        <header className="demo-header py-3">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="demo-title h3 mb-1">
                  🔐 Forgot Password Component
                </h1>
                <p className="demo-subtitle mb-0">
                  Mahardika Platform Authentication Demo
                </p>
              </div>
              <div className="col-auto">
                <span className="demo-badge">Bootstrap 5 + React</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex align-items-center">
          <ForgotPasswordExample />
        </main>

        {/* Footer */}
        <footer className="demo-footer py-3">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0">
                  <strong>Mahardika Platform</strong> - Multi-tenant SaaS
                  Solution
                </p>
                <small>
                  Brand Colors: Navy {MAHARDIKA_COLORS.navy} • Gold{' '}
                  {MAHARDIKA_COLORS.gold}
                </small>
              </div>
              <div className="col-md-6 text-md-end">
                <small>
                  <a href="/" className="demo-link me-3">
                    ← Back to Home
                  </a>
                  <a href="/auth/login" className="demo-link">
                    Login Page →
                  </a>
                </small>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
