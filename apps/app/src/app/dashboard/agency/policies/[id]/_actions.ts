"use server";

import { getServerClient } from "@/lib/supabase/server";
import { logError } from "@/src/lib/log";
import { getProvider } from "@/src/lib/whatsapp/index";

export async function sendRenewalReminderAction(policyId: string, toNumber: string) {
  try {
    const supabase = getServerClient();
    const { data: session } = await supabase.auth.getUser();
    if (!session.user) return { ok: false as const, error: "Unauthorized" };

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("agency_id")
      .eq("user_id", session.user.id)
      .single();
    if (profErr || !profile?.agency_id) return { ok: false as const, error: "No agency" };

    const { data: policy, error: polErr } = await supabase
      .from("policies")
      .select("policy_no, end_date")
      .eq("id", policyId)
      .single();
    if (polErr || !policy) return { ok: false as const, error: polErr?.message || "Policy not found" };

    const body = `Assalamualaikum, polis #${policy.policy_no} akan tamat pada ${policy.end_date}. Balas mesej ini untuk sambung.`;
    const provider = getProvider();
    return await provider.send({ to: toNumber, body, agencyId: profile.agency_id });
  } catch (e) {
    logError(e, { op: "sendRenewalReminderAction", policyId, toNumber });
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}


