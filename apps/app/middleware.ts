import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isDashboard = url.pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY!,
    {
      cookies: { get: (name) => req.cookies.get(name)?.value, set: () => {}, remove: () => {} },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


