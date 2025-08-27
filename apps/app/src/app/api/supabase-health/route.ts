import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "Missing env: NEXT_PUBLIC_SUPABASE_URL or ANON KEY" },
      { status: 500 },
    );
  }
  const endpoint = `${url.replace(/\/?$/, "")}/auth/v1/settings`;
  const started = Date.now();
  try {
    const res = await fetch(endpoint, { headers: { apikey: key } });
    const ms = Date.now() - started;
    let body: any = null;
    try { body = await res.json(); } catch {}
    return NextResponse.json({ ok: res.ok, status: res.status, time_ms: ms, body: body ?? null });
  } catch (e: any) {
    const ms = Date.now() - started;
    return NextResponse.json({ ok: false, error: e?.message || String(e), time_ms: ms }, { status: 502 });
  }
}

