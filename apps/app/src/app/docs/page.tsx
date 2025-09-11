"use client";
import { useState } from "react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DocsIndexPage() {
  const [q, setQ] = useState("");
  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Documentation" subtitle="Search and discover how everything fits together." />
        <div className="mx-auto max-w-xl">
          <label htmlFor="docs-search" className="sr-only">Search docs</label>
          <input
            id="docs-search"
            className="w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="mt-6 text-sm text-neutral-600 dark:text-white/70">
            {q ? `No results for "${q}" (yet)` : "Type to search..."}
          </div>
        </div>
      </Section>
    </main>
  );
}



