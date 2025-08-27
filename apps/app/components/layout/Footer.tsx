import React from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24">
      <div className="container-default">
        <div className="glass rounded-xl px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-neutral-600 dark:text-white/70">
              © {year} {site.name}. All rights reserved.
            </div>
            <nav aria-label="Footer" className="flex items-center gap-4">
              {site.footer.map((f) => (
                <Link key={f.href} href={f.href} className="text-neutral-600 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white">
                  {f.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

