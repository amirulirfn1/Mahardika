"use client";
import React from "react";
import type { PricingTier } from "@/lib/site";
import { PricingCard } from "./PricingCard";

type Billing = "monthly" | "yearly";

export function PricingToggle({ tiers }: { tiers: PricingTier[] }) {
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const priceFor = (t: PricingTier) =>
    billing === "monthly" ? t.priceMonthly : t.priceYearly;

  return (
    <div>
      <div className="mx-auto mb-6 flex w-full max-w-xs items-center justify-center rounded-lg ring-1 ring-neutral-200 dark:ring-white/10">
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md m-1 transition ${
            billing === "monthly"
              ? "bg-[hsl(var(--accent))] text-white"
              : "text-neutral-700 hover:bg-[hsl(var(--accent))]/10 dark:text-white/80 dark:hover:bg-[hsl(var(--accent))]/20"
          }`}
          aria-pressed={billing === "monthly"}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling("yearly")}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md m-1 transition ${
            billing === "yearly"
              ? "bg-[hsl(var(--accent))] text-white"
              : "text-neutral-700 hover:bg-[hsl(var(--accent))]/10 dark:text-white/80 dark:hover:bg-[hsl(var(--accent))]/20"
          }`}
          aria-pressed={billing === "yearly"}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const price = priceFor(t);
          const isFree = price === 0;
          return (
            <PricingCard
              key={`${t.name}-${billing}`}
              name={t.name}
              {...(isFree
                ? { price: "Free" }
                : {
                    animatedPrice: price,
                    pricePrefix: "$",
                    priceSuffix: billing === "monthly" ? "/mo" : "/yr",
                  })}
              features={t.features}
              cta={t.cta}
              highlighted={t.highlighted}
            />
          );
        })}
      </div>
      {billing === "yearly" ? (
        <div className="mt-2 text-center text-xs text-neutral-500">Save ~2 months with yearly billing</div>
      ) : null}
    </div>
  );
}
