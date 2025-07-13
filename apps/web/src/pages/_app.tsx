import '../styles/globals.css';
import { AppShell } from '@mahardika/ui';
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ConsentBanner } from '@/components/ConsentBanner';
import Providers from './providers';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mahardika - Professional Services Marketplace</title>
        <meta
          name="description"
          content="Find top-rated professionals for your business needs. Connect with experts in consulting, design, development, and more."
        />
        <meta
          name="keywords"
          content="mahardika, marketplace, services, freelance, professionals, consulting"
        />
        <meta
          property="og:title"
          content="Mahardika - Professional Services Marketplace"
        />
        <meta
          property="og:description"
          content="Find top-rated professionals for your business needs."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen antialiased">
        <Providers>
          <ErrorBoundary>
            <AppShell>
              <Component {...pageProps} />
            </AppShell>
            <ConsentBanner showDetailedOptions={true} />
          </ErrorBoundary>
        </Providers>
      </div>
    </>
  );
}
