"use server";

import { createPayment, PaymentInputSchema } from "@/src/lib/payments";

export async function createPaymentAction(policyId: string, formData: FormData) {
  const input = {
    policy_id: policyId,
    amount: formData.get("amount"),
    channel: formData.get("channel") || undefined,
    reference: formData.get("reference") || undefined,
    paid_at: formData.get("paid_at") || undefined,
    notes: formData.get("notes") || undefined,
  };
  const parsed = PaymentInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.message };
  return await createPayment(parsed.data);
}


