import { z } from "zod";

import { getServerClient } from "@/lib/supabase/server";

const paymentMethodSchema = z.enum(['CASH', 'TRANSFER', 'CARD']);

export const PaymentInputSchema = z.object({
  policy_id: z.string().uuid(),
  amount: z.preprocess((v) => (typeof v === 'string' ? parseFloat(v) : v), z.number().positive()),
  method: z.preprocess((v) => (typeof v === 'string' ? v.toUpperCase() : v), paymentMethodSchema).default('TRANSFER'),
  reference: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
  paid_at: z
    .preprocess((v) => (typeof v === 'string' && v ? new Date(v).toISOString() : v), z.string().optional()),
  notes: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
});

export type PaymentInput = z.infer<typeof PaymentInputSchema>;

export async function createPayment(input: unknown) {
  const parsed = PaymentInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  const supabase = await getServerClient();
  const { error } = await supabase.from('policy_payments').insert(parsed.data as Record<string, unknown>);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function listPaymentsByPolicy(policyId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('policy_payments')
    .select('id, amount, method, reference, paid_at, notes')
    .eq('policy_id', policyId)
    .is('deleted_at', null)
    .order('paid_at', { ascending: false })
    .limit(20);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data };
}

export async function softDeletePayment(id: string) {
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('policy_payments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function restorePayment(id: string) {
  const supabase = await getServerClient();
  const { error } = await supabase.from('policy_payments').update({ deleted_at: null }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
