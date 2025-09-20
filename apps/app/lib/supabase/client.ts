import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const getPublicEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return "";
};

const supabaseUrl = getPublicEnvValue(
  "NEXT_PUBLIC_SUPABASE_URL",
  "STORAGE_NEXT_PUBLIC_SUPABASE_URL",
  "STORAGE_SUPABASE_URL",
  "SUPABASE_URL",
);
const supabaseAnonKey = getPublicEnvValue(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "STORAGE_NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "STORAGE_SUPABASE_ANON_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_KEY",
);

const hasCredentials = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
let cachedClient: SupabaseClient | null | undefined;

function initClient(): SupabaseClient | null {
  if (typeof cachedClient !== "undefined") {
    return cachedClient;
  }
  if (!hasCredentials) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "Supabase client disabled: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.",
      );
    }
    cachedClient = null;
    return cachedClient;
  }
  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
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
  return hasCredentials;
}
