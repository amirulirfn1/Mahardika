"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, useEffect, useState } from "react";

import { site } from "@/lib/site";
import { getBrowserClient } from "@/lib/supabase/client";

import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

export const Header: FC = () => {
  const pathname = usePathname();
  const supabase = getBrowserClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <header id="site-header" className="sticky top-0 z-40 w-full">
      <div className="container-default">
        <div className="mt-3 mb-3 flex h-14 items-center justify-between rounded-xl glass">
          <div className="flex items-center gap-6 pl-4">
            <Link href="/" className="font-heading font-semibold tracking-tight" aria-label={site.name}>
              {site.name}
            </Link>
            <nav aria-label="Primary" className="hidden md:flex items-center gap-2 text-sm">
              {site.nav.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-1.5 rounded-md transition ${
                      active
                        ? "text-neutral-900 bg-[hsl(var(--accent))]/10 dark:text-white dark:bg-[hsl(var(--accent))]/20"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-[hsl(var(--accent))]/10 dark:text-white/70 dark:hover:text-white dark:hover:bg-[hsl(var(--accent))]/20"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 pr-3">
            <ThemeToggle />
            {email ? (
              <>
                <span className="hidden sm:inline text-sm text-neutral-600 dark:text-white/70">{email}</span>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!supabase) return;
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" aria-label="Sign in">
                  <Button variant="outline" className="hidden sm:inline-flex">Sign in</Button>
                </Link>
                <Link href="/signup" aria-label="Get started">
                  <Button className="hidden sm:inline-flex">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
