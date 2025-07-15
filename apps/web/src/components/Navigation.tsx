'use client';

import { colors, BrandButton, theme } from '@mah/ui';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';

export function Navigation() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
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
              onMouseEnter={e => {
                e.currentTarget.style.color = theme.colors.primary;
                e.currentTarget.style.backgroundColor =
                  theme.colors.hover.overlay;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = theme.colors.text.secondary;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {t('navbar.explore')}
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
              onMouseEnter={e => {
                e.currentTarget.style.color = theme.colors.primary;
                e.currentTarget.style.backgroundColor =
                  theme.colors.hover.overlay;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = theme.colors.text.secondary;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {t('navbar.services')}
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
              onMouseEnter={e => {
                e.currentTarget.style.color = theme.colors.primary;
                e.currentTarget.style.backgroundColor =
                  theme.colors.hover.overlay;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = theme.colors.text.secondary;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {t('navbar.dashboard')}
            </Link>

            {/* Authentication */}
            <div className="d-flex align-items-center gap-2">
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <BrandButton variant="outline-navy" size="sm">
                  {t('navbar.signin')}
                </BrandButton>
              </Link>
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <BrandButton variant="navy" size="sm">
                  {t('navbar.join')}
                </BrandButton>
              </Link>
            </div>

            {/* Settings Menu */}
            <SettingsMenu />
          </div>

          {/* Mobile Menu Button */}
          <BrandButton
            variant="outline-navy"
            size="sm"
            onClick={toggleMobileMenu}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              fontSize: '1.25rem',
            }}
            aria-label="Toggle menu"
            className="d-lg-none"
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`} />
          </BrandButton>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="d-lg-none">
            <div
              className="py-3"
              style={{
                borderTop: `1px solid ${theme.colors.border.light}`,
                backgroundColor: theme.colors.background.primary,
              }}
            >
              <div className="d-flex flex-column gap-3">
                <Link
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg"
                  href="/agencies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {t('navbar.explore')}
                </Link>
                <Link
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg"
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {t('navbar.services')}
                </Link>
                <Link
                  className="nav-link text-decoration-none px-3 py-2 rounded-lg"
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {t('navbar.dashboard')}
                </Link>

                {/* Mobile Authentication */}
                <div className="d-flex gap-2 px-3 pt-2">
                  <Link href="/auth" style={{ textDecoration: 'none' }}>
                    <BrandButton
                      variant="outline-navy"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('navbar.signin')}
                    </BrandButton>
                  </Link>
                  <Link href="/auth" style={{ textDecoration: 'none' }}>
                    <BrandButton
                      variant="navy"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('navbar.join')}
                    </BrandButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
