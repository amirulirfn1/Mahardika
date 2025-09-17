import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") || undefined) as
    | "signup"
    | "magiclink"
    | "recovery"
    | "invite"
    | undefined;
  const next = searchParams.get("next") || "/dashboard";
  const error = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(error)}`, req.url));
  }

  if (code || token_hash) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      },
    );
    // Exchange code for a session or verify OTP token and set cookies server-side
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    } else if (token_hash && type) {
      await supabase.auth.verifyOtp({ token_hash, type });
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}
