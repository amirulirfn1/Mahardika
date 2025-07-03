import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

interface RoleMapping {
  [key: string]: string[];
}

const ROLE_ROUTE_MAPPING: RoleMapping = {
  admin: ['/admin'],
  agency: ['/agency'],
  staff: ['/staff'],
  customer: ['/customer'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth',
  '/(public)',
  '/api/health',
  '/favicon.ico',
  '/_next',
  '/404',
  '/500',
  '/',
];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient({ req, res });
    const path = req.nextUrl.pathname;

    // Allow public routes
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
      if (route === '/') {
        return path === '/';
      }
      return path.startsWith(route);
    });

    if (isPublicRoute) {
      return res;
    }

    // Get user authentication
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Handle authentication errors or missing user
    if (error || !user) {
      console.warn('Middleware: Authentication failed', { path, error: error?.message });
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }

    // Validate user metadata and role
    const userRole = user.user_metadata?.role;
    if (!userRole || typeof userRole !== 'string') {
      console.warn('Middleware: Invalid or missing user role', { 
        userId: user.id, 
        path, 
        metadata: user.user_metadata 
      });
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }

    // Check role-based access control
    const isRestrictedRoute = Object.entries(ROLE_ROUTE_MAPPING).some(
      ([requiredRole, routePrefixes]) => {
        const matchesRoute = routePrefixes.some(prefix => path.startsWith(prefix));
        const hasCorrectRole = userRole === requiredRole;
        return matchesRoute && !hasCorrectRole;
      }
    );

    if (isRestrictedRoute) {
      console.warn('Middleware: Access denied', { 
        userId: user.id, 
        role: userRole, 
        path 
      });
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Add security headers
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return res;
  } catch (error) {
    console.error('Middleware: Unexpected error', { error, path: req.nextUrl.pathname });
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
