import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServerClient } from "@/lib/supabase/server";
import { toWaLink } from "@/lib/whatsapp";
import type { Agency } from "@/types/domain";

type PageProps = { params: { slug: string } };

export const revalidate = 60;

async function fetchAgency(slug: string): Promise<Agency | null> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("agencies")
    .select("id, name, slug, description, phone")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return (data as Agency) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agency = await fetchAgency(params.slug);
  if (!agency) return { title: "Agency not found" };
  return {
    title: `${agency.name} - Mahardika`,
    description: agency.description ?? undefined,
    openGraph: {
      title: `${agency.name} - Mahardika`,
      description: agency.description ?? undefined,
      url: `/shop/${agency.slug}`,
      type: "website",
    },
  };
}

export default async function AgencyStorefrontPage({ params }: PageProps) {
  const agency = await fetchAgency(params.slug);
  if (!agency) return notFound();

  const defaultMessage = "Hi, I would like to renew my insurance.";
  const wa = agency.phone ? toWaLink(agency.phone, defaultMessage) : null;

  return (
    <main>
      <Section>
        <SectionHeading
          title={agency.name}
          subtitle={agency.description ?? "Reach out to discuss renewals and new policies."}
          variant="marketing"
        />
        <div className="flex items-center gap-4">
          {wa ? (
            <Button asChild>
              <a href={wa} target="_blank" rel="noreferrer noopener">
                Contact via WhatsApp
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="Phone not set">
              Contact via WhatsApp
            </Button>
          )}
        </div>
      </Section>
    </main>
  );
}
