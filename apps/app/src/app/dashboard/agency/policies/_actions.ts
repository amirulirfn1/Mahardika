"use server";

import { z } from "zod";
import { getProfile } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { uploadPolicyPdf } from "@/src/lib/storage";

const BaseSchema = z.object({
  policy_no: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  premium_myr: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
});

export async function createPolicyAction(formData: FormData) {
  try {
    const profile = await getProfile();
    if (!profile?.agency_id) return { ok: false as const, error: "No agency" };
    const parsed = BaseSchema.safeParse({
      policy_no: formData.get("policy_no"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      premium_myr: formData.get("premium_myr"),
      customer_id: formData.get("customer_id"),
      vehicle_id: formData.get("vehicle_id") ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };

    const supabase = getServerClient();
    const { data: created, error } = await supabase
      .from("policies")
      .insert({ agency_id: profile.agency_id, ...parsed.data })
      .select("id")
      .single();
    if (error) return { ok: false as const, error: error.message };

    const file = formData.get("pdf") as File | null;
    if (file && file.size > 0) {
      const up = await uploadPolicyPdf({ supabase, agencyId: profile.agency_id, policyId: created.id, file });
      if (!up.ok) return { ok: false as const, error: up.error };
      const { error: uErr } = await supabase.from("policies").update({ pdf_path: up.path }).eq("id", created.id);
      if (uErr) return { ok: false as const, error: uErr.message };
    }
    return { ok: true as const, id: created.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}

export async function updatePolicyAction(id: string, formData: FormData) {
  try {
    const parsed = BaseSchema.partial().safeParse({
      policy_no: formData.get("policy_no") ?? undefined,
      start_date: formData.get("start_date") ?? undefined,
      end_date: formData.get("end_date") ?? undefined,
      premium_myr: formData.get("premium_myr") ?? undefined,
      customer_id: formData.get("customer_id") ?? undefined,
      vehicle_id: formData.get("vehicle_id") ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };
    const supabase = getServerClient();
    const { error } = await supabase.from("policies").update(parsed.data).eq("id", id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}

export async function uploadPolicyPdfAction(id: string, file: File) {
  try {
    const supabase = getServerClient();
    const { data: policy, error } = await supabase.from("policies").select("id, agency_id").eq("id", id).maybeSingle();
    if (error) return { ok: false as const, error: error.message };
    if (!policy) return { ok: false as const, error: "Policy not found" };
    const up = await uploadPolicyPdf({ supabase, agencyId: policy.agency_id, policyId: id, file });
    if (!up.ok) return up;
    const { error: uErr } = await supabase.from("policies").update({ pdf_path: up.path }).eq("id", id);
    if (uErr) return { ok: false as const, error: uErr.message };
    return { ok: true as const, path: up.path };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}


