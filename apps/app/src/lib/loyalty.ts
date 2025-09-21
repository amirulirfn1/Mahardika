import { z } from "zod";

import { getServerClient } from "@/lib/supabase/server";

export type LoyaltyTier = {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  ringgit_to_point: number;
  threshold_visits: number | null;
  is_default: boolean;
  created_at: string | null;
};

const TierInputSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  name: z.string().min(1),
  ringgit_to_point: z.preprocess((v) => (typeof v === 'string' ? parseFloat(v) : v), z.number().positive()),
  threshold_visits: z.preprocess((v) => (v === undefined || v === null || v === '' ? null : Number(v)), z.number().int().nonnegative().nullable()).optional(),
  is_default: z.coerce.boolean().optional(),
});

export async function listTiers() {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('loyalty_tiers')
    .select('id, tenant_id, code, name, ringgit_to_point, threshold_visits, is_default, created_at')
    .order('is_default', { ascending: false })
    .order('ringgit_to_point', { ascending: true });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data: (data || []) as LoyaltyTier[] };
}

export async function upsertTier(input: unknown) {
  const parsed = TierInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const supabase = await getServerClient();
  const row = parsed.data;
  if (row.id) {
    const { error } = await supabase
      .from('loyalty_tiers')
      .update({
        code: row.code,
        name: row.name,
        ringgit_to_point: row.ringgit_to_point,
        threshold_visits: row.threshold_visits ?? null,
        is_default: row.is_default ?? undefined,
      })
      .eq('id', row.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  }
  const { error } = await supabase.from('loyalty_tiers').insert({
    code: row.code,
    name: row.name,
    ringgit_to_point: row.ringgit_to_point,
    threshold_visits: row.threshold_visits ?? null,
    is_default: row.is_default ?? false,
  } as Record<string, unknown>);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function setDefaultTier(tierId: string) {
  const supabase = await getServerClient();
  const { data: tier, error: fetchErr } = await supabase
    .from('loyalty_tiers')
    .select('id, tenant_id')
    .eq('id', tierId)
    .single();
  if (fetchErr || !tier) return { ok: false as const, error: fetchErr?.message || 'Tier not found' };

  const { error: clearErr } = await supabase
    .from('loyalty_tiers')
    .update({ is_default: false })
    .eq('tenant_id', tier.tenant_id);
  if (clearErr) return { ok: false as const, error: clearErr.message };

  const { error } = await supabase.from('loyalty_tiers').update({ is_default: true }).eq('id', tierId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function getCustomerBalance(customerId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('loyalty_balances_by_customer')
    .select('points')
    .eq('customer_id', customerId)
    .maybeSingle();
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, points: (data?.points as number | undefined) ?? 0 };
}

export async function listLedgerByCustomer(customerId: string, limit = 20) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('loyalty_ledger')
    .select('id, occurred_at, points, reason, ref_type, ref_id')
    .eq('customer_id', customerId)
    .order('occurred_at', { ascending: false })
    .limit(limit);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}
