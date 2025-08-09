import { z } from "zod";
import { getProfile } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { uploadPolicyPdf } from "./storage";

export const PolicySchema = z.object({
  policy_no: z.string().min(1, "Required"),
  start_date: z.string().min(1, "Required"),
  end_date: z.string().min(1, "Required"),
  premium_myr: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
});

export async function createPolicy(data: unknown) {
  const parsed = PolicySchema.safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const profile = await getProfile();
  if (!profile?.agency_id) return { ok: false as const, error: "No agency" };
  const supabase = getServerClient();
  const { data: row, error } = await supabase
    .from("policies")
    .insert({ agency_id: profile.agency_id, ...parsed.data })
    .select("id")
    .single();
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, id: row.id };
}

export async function updatePolicy(id: string, data: unknown) {
  const parsed = PolicySchema.partial().safeParse(data);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const supabase = getServerClient();
  const { error } = await supabase.from("policies").update(parsed.data).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function replacePolicyPdf(id: string, file: File) {
  const supabase = getServerClient();
  const { data: policy, error: fetchErr } = await supabase
    .from("policies")
    .select("id, agency_id")
    .eq("id", id)
    .maybeSingle();
  if (fetchErr) return { ok: false as const, error: fetchErr.message };
  if (!policy) return { ok: false as const, error: "Policy not found" };
  const uploaded = await uploadPolicyPdf({ supabase, agencyId: policy.agency_id, policyId: id, file });
  if (!uploaded.ok) return uploaded;
  const { error } = await supabase.from("policies").update({ pdf_path: uploaded.path }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, path: uploaded.path };
}


