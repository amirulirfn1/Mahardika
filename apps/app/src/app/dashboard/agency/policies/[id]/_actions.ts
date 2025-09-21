"use server";

import { getProfile } from "@/lib/auth";
import { logError } from "@/lib/log";
import { getServerClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/whatsapp/index";

export async function sendRenewalReminderAction(policyId: string, toNumber: string) {
  try {
    const profile = await getProfile();
    if (!profile?.tenant_id) return { ok: false as const, error: "No tenant context" };

    const supabase = await getServerClient();
    const { data: policy, error: policyErr } = await supabase
      .from('policies')
      .select('policy_no, end_date, customer_id')
      .eq('id', policyId)
      .single();
    if (policyErr || !policy) {
      return { ok: false as const, error: policyErr?.message || 'Policy not found' };
    }

    const body = `Hello, your policy #${policy.policy_no} will expire on ${policy.end_date ?? 'soon'}. Shall we prepare a renewal?`;
    const provider = getProvider();
    await provider.send({ to: toNumber, body, tenantId: profile.tenant_id });

    await supabase.from('conversations').insert({
      tenant_id: profile.tenant_id,
      customer_id: policy.customer_id,
      channel: 'WHATSAPP',
      direction: 'OUT',
      body,
      meta_json: { to: toNumber, policy_id: policyId, kind: 'RENEWAL_REMINDER' },
    });

    return { ok: true as const };
  } catch (e) {
    logError(e, { op: 'sendRenewalReminderAction', policyId, toNumber });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}
