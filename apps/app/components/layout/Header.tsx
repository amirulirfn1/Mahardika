"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

export const Header: React.FC = () => {
  const pathname = usePathname();
  return (
    <header id="site-header" className="sticky top-0 z-40 w-full">
      <div className="container-default">
        <div className="mt-3 mb-3 flex h-14 items-center justify-between rounded-xl glass">
          <div className="flex items-center gap-6 pl-4">
            <Link href="/" className="font-semibold tracking-tight" aria-label={site.name}>
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
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
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
            <Link href="/signup" aria-label="Get started">
              <Button className="hidden sm:inline-flex bg-[hsl(var(--accent))] text-white hover:opacity-90">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};


