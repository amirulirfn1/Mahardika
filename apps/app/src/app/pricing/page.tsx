"use client";

import { PricingToggle } from "@/components/marketing/PricingToggle";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingTiers } from "@/lib/site";

export default function PricingPage() {
  return (
    <main>
      <Section spotlight>
        <SectionHeading
          eyebrow="Pricing"
          title="Choose a plan that fits"
          subtitle="Every plan includes secure authentication, audit logs, and a clear dashboard. Upgrade as your team grows."
        />
      </Section>
      <Section>
        <PricingToggle tiers={pricingTiers} />
      </Section>
    </main>
  );
}
