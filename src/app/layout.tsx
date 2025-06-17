import type { Metadata } from 'next';
import Link from 'next/link';
import { colors } from '@mahardika/ui';

export const metadata: Metadata = {
  title: 'Mahardika Platform',
  description:
    'Mahardika Platform - Showcasing beautiful UI components with navy and gold branding',
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
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: colors.gray[50],
        }}
      >
        {/* Global Navigation */}
        <nav
          className="navbar navbar-expand-lg shadow-sm"
          style={{
            backgroundColor: colors.navy,
            borderBottom: `3px solid ${colors.gold}`,
          }}
        >
          <div className="container">
            <Link 
              className="navbar-brand fw-bold text-white text-decoration-none" 
              href="/"
            >
              Mahardika
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              style={{ borderColor: colors.gold }}
            >
              <span
                className="navbar-toggler-icon"
                style={{ filter: 'invert(1)' }}
              />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link text-white text-decoration-none" href="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white text-decoration-none" href="/agencies">
                    Agencies
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white text-decoration-none" href="/shop">
                    Shop
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white text-decoration-none" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white text-decoration-none" href="/brand-showcase">
                    Brand
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Global Footer */}
        <footer
          className="py-5 mt-5"
          style={{
            backgroundColor: colors.navy,
            borderTop: `3px solid ${colors.gold}`,
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <h5 className="text-white mb-3">Mahardika Platform</h5>
                <p className="text-white-50 mb-3">
                  Empowering businesses with intelligent solutions, seamless integrations, 
                  and cutting-edge technology.
                </p>
                <div className="d-flex gap-3">
                  <Link href="/terms" className="text-white-50 text-decoration-none">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-white-50 text-decoration-none">
                    Privacy
                  </Link>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <p className="text-white-50 mb-0">
                  Built with ❤️ using our brand colors:
                </p>
                <p className="text-white-50 mb-0">
                  <span style={{ color: colors.navy, backgroundColor: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '0.85rem' }}>
                    Navy {colors.navy}
                  </span>
                  {' • '}
                  <span style={{ color: colors.navy, backgroundColor: colors.gold, padding: '2px 6px', borderRadius: '3px', fontSize: '0.85rem' }}>
                    Gold {colors.gold}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
