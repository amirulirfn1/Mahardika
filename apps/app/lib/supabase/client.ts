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

export function createBrowserClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a client with empty creds to avoid throwing during build; runtime should provide envs
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = createBrowserClient();
