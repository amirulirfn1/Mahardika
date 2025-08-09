import type { SupabaseClient } from "@supabase/supabase-js";

type UploadArgs = {
  supabase: SupabaseClient;
  agencyId: string;
  policyId: string;
  file: File;
};

export async function uploadPolicyPdf({ supabase, agencyId, policyId, file }: UploadArgs) {
  try {
    if (!file) return { ok: false, error: "No file" } as const;
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: "File too large (max 5MB)" } as const;
    const lowerName = (file.name || "").toLowerCase();
    const ct = (file.type || "").toLowerCase();
    const isPdf = ct === "application/pdf" || lowerName.endsWith(".pdf");
    if (!isPdf) return { ok: false, error: "Only PDF files are allowed" } as const;

    const path = `${agencyId}/${policyId}.pdf`;
    const { error } = await supabase.storage.from("policy-pdfs").upload(path, file, {
      upsert: true,
      contentType: "application/pdf",
      metadata: { agency_id: agencyId, table_ref: "policies", row_id: policyId },
    });
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true, path } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}

export async function getPolicyPdfUrl({
  supabase,
  path,
}: {
  supabase: SupabaseClient;
  path: string;
}) {
  const { data, error } = await supabase.storage.from("policy-pdfs").createSignedUrl(path, 60 * 10);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, url: data.signedUrl };
}


