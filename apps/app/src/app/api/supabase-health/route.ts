import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false as const, error: "Missing env: NEXT_PUBLIC_SUPABASE_URL or ANON KEY" },
      { status: 500 },
    );
  }
  const endpoint = `${url.replace(/\/?$/, "")}/auth/v1/settings`;
  const started = Date.now();
  try {
    const res = await fetch(endpoint, { headers: { apikey: key } });
    const ms = Date.now() - started;
    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch (e) {
      parsed = null;
    }
    return NextResponse.json({ ok: res.ok as boolean, status: res.status, time_ms: ms, body: parsed });
  } catch (e: unknown) {
    const ms = Date.now() - started;
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false as const, error: msg, time_ms: ms }, { status: 502 });
  }
}
