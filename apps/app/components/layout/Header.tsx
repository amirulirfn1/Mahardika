"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export const Header: React.FC = () => {
  const pathname = usePathname();
  return (
    <header id="site-header" className="sticky top-0 z-40 w-full border-b border-neutral-200/80 backdrop-blur bg-white/70 dark:bg-neutral-950/70 dark:border-neutral-800/80">
      <div className="container-default flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight" aria-label={site.name}>
            {site.name}
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-4 text-sm">
            {site.nav.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-2 py-1 rounded-md ${
                    active
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/signup"
            aria-label="Get Started"
            className="hidden sm:inline-flex items-center justify-center rounded-md font-medium text-sm h-9 px-4 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};


