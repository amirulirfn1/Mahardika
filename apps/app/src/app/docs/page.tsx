"use client";
import { useState } from "react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DocsIndexPage() {
  const [q, setQ] = useState("");
  return (
    <main>
      <Section>
        <SectionHeading title="Documentation" subtitle="Search and discover how everything fits together." />
        <div className="max-w-xl space-y-3">
          <label htmlFor="docs-search" className="sr-only">
            Search documentation
          </label>
          <input
            id="docs-search"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">{q ? `No results for "${q}" (yet)` : "Type to search..."}</p>
        </div>
      </Section>
    </main>
  );
}
