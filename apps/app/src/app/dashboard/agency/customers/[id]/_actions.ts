"use server";

import { logError } from "@/lib/log";
import { getServerClient } from "@/lib/supabase/server";

export async function setCustomerTierAction(customerId: string, tierId: string) {
  try {
    const supabase = await getServerClient();
    const { data: tier, error: tierErr } = await supabase
      .from('loyalty_tiers')
      .select('code')
      .eq('id', tierId)
      .single();
    if (tierErr || !tier?.code) {
      return { ok: false as const, error: tierErr?.message || 'Tier not found' };
    }

    const { error } = await supabase
      .from('customers')
      .update({ loyalty_tier: tier.code })
      .eq('id', customerId);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    logError(e, { op: 'setCustomerTierAction', customerId, tierId });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}
