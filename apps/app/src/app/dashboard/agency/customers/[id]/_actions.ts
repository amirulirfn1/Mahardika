"use server";

import { getServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";

export async function setCustomerTierAction(customerId: string, tierId: string) {
  try {
    const supabase = getServerClient();
    // Resolve agency of customer to scope membership
    const { data: cust, error: custErr } = await supabase
      .from("customers")
      .select("agency_id")
      .eq("id", customerId)
      .single();
    if (custErr || !cust?.agency_id) return { ok: false as const, error: custErr?.message || "Customer not found" };
    // Upsert membership unique on (agency_id, customer_id)
    const { error } = await supabase
      .from("loyalty_memberships")
      .upsert({ agency_id: cust.agency_id, customer_id: customerId, tier_id: tierId } as Record<string, unknown>, { onConflict: "agency_id,customer_id" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    logError(e, { op: "setCustomerTierAction", customerId, tierId });
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false as const, error: msg };
  }
}



