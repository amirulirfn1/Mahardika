import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function FeaturesPage() {
  const items = [
    { title: "Unified dashboard", description: "Everything in one clean place.", icon: "📊" },
    { title: "Fast search", description: "Find policies and customers instantly.", icon: "🔎" },
    { title: "Activity log", description: "Always know who did what.", icon: "🧭" },
    { title: "Secure by default", description: "RLS and audit baked in.", icon: "🔒" },
    { title: "Exports", description: "Export payments and data on demand.", icon: "⬇️" },
    { title: "Integrations", description: "Connect WhatsApp and more.", icon: "🔌" },
  ];
  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Features" subtitle="Minimalist building blocks that scale with you." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <FeatureCard key={it.title} title={it.title} description={it.description} icon={it.icon} />
          ))}
        </div>
      </Section>
    </main>
  );
}



