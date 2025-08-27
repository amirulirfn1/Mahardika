import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PricingCard } from "@/components/marketing/PricingCard";
import { FAQ } from "@/components/marketing/FAQ";
import { pricingTiers } from "@/lib/site";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield, CreditCard, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <Section className="pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 id="home-hero" className="font-heading text-5xl md:text-6xl font-semibold tracking-tight">Mahardika</h1>
            <p className="mt-5 max-w-xl text-white/70">
              Policies, payments, customers, loyalty in one place.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link href="/signup" aria-label="Get started">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/features" aria-label="Explore features">
                <Button size="lg" variant="outline">Explore features</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 text-xs text-white/70">
              <div><div className="text-2xl font-semibold text-white">8k+</div><div>Policies managed</div></div>
              <div><div className="text-2xl font-semibold text-white">$4.2m</div><div>Payments tracked</div></div>
              <div><div className="text-2xl font-semibold text-white">98%</div><div>CSAT</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-x-6 -top-6 bottom-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 blur-2xl" aria-hidden />
            <div className="relative grid gap-4">
              <Card className="max-w-md">
                <CardContent>
                  <div className="h-24 rounded-lg ring-1 ring-white/10 bg-white/5" />
                </CardContent>
              </Card>
              <Card className="max-w-sm ml-auto">
                <CardContent>
                  <div className="h-24 rounded-lg ring-1 ring-white/10 bg-white/5" />
                </CardContent>
              </Card>
              <Card className="max-w-xs">
                <CardContent>
                  <div className="h-24 rounded-lg ring-1 ring-white/10 bg-white/5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section>
        <SectionHeading overline="Capabilities" title="What you get" subtitle="Minimal, fast, and accessible building blocks for your app." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Policies"
            description="Create and manage insurance policies with ease."
            icon={<Shield size={18} />}
          />
          <FeatureCard
            title="Payments"
            description="Track payments with clear, concise records."
            icon={<CreditCard size={18} />}
          />
          <FeatureCard
            title="Loyalty"
            description="Reward customers and grow retention."
            icon={<Sparkles size={18} />}
          />
        </div>
      </Section>

      {/* Pricing */}
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

      {/* FAQ */}
      <Section>
        <SectionHeading overline="Answers" title="Frequently asked questions" />
        <FAQ
          items={[
            { q: "Is there a free tier?", a: "Yes, start for free and upgrade anytime." },
            { q: "Is there dark mode?", a: "Yes, toggle in the header." },
            { q: "Can I integrate payments?", a: "Yes, with your preferred provider." },
            { q: "Do you support SSO?", a: "SSO is available on Business." },
            { q: "Is my data secure?", a: "Row-Level Security and audit trails by default." },
            { q: "How do I get support?", a: "Email support for free; priority on Pro." },
          ]}
        />
      </Section>
    </main>
  );
}

