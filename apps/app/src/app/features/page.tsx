import { FileDown, LayoutDashboard, ListChecks, Plug2, Search, ShieldCheck } from "lucide-react";

import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const featureItems = [
  { title: "Unified dashboard", description: "One view for policies, payments, customers, and documents.", icon: <LayoutDashboard size={18} /> },
  { title: "Fast search", description: "Find policies and customers instantly with advanced filters.", icon: <Search size={18} /> },
  { title: "Activity log", description: "Full audit trail so you always know who changed what.", icon: <ListChecks size={18} /> },
  { title: "Secure by default", description: "Row-level security, soft delete, and audit events built in.", icon: <ShieldCheck size={18} /> },
  { title: "Exports", description: "Download payments, customers, and policies on demand.", icon: <FileDown size={18} /> },
  { title: "Integrations", description: "Connect WhatsApp and automate outbound messaging.", icon: <Plug2 size={18} /> },
];

export default function FeaturesPage() {
  return (
    <main>
      <Section spotlight>
        <SectionHeading
          eyebrow="Features"
          title="A focused toolkit for modern insurance teams"
          subtitle="Mahardika keeps your operational workflows tidy while staying flexible enough to integrate with the systems you already use."
        />
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {featureItems.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
          ))}
        </div>
      </Section>
    </main>
  );
}
