"use server";

import { z } from "zod";

import { getProfile } from "@/lib/auth";
import { logError } from "@/lib/log";
import { uploadPolicyPdf } from "@/lib/storage";
import { getServerClient } from "@/lib/supabase/server";

const BaseSchema = z.object({
  policy_no: z.string().min(1),
  carrier: z.string().min(1),
  product: z.string().min(1),
  status: z.enum(["QUOTE", "IN_FORCE", "LAPSED", "CANCELLED"]).default("QUOTE"),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  premium_gross: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  premium_net: z
    .preprocess((v) => (v === undefined || v === null || v === "" ? null : typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative().nullable())
    .optional(),
  customer_id: z.string().uuid(),
  agent_id: z.string().uuid().optional().or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

export async function createPolicyAction(formData: FormData) {
  try {
    const profile = await getProfile();
    if (!profile?.tenant_id) return { ok: false as const, error: "No tenant context" };
    const parsed = BaseSchema.safeParse({
      policy_no: formData.get("policy_no"),
      carrier: formData.get("carrier"),
      product: formData.get("product"),
      status: formData.get("status") ?? undefined,
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      premium_gross: formData.get("premium_gross"),
      premium_net: formData.get("premium_net"),
      customer_id: formData.get("customer_id"),
      agent_id: formData.get("agent_id") ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };

    const supabase = await getServerClient();
    const payload = {
      tenant_id: profile.tenant_id,
      ...parsed.data,
      premium_net: parsed.data.premium_net ?? parsed.data.premium_gross,
    };
    const { data: created, error } = await supabase
      .from("policies")
      .insert(payload)
      .select("id, tenant_id, files_json")
      .single();
    if (error) return { ok: false as const, error: error.message };

    const file = formData.get("pdf") as File | null;
    if (file && file.size > 0) {
      const up = await uploadPolicyPdf({ supabase, policyId: created.id, tenantId: created.tenant_id, file });
      if (!up.ok) return { ok: false as const, error: up.error };
      const existing = Array.isArray(created.files_json) ? created.files_json : [];
      const nextFiles = [...existing, up.fileEntry];
      const { error: updateErr } = await supabase
        .from("policies")
        .update({ files_json: nextFiles })
        .eq("id", created.id);
      if (updateErr) return { ok: false as const, error: updateErr.message };
    }
    return { ok: true as const, id: created.id };
  } catch (e) {
    logError(e, { op: "createPolicyAction" });
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}

export async function updatePolicyAction(id: string, formData: FormData) {
  try {
    const parsed = BaseSchema.partial().safeParse({
      policy_no: formData.get("policy_no") ?? undefined,
      carrier: formData.get("carrier") ?? undefined,
      product: formData.get("product") ?? undefined,
      status: formData.get("status") ?? undefined,
      start_date: formData.get("start_date") ?? undefined,
      end_date: formData.get("end_date") ?? undefined,
      premium_gross: formData.get("premium_gross") ?? undefined,
      premium_net: formData.get("premium_net") ?? undefined,
      customer_id: formData.get("customer_id") ?? undefined,
      agent_id: formData.get("agent_id") ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };
    const supabase = await getServerClient();
    const patch: Record<string, unknown> = { ...parsed.data };
    if (patch.premium_net === undefined && patch.premium_gross !== undefined) {
      patch.premium_net = patch.premium_gross;
    }
    const { error } = await supabase.from("policies").update(patch).eq("id", id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    logError(e, { op: "updatePolicyAction", id });
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}

export async function uploadPolicyPdfAction(id: string, file: File) {
  try {
    const supabase = await getServerClient();
    const { data: policy, error } = await supabase
      .from("policies")
      .select("id, tenant_id, files_json")
      .eq("id", id)
      .maybeSingle<{ id: string; tenant_id: string; files_json: unknown }>();
    if (error) return { ok: false as const, error: error.message };
    if (!policy) return { ok: false as const, error: "Policy not found" };
    const up = await uploadPolicyPdf({ supabase, policyId: id, tenantId: policy.tenant_id, file });
    if (!up.ok) return up;
    const existing = Array.isArray(policy.files_json) ? policy.files_json : [];
    const files = [...existing, up.fileEntry];
    const { error: uErr } = await supabase.from("policies").update({ files_json: files }).eq("id", id);
    if (uErr) return { ok: false as const, error: uErr.message };
    return { ok: true as const, path: up.path };
  } catch (e) {
    logError(e, { op: "uploadPolicyPdfAction", id, size: file?.size });
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}
