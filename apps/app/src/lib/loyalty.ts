import { z } from "zod";

import { getServerClient } from "@/lib/supabase/server";

export type LoyaltyTier = {
  id: string;
  agency_id: string;
  code: string;
  name: string;
  points_per_myr: number;
  is_default: boolean;
  created_at: string | null;
};

const TierInputSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  name: z.string().min(1),
  points_per_myr: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().positive()),
  is_default: z.coerce.boolean().optional(),
});

export async function listTiers() {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("loyalty_tiers")
    .select("id, agency_id, code, name, points_per_myr, is_default, created_at")
    .order("is_default", { ascending: false })
    .order("points_per_myr", { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data: (data || []) as LoyaltyTier[] };
}

export async function upsertTier(input: unknown) {
  const parsed = TierInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const supabase = getServerClient();
  const row = parsed.data as Partial<LoyaltyTier>;
  if (row.id) {
    const { error } = await supabase
      .from("loyalty_tiers")
      .update({ code: row.code, name: row.name, points_per_myr: row.points_per_myr, is_default: row.is_default ?? undefined })
      .eq("id", row.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  }
  const { error } = await supabase.from("loyalty_tiers").insert({ code: row.code, name: row.name, points_per_myr: row.points_per_myr } as Record<string, unknown>);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function setDefaultTier(tierId: string) {
  const supabase = getServerClient();
  // Fetch agency for that tier
  const { data: tier, error: fetchErr } = await supabase
    .from("loyalty_tiers")
    .select("id, agency_id")
    .eq("id", tierId)
    .single();
  if (fetchErr || !tier) return { ok: false as const, error: fetchErr?.message || "Tier not found" };
  // Clear defaults in agency, then set one
  const { error: clearErr } = await supabase.from("loyalty_tiers").update({ is_default: false }).eq("agency_id", tier.agency_id);
  if (clearErr) return { ok: false as const, error: clearErr.message };
  const { error } = await supabase.from("loyalty_tiers").update({ is_default: true }).eq("id", tierId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function getCustomerBalance(customerId: string) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("loyalty_balances_by_customer")
    .select("points")
    .eq("customer_id", customerId)
    .maybeSingle();
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, points: (data?.points as number | undefined) ?? 0 };
}

export async function listLedgerByCustomer(customerId: string, limit = 20) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("loyalty_ledger")
    .select("id, occurred_at, direction, points, reason, policy_id, payment_id")
    .eq("customer_id", customerId)
    .order("occurred_at", { ascending: false })
    .limit(limit);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}


