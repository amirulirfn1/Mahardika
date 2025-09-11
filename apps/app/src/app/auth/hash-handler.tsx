"use client";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase/client";

/**
 * Handles Supabase deep-link redirects that arrive with a hash fragment
 * like `/#access_token=...&refresh_token=...`. When detected, we ask
 * Supabase to persist the session and then clean up the URL and
 * redirect to the intended page.
 */
export function AuthHashHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { location, history } = window;
    const hash = location.hash || "";
    if (!hash || !hash.includes("access_token")) return;

    // Persist session from URL and redirect
    void (async () => {
      try {
        // Prefer official helper if present (bypass types with any)
        const anyAuth: any = supabase.auth as any;
        if (typeof anyAuth.getSessionFromUrl === "function") {
          const { error } = await anyAuth.getSessionFromUrl({ storeSession: true });
          if (error) throw error;
        } else {
          // Fallback: parse tokens from hash and set session manually
          const params = new URLSearchParams(hash.slice(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
          }
        }
      } catch (e) {
        // best-effort: if this fails, we still cleanup the hash
        // eslint-disable-next-line no-console
        console.warn("AuthHashHandler: could not persist session from URL", e);
      } finally {
        // Clean up the hash to avoid exposing tokens in the address bar
        const url = new URL(location.href);
        const next = url.searchParams.get("next") || "/dashboard";
        history.replaceState(null, "", url.origin + url.pathname + (url.search || ""));
        location.replace(next);
      }
    })();
  }, []);
  return null;
}
