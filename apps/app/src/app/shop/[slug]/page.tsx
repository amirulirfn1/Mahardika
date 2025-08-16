import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServerClient } from "@/lib/supabase/server";
import { toWaLink } from "@/src/lib/whatsapp";
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const agency = await fetchAgency(params.slug);
  if (!agency) return { title: "Agency not found" };
  return {
    title: `${agency.name} – Mahardika`,
    description: agency.description ?? undefined,
    openGraph: {
      title: `${agency.name} – Mahardika`,
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
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{agency.name}</h1>
        {agency.description && (
          <p className="text-gray-600">{agency.description}</p>
        )}
      </div>
      <div>
        {wa ? (
          <a
            href={wa}
            className="inline-flex items-center rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700"
            target="_blank"
            rel="noreferrer noopener"
          >
            Contact via WhatsApp
          </a>
        ) : (
          <button
            className="inline-flex items-center rounded-md bg-gray-300 text-gray-600 px-4 py-2 cursor-not-allowed"
            title="Phone not set"
            disabled
          >
            Contact via WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
