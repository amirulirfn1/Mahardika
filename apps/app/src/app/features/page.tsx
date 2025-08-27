import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LayoutDashboard, Search, ListChecks, ShieldCheck, FileDown, Plug2 } from "lucide-react";

export default function FeaturesPage() {
  const items = [
    { title: "Unified dashboard", description: "Everything in one clean place.", icon: <LayoutDashboard size={18} /> },
    { title: "Fast search", description: "Find policies and customers instantly.", icon: <Search size={18} /> },
    { title: "Activity log", description: "Always know who did what.", icon: <ListChecks size={18} /> },
    { title: "Secure by default", description: "RLS and audit baked in.", icon: <ShieldCheck size={18} /> },
    { title: "Exports", description: "Export payments and data on demand.", icon: <FileDown size={18} /> },
    { title: "Integrations", description: "Connect WhatsApp and more.", icon: <Plug2 size={18} /> },
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

