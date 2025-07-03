/**
 * =============================================================================
 * Mahardika Platform - CSRF Protection
 * Cross-Site Request Forgery protection utilities and middleware
 * =============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'crypto';

// CSRF Configuration
const CSRF_CONFIG = {
  secretKey: process.env.CSRF_SECRET_KEY || process.env.NEXTAUTH_SECRET || 'mahardika-csrf-secret-key',
  tokenLength: 32,
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  },
} as const;

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
}

/**
 * Create HMAC signature for CSRF token validation
 */
function createTokenSignature(token: string): string {
  return createHmac('sha256', CSRF_CONFIG.secretKey)
    .update(token)
    .digest('hex');
}

/**
 * Generate a signed CSRF token (token + signature)
 */
export function generateSignedCSRFToken(): string {
  const token = generateCSRFToken();
  const signature = createTokenSignature(token);
  return `${token}.${signature}`;
}

/**
 * Validate a signed CSRF token
 */
export function validateCSRFToken(signedToken: string): boolean {
  try {
    const [token, signature] = signedToken.split('.');
    if (!token || !signature) {
      return false;
    }

    const expectedSignature = createTokenSignature(token);
    return signature === expectedSignature;
  } catch (error) {
    return false;
  }
}

/**
 * Set CSRF token in response cookies
 */
export function setCSRFTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_CONFIG.cookieName, token, CSRF_CONFIG.cookieOptions);
}

/**
 * Get CSRF token from request cookies
 */
export function getCSRFTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_CONFIG.cookieName)?.value || null;
}

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_CONFIG.headerName);
}

/**
 * Check if route should be exempt from CSRF protection
 */
function isCSRFExempt(pathname: string): boolean {
  const exemptPaths = [
    '/api/auth/', // Authentication endpoints
    '/api/cron/', // Cron jobs
    '/auth/', // Auth pages
    '/_next/', // Next.js internal
    '/favicon.ico',
    '/api/health', // Health checks
  ];

  return exemptPaths.some(path => pathname.startsWith(path));
}

/**
 * Check if request method requires CSRF protection
 */
function requiresCSRFProtection(method: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
}

/**
 * CSRF protection middleware for API routes
 */
export function csrfProtection(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const pathname = request.nextUrl.pathname;
    const method = request.method;

    // Skip CSRF protection for exempt paths or safe methods
    if (isCSRFExempt(pathname) || !requiresCSRFProtection(method)) {
      return handler(request, ...args);
    }

    // Get tokens from cookie and header
    const cookieToken = getCSRFTokenFromCookie(request);
    const headerToken = getCSRFTokenFromHeader(request);

    // Validate CSRF protection
    if (!cookieToken || !headerToken) {
      return NextResponse.json(
        {
          error: 'CSRF token missing',
          message: 'Request must include valid CSRF token',
          code: 'CSRF_TOKEN_MISSING'
        },
        { status: 403 }
      );
    }

    if (!validateCSRFToken(cookieToken) || !validateCSRFToken(headerToken)) {
      return NextResponse.json(
        {
          error: 'Invalid CSRF token',
          message: 'CSRF token is invalid or expired',
          code: 'CSRF_TOKEN_INVALID'
        },
        { status: 403 }
      );
    }

    if (cookieToken !== headerToken) {
      return NextResponse.json(
        {
          error: 'CSRF token mismatch',
          message: 'Cookie and header CSRF tokens do not match',
          code: 'CSRF_TOKEN_MISMATCH'
        },
        { status: 403 }
      );
    }

    // CSRF validation passed, continue with the request
    return handler(request, ...args);
  };
}

/**
 * Middleware function to generate and set CSRF tokens for pages
 */
export function handleCSRFForPages(request: NextRequest, response: NextResponse): NextResponse {
  const pathname = request.nextUrl.pathname;

  // Only set CSRF tokens for HTML pages (not API routes)
  if (!pathname.startsWith('/api/') && !isCSRFExempt(pathname)) {
    const existingToken = getCSRFTokenFromCookie(request);
    
    // Generate new token if none exists or if token is invalid
    if (!existingToken || !validateCSRFToken(existingToken)) {
      const newToken = generateSignedCSRFToken();
      setCSRFTokenCookie(response, newToken);
    }
  }

  return response;
}

/**
 * Extract CSRF token from cookie for client-side use
 */
export function getCSRFTokenForClient(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${CSRF_CONFIG.cookieName}=`)
  );
  
  if (!csrfCookie) return null;
  
  return csrfCookie.split('=')[1];
}

/**
 * Utility to add CSRF token to fetch requests
 */
export function addCSRFToken(options: RequestInit = {}): RequestInit {
  const token = getCSRFTokenForClient();
  
  if (!token) {
    console.warn('CSRF token not found. Request may be blocked.');
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      [CSRF_CONFIG.headerName]: token,
    },
  };
}

/**
 * Configuration export for use in other parts of the application
 */
export const CSRF_HEADER_NAME = CSRF_CONFIG.headerName;
export const CSRF_COOKIE_NAME = CSRF_CONFIG.cookieName; 