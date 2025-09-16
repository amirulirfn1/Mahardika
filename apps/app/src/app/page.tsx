import { CreditCard, Shield, Sparkles } from "lucide-react";
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

const trustSignals = [
  { label: "8k+", description: "Policies managed" },
  { label: "$4.2m", description: "Payments tracked" },
  { label: "98%", description: "Customer satisfaction" },
];

const heroLogos = [
  { name: "Acme Inc.", src: "/logos/acme.svg" },
  { name: "Globex", src: "/logos/globex.svg" },
  { name: "Umbrella", src: "/logos/umbrella.svg" },
  { name: "Initech", src: "/logos/initech.svg" },
  { name: "Soylent", src: "/logos/soylent.svg" },
];

export default function Home() {
  return (
    <main>
      <Section spotlight>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
          <div className="space-y-8">
            <Badge variant="accent" className="w-fit">Insurance teams ship faster with Mahardika</Badge>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight text-balance md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Policies, payments, and loyalty in one clear workspace
              </h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Automate renewals, reconcile payments, and keep every customer record in sync. Built on Supabase with strong defaults for security and observability.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" aria-label="Get started">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/features" aria-label="Explore features">
                <Button size="lg" variant="outline">
                  Explore features
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {trustSignals.map((item) => (
                <div key={item.label} className="space-y-1 text-sm text-muted-foreground">
                  <div className="text-2xl font-semibold text-foreground">{item.label}</div>
                  <div>{item.description}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-xs">
              <span className="uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams at</span>
              <div className="flex flex-wrap items-center gap-3">
                {heroLogos.map((logo) => (
                  <span
                    key={logo.name}
                    className="inline-flex items-center rounded-md border border-border/80 bg-card px-3 py-1 shadow-card"
                  >
                    <Image src={logo.src} alt={logo.name} width={96} height={28} loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -left-16 top-0 hidden h-72 w-72 rounded-full bg-primary/15 blur-3xl md:block" />
            <div className="pointer-events-none absolute -right-10 bottom-0 hidden h-64 w-64 rounded-full bg-accent/15 blur-3xl md:block" />
            <div className="relative grid gap-4">
              <Card intent="subtle" radius="marketing" className="max-w-sm">
                <CardContent density="marketing">
                  <div className="h-28 rounded-xl border border-dashed border-border/70 bg-muted" />
                </CardContent>
              </Card>
              <Card intent="subtle" radius="marketing" className="ml-auto max-w-xs">
                <CardContent density="marketing">
                  <div className="h-24 rounded-xl border border-dashed border-border/70 bg-muted" />
                </CardContent>
              </Card>
              <Card intent="subtle" radius="marketing" className="max-w-xs">
                <CardContent density="marketing">
                  <div className="h-20 rounded-xl border border-dashed border-border/70 bg-muted" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Capabilities" title="Minimal building blocks" subtitle="Everything your agency needs without the noise." />
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard title="Policies" description="Create, renew, and audit policies with ease." icon={<Shield size={18} />} />
          <FeatureCard title="Payments" description="Track premium collection with full history." icon={<CreditCard size={18} />} />
          <FeatureCard title="Loyalty" description="Reward loyal customers and grow retention." icon={<Sparkles size={18} />} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Pricing" title="Plans that scale" subtitle="Start free, add seats and automation as you grow." />
        <PricingToggle tiers={pricingTiers} />
      </Section>

      <Section>
        <SectionHeading eyebrow="Answers" title="Frequently asked questions" />
        <FAQ
          items={[
            { q: "Is there a free tier?", a: "Yes, start for free and upgrade anytime." },
            { q: "Does it support dark mode?", a: "Yes, toggle it from the header." },
            { q: "Can I integrate payments?", a: "Bring your provider and track everything inside Mahardika." },
            { q: "Do you support SSO?", a: "Single Sign-On is available on the Business plan." },
            { q: "Is my data secure?", a: "Row-level security, audit trails, and soft delete are enabled by default." },
            { q: "How do I get support?", a: "Email support on Free, priority Slack support on paid tiers." },
          ]}
        />
      </Section>
    </main>
  );
}
