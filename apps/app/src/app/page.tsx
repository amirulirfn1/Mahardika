import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PricingCard } from "@/components/marketing/PricingCard";
import { FAQ } from "@/components/marketing/FAQ";
import { site, pricingTiers } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <Section className="pt-20">
        <div className="text-center">
          <h1 id="home-hero" className="text-5xl md:text-6xl font-semibold tracking-tight">
            {site.name}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
            Manage policies, payments, customers, and loyalty — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md font-medium text-sm h-9 px-4 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-md font-medium text-sm h-9 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Explore Features
            </Link>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 opacity-70">
          <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </Section>

      <Section>
        <SectionHeading overline="Capabilities" title="What you get" subtitle="Minimal, fast, and accessible building blocks for your app." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Policies" description="Create and manage insurance policies with ease." icon="📄" />
          <FeatureCard title="Payments" description="Track payments with clear, concise records." icon="💳" />
          <FeatureCard title="Loyalty" description="Reward customers and grow retention." icon="🏆" />
        </div>
      </Section>

      <Section>
        <SectionHeading overline="Pricing" title="Simple pricing" subtitle="Start free, scale when you need more." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((t) => (
            <PricingCard
              key={t.name}
              name={t.name}
              price={t.priceMonthly === 0 ? "Free" : `$${t.priceMonthly}/mo`}
              features={t.features}
              cta={t.cta}
              highlighted={t.highlighted}
            />
          ))}
        </div>
        <div className="mt-6 text-center text-sm">
          Prefer yearly? Save 2 months on annual billing.
        </div>
      </Section>

      <Section>
        <SectionHeading overline="Answers" title="Frequently asked questions" />
        <FAQ
          items={[
            { q: "Is there a free tier?", a: "Yes, start for free and upgrade anytime." },
            { q: "Is there dark mode?", a: "Yes, toggle in the header." },
            { q: "Can I integrate payments?", a: "Yes, with your preferred provider." },
            { q: "Do you support SSO?", a: "SSO is available on Business." },
          ]}
        />
      </Section>
    </main>
  );
}
