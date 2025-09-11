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
    const { location, history, localStorage } = window as Window & { localStorage: Storage };
    // Prefer location.hash; fall back to stashed value written by the pre-hydration script
    let hash = location.hash || "";
    if (!hash || !hash.includes("access_token")) {
      try {
        const stashed = localStorage.getItem("sb-hash") || "";
        if (stashed.includes("access_token")) hash = stashed;
      } catch (_) {
        /* ignore */
      }
    }
    if (!hash || !hash.includes("access_token")) return;

    // Persist session from URL and redirect
    void (async () => {
      try {
        // Prefer official helper if present (bypass types with any)
        const authMaybe = supabase.auth as unknown as {
          getSessionFromUrl?: (opts: { storeSession: boolean }) => Promise<{ error?: unknown }>;
        };
        if (typeof authMaybe.getSessionFromUrl === "function") {
          const { error } = await authMaybe.getSessionFromUrl({ storeSession: true });
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
        // Clean up any residue and clear stashed value
        const url = new URL(location.href);
        history.replaceState(null, "", url.origin + url.pathname + (url.search || ""));
        try { localStorage.removeItem("sb-hash"); } catch (_) {
          /* ignore */
        }
      }
    })();
  }, []);
  return null;
}
