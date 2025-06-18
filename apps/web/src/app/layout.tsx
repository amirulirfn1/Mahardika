import type { Metadata } from 'next';
import Link from 'next/link';
import { theme } from '@mahardika/ui';

export const metadata: Metadata = {
  title: 'Mahardika Platform',
  description:
    'Modern marketplace platform for services and solutions. Built with cutting-edge technology.',
  keywords: ['mahardika', 'marketplace', 'services', 'platform', 'modern'],
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
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${theme.colors.primary};
              --secondary: ${theme.colors.secondary};
              --background: ${theme.colors.background.primary};
              --text-primary: ${theme.colors.text.primary};
              --text-secondary: ${theme.colors.text.secondary};
              --border-light: ${theme.colors.border.light};
              --shadow-sm: ${theme.colors.shadow.sm};
              --shadow-md: ${theme.colors.shadow.md};
              --font-family: ${theme.typography.fontFamily.primary};
            }
          `
        }} />
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
        {/* Modern Navigation */}
        <nav
          style={{
            backgroundColor: theme.colors.background.primary,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.colors.shadow.sm,
          }}
        >
          <div className="container-fluid px-4">
            <div 
              className="d-flex align-items-center justify-content-between" 
              style={{ height: '80px' }}
            >
              {/* Logo */}
              <Link 
                className="navbar-brand fw-bold text-decoration-none d-flex align-items-center" 
                href="/"
                style={{
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  letterSpacing: theme.typography.letterSpacing.tight,
                }}
              >
                <span 
                  style={{
                    background: theme.colors.background.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Mahardika
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="d-none d-lg-flex align-items-center gap-4">
                <Link 
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg" 
                  href="/"
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.backgroundColor = theme.colors.hover.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.secondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Home
                </Link>
                <Link 
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg" 
                  href="/agencies"
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.backgroundColor = theme.colors.hover.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.secondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Services
                </Link>
                <Link 
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg" 
                  href="/shop"
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.backgroundColor = theme.colors.hover.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.secondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Marketplace
                </Link>
                <Link 
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg" 
                  href="/dashboard"
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.backgroundColor = theme.colors.hover.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.secondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Dashboard
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex align-items-center gap-3">
                <Link 
                  href="/auth"
                  className="btn text-decoration-none d-none d-md-inline-flex"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    border: 'none',
                    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.hover.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth"
                  className="btn text-decoration-none"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.text.inverse,
                    border: 'none',
                    padding: `${theme.spacing[2]} ${theme.spacing[5]}`,
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    boxShadow: theme.colors.shadow.sm,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.hover.primary;
                    e.currentTarget.style.boxShadow = theme.colors.shadow.md;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.boxShadow = theme.colors.shadow.sm;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Get Started
                </Link>

                {/* Mobile Menu Button */}
                <button
                  className="btn d-lg-none p-2"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#mobileNav"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme.colors.text.primary,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="collapse d-lg-none" id="mobileNav">
              <div className="py-4 border-top" style={{ borderColor: theme.colors.border.light }}>
                <div className="d-flex flex-column gap-3">
                  <Link className="nav-link text-decoration-none" href="/" style={{ color: theme.colors.text.secondary }}>
                    Home
                  </Link>
                  <Link className="nav-link text-decoration-none" href="/agencies" style={{ color: theme.colors.text.secondary }}>
                    Services
                  </Link>
                  <Link className="nav-link text-decoration-none" href="/shop" style={{ color: theme.colors.text.secondary }}>
                    Marketplace
                  </Link>
                  <Link className="nav-link text-decoration-none" href="/dashboard" style={{ color: theme.colors.text.secondary }}>
                    Dashboard
                  </Link>
                  <hr style={{ borderColor: theme.colors.border.light }} />
                  <Link className="nav-link text-decoration-none" href="/auth" style={{ color: theme.colors.text.secondary }}>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ minHeight: 'calc(100vh - 160px)' }}>
          {children}
        </main>

        {/* Modern Footer */}
        <footer
          style={{
            backgroundColor: theme.colors.background.secondary,
            borderTop: `1px solid ${theme.colors.border.light}`,
            marginTop: theme.spacing[20],
          }}
        >
          <div className="container py-5">
            <div className="row g-4">
              <div className="col-lg-4">
                <h5 
                  className="mb-3"
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  Mahardika Platform
                </h5>
                <p 
                  className="mb-4"
                  style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.sm,
                    lineHeight: theme.typography.lineHeight.relaxed,
                  }}
                >
                  Modern marketplace platform connecting businesses with top-tier services 
                  and solutions. Built for the future of digital commerce.
                </p>
                <div className="d-flex gap-3">
                  <a 
                    href="#" 
                    className="text-decoration-none"
                    style={{ 
                      color: theme.colors.text.tertiary,
                      fontSize: theme.typography.fontSize.sm,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = theme.colors.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = theme.colors.text.tertiary; }}
                  >
                    Privacy
                  </a>
                  <a 
                    href="#" 
                    className="text-decoration-none"
                    style={{ 
                      color: theme.colors.text.tertiary,
                      fontSize: theme.typography.fontSize.sm,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = theme.colors.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = theme.colors.text.tertiary; }}
                  >
                    Terms
                  </a>
                  <a 
                    href="#" 
                    className="text-decoration-none"
                    style={{ 
                      color: theme.colors.text.tertiary,
                      fontSize: theme.typography.fontSize.sm,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = theme.colors.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = theme.colors.text.tertiary; }}
                  >
                    Support
                  </a>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row g-4">
                  <div className="col-md-3">
                    <h6 
                      className="mb-3"
                      style={{
                        color: theme.colors.text.primary,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        letterSpacing: theme.typography.letterSpacing.wide,
                      }}
                    >
                      Platform
                    </h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <Link href="/agencies" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                          Services
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link href="/shop" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                          Marketplace
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link href="/dashboard" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                          Dashboard
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <h6 
                      className="mb-3"
                      style={{
                        color: theme.colors.text.primary,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        letterSpacing: theme.typography.letterSpacing.wide,
                      }}
                    >
                      Resources
                    </h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <Link href="/brand-showcase" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                          Brand Guide
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link href="/style-guide" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                          Style Guide
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 
                      className="mb-3"
                      style={{
                        color: theme.colors.text.primary,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        letterSpacing: theme.typography.letterSpacing.wide,
                      }}
                    >
                      Stay Updated
                    </h6>
                    <p style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing[3] }}>
                      Get the latest updates on new features and platform improvements.
                    </p>
                    <div className="d-flex gap-2">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter your email"
                        style={{
                          borderColor: theme.colors.border.light,
                          borderRadius: theme.borderRadius.lg,
                          padding: theme.spacing[3],
                          fontSize: theme.typography.fontSize.sm,
                        }}
                      />
                      <button 
                        className="btn"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.text.inverse,
                          border: 'none',
                          borderRadius: theme.borderRadius.lg,
                          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" style={{ borderColor: theme.colors.border.light }} />
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <p 
                className="mb-0"
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                © 2024 Mahardika Platform. All rights reserved.
              </p>
              <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                <span 
                  style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  Powered by modern design
                </span>
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                  }}
                />
              </div>
            </div>
          </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
