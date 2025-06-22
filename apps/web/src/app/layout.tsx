import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { theme } from '@mahardika/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Mahardika - Professional Services Marketplace',
  description:
    'Find top-rated professionals for your business needs. Connect with experts in consulting, design, development, and more.',
  keywords: ['mahardika', 'marketplace', 'services', 'freelance', 'professionals', 'consulting'],
  openGraph: {
    title: 'Mahardika - Professional Services Marketplace',
    description: 'Find top-rated professionals for your business needs.',
    images: ['/og-image.png'],
  },
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
        <style dangerouslySetInnerHTML={{
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
        <ErrorBoundary>
          {/* Modern Navigation - Fiverr Inspired */}
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
                style={{ height: '72px' }}
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
                      color: theme.colors.primary,
                    }}
                  >
                    Mahardika
                  </span>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: theme.colors.primary,
                      borderRadius: '50%',
                      marginLeft: theme.spacing[2],
                    }}
                  />
                </Link>

                {/* Desktop Navigation */}
                <div className="d-none d-lg-flex align-items-center gap-4">
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
                      e.currentTarget.style.backgroundColor = theme.colors.hover.overlay;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Explore
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
                      e.currentTarget.style.backgroundColor = theme.colors.hover.overlay;
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
                    href="/dashboard"
                    style={{
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.medium,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.primary;
                      e.currentTarget.style.backgroundColor = theme.colors.hover.overlay;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    className="nav-link text-decoration-none px-3 py-2 rounded-lg" 
                    href="/marketplace"
                    style={{
                      color: theme.colors.primary,
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.semibold,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Become a Seller
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
                      color: 'white',
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
                    Join
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
                    <Link className="nav-link text-decoration-none" href="/agencies" style={{ color: theme.colors.text.secondary }}>
                      Explore
                    </Link>
                    <Link className="nav-link text-decoration-none" href="/shop" style={{ color: theme.colors.text.secondary }}>
                      Services
                    </Link>
                    <Link className="nav-link text-decoration-none" href="/dashboard" style={{ color: theme.colors.text.secondary }}>
                      Dashboard
                    </Link>
                    <Link className="nav-link text-decoration-none" href="/marketplace" style={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold }}>
                      Become a Seller
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
          <main style={{ minHeight: 'calc(100vh - 144px)' }}>
            {children}
          </main>

          {/* Modern Footer - Fiverr Inspired */}
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
                    Mahardika
                  </h5>
                  <p 
                    className="mb-4"
                    style={{
                      color: theme.colors.text.tertiary,
                      fontSize: theme.typography.fontSize.sm,
                      lineHeight: theme.typography.lineHeight.relaxed,
                    }}
                  >
                    Your trusted marketplace for professional services. Connect with top-rated 
                    experts and grow your business with confidence.
                  </p>
                  <div className="d-flex gap-3">
                    <a 
                      href="/privacy" 
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
                      href="/terms" 
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
                        Categories
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link href="/shop?category=design" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Graphics & Design
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/shop?category=development" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Programming & Tech
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/shop?category=marketing" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Digital Marketing
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/shop?category=writing" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Writing & Translation
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
                        For Clients
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link href="/how-it-works" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            How It Works
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/trust-safety" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Trust & Safety
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/quality" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Quality Guide
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
                        For Sellers
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link href="/become-seller" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Become a Seller
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/seller-guide" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Seller Guide
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/success-stories" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Success Stories
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
                        Company
                      </h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link href="/about" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            About Mahardika
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/careers" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Careers
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/press" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Press & News
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link href="/contact" className="text-decoration-none" style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
                            Contact Us
                          </Link>
                        </li>
                      </ul>
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
                  © 2024 Mahardika. All rights reserved.
                </p>
                <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                  <a href="#" aria-label="Facebook" style={{ color: theme.colors.text.tertiary }}>
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" aria-label="Twitter" style={{ color: theme.colors.text.tertiary }}>
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn" style={{ color: theme.colors.text.tertiary }}>
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" aria-label="Instagram" style={{ color: theme.colors.text.tertiary }}>
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ErrorBoundary>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
