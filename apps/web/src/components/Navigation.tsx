'use client';


import { colors, BrandButton, theme } from '@mahardika/ui';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import SettingsMenu from './SettingsMenu';


export function Navigation() {
  const { t } = useTranslation();
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
                <BrandButton
                  variant="outline-navy"
                  size="sm"
                >
                  {t('navbar.signin')}
                </BrandButton>
              </Link>
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <BrandButton
                  variant="navy"
                  size="sm"
                >
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
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              fontSize: '1.25rem',
            }}
            aria-label="Toggle menu"
          >
            <i className="bi bi-list" />
          </BrandButton>
        </div>
      </div>
    </nav>
  );
}
