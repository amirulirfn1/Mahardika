import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { theme } from '@mahardika/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

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
        <meta name="theme-color" content={theme.colors.primary} />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary: ${theme.colors.primary};
              --secondary: ${theme.colors.secondary};
              --accent: ${theme.colors.accent};
              --success: ${theme.colors.success};
              --warning: ${theme.colors.warning};
              --error: ${theme.colors.error};
              --background: ${theme.colors.background.primary};
              --text-primary: ${theme.colors.text.primary};
              --text-secondary: ${theme.colors.text.secondary};
              --border-light: ${theme.colors.border.light};
              --shadow-sm: ${theme.colors.shadow.sm};
              --shadow-md: ${theme.colors.shadow.md};
              --font-family: ${theme.typography.fontFamily.primary};
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 10px;
              height: 10px;
            }
            
            ::-webkit-scrollbar-track {
              background: ${theme.colors.background.secondary};
            }
            
            ::-webkit-scrollbar-thumb {
              background: ${theme.colors.gray[400]};
              border-radius: 5px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: ${theme.colors.gray[500]};
            }
          `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: theme.typography.fontFamily.primary,
          backgroundColor: theme.colors.background.primary,
          color: theme.colors.text.primary,
          lineHeight: theme.typography.lineHeight.normal,
        }}
      >
        <ErrorBoundary>
          <Navigation />

          {/* Main Content */}
          <main style={{ minHeight: 'calc(100vh - 144px)' }}>{children}</main>

          <Footer />
        </ErrorBoundary>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async/>
      </body>
    </html>
  );
}
