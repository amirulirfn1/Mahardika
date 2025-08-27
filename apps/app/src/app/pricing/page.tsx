"use client";
import React from "react";

import { PricingCard } from "@/components/marketing/PricingCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingTiers } from "@/lib/site";

export default function PricingPage() {
  const [yearly, setYearly] = React.useState(false);
  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Pricing" subtitle="Start free, scale as you grow." />
        <div className="mb-6 flex items-center justify-center gap-3 text-sm">
          <button
            className={`px-3 py-1 rounded-md ring-1 text-neutral-900 ring-neutral-300 hover:bg-neutral-100 dark:text-white dark:ring-white/10 ${
              !yearly ? "bg-neutral-100 dark:bg-white/10" : ""
            }`}
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 rounded-md ring-1 text-neutral-900 ring-neutral-300 hover:bg-neutral-100 dark:text-white dark:ring-white/10 ${
              yearly ? "bg-neutral-100 dark:bg-white/10" : ""
            }`}
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
          >
            Yearly
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((t) => (
            <PricingCard
              key={t.name}
              name={t.name}
              price={
                t.priceMonthly === 0
                  ? "Free"
                  : yearly
                  ? `$${t.priceYearly}/yr`
                  : `$${t.priceMonthly}/mo`
              }
              features={t.features}
              cta={t.cta}
              highlighted={t.highlighted}
            />
          ))}
        </div>
      </Section>
    </main>
  );
}



