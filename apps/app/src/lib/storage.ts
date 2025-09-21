import type { SupabaseClient } from "@supabase/supabase-js";

function sanitiseFileName(name: string) {
  return name.trim().replace(/[^a-zA-Z0-9_.-]+/g, '-');
}

type UploadArgs = {
  supabase: SupabaseClient;
  policyId: string;
  tenantId: string;
  file: File;
};

export async function uploadPolicyPdf({ supabase, policyId, tenantId, file }: UploadArgs) {
  try {
    if (!file) return { ok: false as const, error: 'No file' };
    if (file.size > 5 * 1024 * 1024) return { ok: false as const, error: 'File too large (max 5MB)' };
    const lowerName = (file.name || '').toLowerCase();
    const ct = (file.type || '').toLowerCase();
    const isPdf = ct === 'application/pdf' || lowerName.endsWith('.pdf');
    if (!isPdf) return { ok: false as const, error: 'Only PDF files are allowed' };

    const safeName = sanitiseFileName(file.name || 'policy.pdf') || 'policy.pdf';
    const path = `${tenantId}/${policyId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('policy-docs').upload(path, file, {
      upsert: true,
      contentType: 'application/pdf',
      metadata: { tenant_id: tenantId, policy_id: policyId },
    });
    if (error) return { ok: false as const, error: error.message };

    const fileEntry = {
      path,
      name: file.name,
      kind: 'POLICY' as const,
      uploaded_at: new Date().toISOString(),
    };
    return { ok: true as const, path, fileEntry };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function getPolicyPdfUrl({ supabase, path }: { supabase: SupabaseClient; path: string }) {
  const { data, error } = await supabase.storage.from('policy-docs').createSignedUrl(path, 60 * 10);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, url: data.signedUrl };
}
