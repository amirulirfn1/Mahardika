import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { handleCSRFForPages } from '@mah/core/security/csrf';

const maps = {
  admin: ['/admin'],
  agency: ['/agency'],
  staff: ['/staff'],
  customer: ['/customer'],
};

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;

  // Public & auth routes remain open (skip authentication)
  if (path.startsWith('/auth') || path.startsWith('/(public)')) {
    // Still add CSRF protection for public pages
    return handleCSRFForPages(req, res);
  }

  // Check authentication for protected routes
  if (!user) {
    const signInResponse = NextResponse.redirect(
      new URL('/auth/sign-in', req.url)
    );
    return handleCSRFForPages(req, signInResponse);
  }

  // Check role-based access control
  const role = user.user_metadata.role;
  const restricted = Object.entries(maps).some(
    ([key, prefixes]) => prefixes.some(p => path.startsWith(p)) && role !== key
  );

  if (restricted) {
    const redirectResponse = NextResponse.redirect(new URL('/', req.url));
    return handleCSRFForPages(req, redirectResponse);
  }

  // Add CSRF protection to the response
  return handleCSRFForPages(req, res);
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
