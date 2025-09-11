import { Shield, CreditCard, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FAQ } from "@/components/marketing/FAQ";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PricingToggle } from "@/components/marketing/PricingToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingTiers } from "@/lib/site";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <Section className="pt-28 md:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="motion-reduce:animate-none">
            <Badge className="animate-fade-up" style={{ animationDelay: "100ms" }} variant="accent">New: Modern insurance dashboard</Badge>
            <div className="hero-shine inline-block animate-fade-up" style={{ animationDelay: "150ms" }}>
              <h1
                id="home-hero"
                className="font-heading text-6xl md:text-7xl font-semibold tracking-tight leading-[0.9] text-balance bg-gradient-to-br from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400"
              >
                Mahardika
              </h1>
            </div>
            <p className="mt-5 max-w-xl text-neutral-600 dark:text-white/70 animate-fade-up" style={{ animationDelay: "220ms" }}>
              Policies, payments, customers, loyalty in one place.
            </p>
            <div className="mt-8 flex items-center gap-3 animate-fade-up" style={{ animationDelay: "280ms" }}>
              <Link href="/signup" aria-label="Get started">
                <Button size="lg" className="btn-sheen">Get started</Button>
              </Link>
              <Link href="/features" aria-label="Explore features">
                <Button size="lg" variant="outline" className="btn-sheen">Explore features</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 text-xs text-neutral-600 dark:text-white/70 animate-fade-up" style={{ animationDelay: "340ms" }}>
              <div><div className="text-2xl font-semibold text-neutral-900 dark:text-white">8k+</div><div>Policies managed</div></div>
              <div><div className="text-2xl font-semibold text-neutral-900 dark:text-white">$4.2m</div><div>Payments tracked</div></div>
              <div><div className="text-2xl font-semibold text-neutral-900 dark:text-white">98%</div><div>CSAT</div></div>
            </div>
            <div className="mt-10 animate-fade-up" style={{ animationDelay: "420ms" }}>
              <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Trusted by teams at</div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {[{
                  name: "Acme Inc.", src: "/logos/acme.svg"
                }, { name: "Globex", src: "/logos/globex.svg" }, { name: "Umbrella", src: "/logos/umbrella.svg" }, { name: "Initech", src: "/logos/initech.svg" }, { name: "Soylent", src: "/logos/soylent.svg" }].map((logo) => (
                  <span key={logo.name} className="px-2 py-1 rounded-md ring-1 ring-neutral-200 bg-white dark:ring-white/10 dark:bg-white/5">
                    <Image src={logo.src} alt={logo.name} width={96} height={28} loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Ambient glows */}
            <div className="orb orb--violet" style={{ width: 420, height: 420, top: -24, right: -40 }} aria-hidden />
            <div className="orb orb--fuchsia" style={{ width: 320, height: 320, bottom: 40, right: 24 }} aria-hidden />
            {/* Glass placeholders to suggest UI */}
            <div className="relative grid gap-4">
              <Card className="max-w-md">
                <CardContent>
                  <div className="h-28 rounded-lg ring-1 ring-neutral-200 bg-neutral-50 dark:ring-white/10 dark:bg-white/5" />
                </CardContent>
              </Card>
              <Card className="max-w-sm ml-auto">
                <CardContent>
                  <div className="h-28 rounded-lg ring-1 ring-neutral-200 bg-neutral-50 dark:ring-white/10 dark:bg-white/5" />
                </CardContent>
              </Card>
              <Card className="max-w-xs">
                <CardContent>
                  <div className="h-24 rounded-lg ring-1 ring-neutral-200 bg-neutral-50 dark:ring-white/10 dark:bg-white/5" />
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
        <PricingToggle tiers={pricingTiers} />
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
