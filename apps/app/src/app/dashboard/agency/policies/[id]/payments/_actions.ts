"use server";

import { logError } from "@/lib/log";
import { createPayment, PaymentInputSchema, restorePayment, softDeletePayment } from "@/lib/payments";

export async function createPaymentAction(policyId: string, formData: FormData) {
  try {
    const input = {
      policy_id: policyId,
      amount: formData.get('amount'),
      method: formData.get('method') || undefined,
      reference: formData.get('reference') || undefined,
      paid_at: formData.get('paid_at') || undefined,
      notes: formData.get('notes') || undefined,
    };
    const parsed = PaymentInputSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };
    return await createPayment(parsed.data);
  } catch (e) {
    logError(e, { op: 'createPaymentAction', policyId });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function softDeletePaymentAction(paymentId: string) {
  try {
    return await softDeletePayment(paymentId);
  } catch (e) {
    logError(e, { op: 'softDeletePaymentAction', paymentId });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function restorePaymentAction(paymentId: string) {
  try {
    return await restorePayment(paymentId);
  } catch (e) {
    logError(e, { op: 'restorePaymentAction', paymentId });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}
