import './globals.css';
import { AppShell } from '@mahardika/ui';
import React from 'react';
import type { Metadata } from 'next';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ConsentBanner } from '@/components/ConsentBanner';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Mahardika - Professional Services Marketplace',
  description:
    'Find top-rated professionals for your business needs. Connect with experts in consulting, design, development, and more.',
  keywords: [
    'mahardika',
    'marketplace',
    'services',
    'freelance',
    'professionals',
    'consulting',
  ],
  openGraph: {
    title: 'Mahardika - Professional Services Marketplace',
    description: 'Find top-rated professionals for your business needs.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('http://localhost:3002'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <ErrorBoundary>
            <AppShell>{children}</AppShell>
            <ConsentBanner showDetailedOptions={true} />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
