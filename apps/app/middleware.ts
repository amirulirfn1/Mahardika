import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { env } from "@/lib/env";

const DASHBOARD_PREFIX = "/dashboard";

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith(DASHBOARD_PREFIX)) {
    return NextResponse.next();
  }

  if (env.SKIP_AUTH) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
  if (!token) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
