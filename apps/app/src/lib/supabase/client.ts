import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;
let warnedMissing = false;

function resolveConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return {
    url,
    anonKey,
    ok: url.length > 0 && anonKey.length > 0,
  };
}

function initClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const config = resolveConfig();
  if (!config.ok) {
    if (!warnedMissing && process.env.NODE_ENV !== "production") {
      console.warn(
        "Supabase client disabled: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
      );
      warnedMissing = true;
    }
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
}

export function getBrowserClient(): SupabaseClient | null {
  return initClient();
}

export function requireBrowserClient(): SupabaseClient {
  const client = initClient();
  if (!client) {
    throw new Error(
      "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return resolveConfig().ok;
}