"use client";
import { PricingToggle } from "@/components/marketing/PricingToggle";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingTiers } from "@/lib/site";

export default function PricingPage() {
  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Pricing" subtitle="Start free, scale as you grow." />
        <PricingToggle tiers={pricingTiers} />
      </Section>
    </main>
  );
}



