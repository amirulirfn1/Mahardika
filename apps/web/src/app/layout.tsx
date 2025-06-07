import type { Metadata } from 'next';
import { colors } from '@mahardika/ui';

export const metadata: Metadata = {
  title: 'Mahardika Platform',
  description: 'Mahardika Platform - Showcasing beautiful UI components with navy and gold branding',
  keywords: ['mahardika', 'ui', 'components', 'react', 'nextjs'],
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
        <meta name="theme-color" content={colors.navy} />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 50%, ${colors.navy} 100%)`,
          minHeight: '100vh',
          color: colors.white,
        }}
      >
        {children}
      </body>
    </html>
  );
} 