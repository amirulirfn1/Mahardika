import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sign } from "jsonwebtoken";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { env } from "@/lib/env";

export async function getServerClient(): Promise<SupabaseClient> {
  const baseConfig = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  } as const;

  if (env.SUPABASE_JWT_SECRET) {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const payload: Record<string, unknown> = {
        sub: session.user.id,
        tenant_id: session.tenantId,
        role: session.user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 30,
      };
            const token = sign(payload, env.SUPABASE_JWT_SECRET, { algorithm: "HS256" });
      return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        ...baseConfig,
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, baseConfig);
}
