import { z } from "zod";

import { getProfile } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";

import { uploadPolicyPdf } from "./storage";

const STATUS = ['QUOTE', 'IN_FORCE', 'LAPSED', 'CANCELLED'] as const;


export const PolicySchema = z.object({
  policy_no: z.string().min(1, 'Required'),
  carrier: z.string().min(1, 'Required'),
  product: z.string().min(1, 'Required'),
  status: z.enum(STATUS).default('QUOTE'),
  start_date: z.string().min(1, 'Required'),
  end_date: z.string().min(1, 'Required'),
  premium_gross: z.preprocess((v) => (typeof v === 'string' ? parseFloat(v) : v), z.number().nonnegative()),
  premium_net: z
    .preprocess((v) => (v === undefined || v === null || v === '' ? null : typeof v === 'string' ? parseFloat(v) : v), z.number().nonnegative().nullable())
    .optional(),
  customer_id: z.string().uuid(),
  agent_id: z.string().uuid().optional().or(z.literal('')).transform((v) => (v ? v : undefined)),
});

export async function createPolicy(data: unknown) {
  const parsed = PolicySchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const profile = await getProfile();
  if (!profile?.tenant_id) return { ok: false as const, error: 'No tenant' };
  const supabase = await getServerClient();
  const payload = {
    tenant_id: profile.tenant_id,
    ...parsed.data,
    premium_net: parsed.data.premium_net ?? parsed.data.premium_gross,
  };
  const { data: row, error } = await supabase
    .from('policies')
    .insert(payload)
    .select('id')
    .single();
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, id: row.id };
}

export async function updatePolicy(id: string, data: unknown) {
  const parsed = PolicySchema.partial().safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const supabase = await getServerClient();
  const patch: Record<string, unknown> = { ...parsed.data };
  if (patch.premium_net === undefined && patch.premium_gross !== undefined) {
    patch.premium_net = patch.premium_gross;
  }
  const { error } = await supabase.from('policies').update(patch).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function replacePolicyPdf(id: string, file: File) {
  const supabase = await getServerClient();
  const { data: policy, error: fetchErr } = await supabase
    .from('policies')
    .select('id, tenant_id, files_json')
    .eq('id', id)
    .maybeSingle<{ id: string; tenant_id: string; files_json: unknown }>();
  if (fetchErr) return { ok: false as const, error: fetchErr.message };
  if (!policy) return { ok: false as const, error: 'Policy not found' };

  const uploaded = await uploadPolicyPdf({ supabase, policyId: id, tenantId: policy.tenant_id, file });
  if (!uploaded.ok) return uploaded;

  const existing = Array.isArray(policy.files_json) ? policy.files_json : [];
  const files = [...existing, uploaded.fileEntry];
  const { error } = await supabase.from('policies').update({ files_json: files }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, path: uploaded.path };
}

export async function softDeletePolicy(id: string) {
  const supabase = await getServerClient();
  const { error } = await supabase.from('policies').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function restorePolicy(id: string) {
  const supabase = await getServerClient();
  const { error } = await supabase.from('policies').update({ deleted_at: null }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
