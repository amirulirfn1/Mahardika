"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DocsIndexPage() {
  const [q, setQ] = React.useState("");
  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Documentation" subtitle="Search and discover how everything fits together." />
        <div className="mx-auto max-w-xl">
          <label htmlFor="docs-search" className="sr-only">Search docs</label>
          <input
            id="docs-search"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="mt-6 text-sm text-neutral-600 dark:text-neutral-300">
            {q ? `No results for "${q}" (yet)` : "Type to search..."}
          </div>
        </div>
      </Section>
    </main>
  );
}



