'use client';

import React from 'react';
import Link from 'next/link';
import { theme } from '@mahardika/ui';

export function Footer() {
  return (
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
              Your trusted marketplace for professional services. Connect with
              top-rated experts and grow your business with confidence.
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
                onMouseEnter={e => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = theme.colors.text.tertiary;
                }}
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
                onMouseEnter={e => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = theme.colors.text.tertiary;
                }}
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
                onMouseEnter={e => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = theme.colors.text.tertiary;
                }}
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
                    <Link
                      href="/shop?category=design"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Graphics & Design
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/shop?category=development"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Programming & Tech
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/shop?category=marketing"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Digital Marketing
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/shop?category=writing"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
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
                    <Link
                      href="/how-it-works"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      How It Works
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/trust-safety"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Trust & Safety
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/quality"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
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
                    <Link
                      href="/become-seller"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Become a Seller
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/seller-guide"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Seller Guide
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/success-stories"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
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
                    <Link
                      href="/about"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      About Mahardika
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/careers"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Careers
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/press"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Press & News
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/contact"
                      className="text-decoration-none"
                      style={{
                        color: theme.colors.text.tertiary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr
          className="my-4"
          style={{ borderColor: theme.colors.border.light }}
        />
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
            <a
              href="#"
              aria-label="Facebook"
              style={{ color: theme.colors.text.tertiary }}
            >
              <i className="bi bi-facebook" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              style={{ color: theme.colors.text.tertiary }}
            >
              <i className="bi bi-twitter" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              style={{ color: theme.colors.text.tertiary }}
            >
              <i className="bi bi-linkedin" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              style={{ color: theme.colors.text.tertiary }}
            >
              <i className="bi bi-instagram" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
