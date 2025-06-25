import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

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

  // Public & auth routes remain open
  if (path.startsWith('/auth') || path.startsWith('/(public)')) return res;
  if (!user) return NextResponse.redirect(new URL('/auth/sign-in', req.url));

  const role = user.user_metadata.role;
  const restricted = Object.entries(maps).some(
    ([key, prefixes]) => prefixes.some(p => path.startsWith(p)) && role !== key
  );
  return restricted ? NextResponse.redirect(new URL('/', req.url)) : res;
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
