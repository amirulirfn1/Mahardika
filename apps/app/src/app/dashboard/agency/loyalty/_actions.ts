"use server";

import { logError } from "@/lib/log";
import { listTiers, setDefaultTier, upsertTier } from "@/lib/loyalty";

export async function upsertTierAction(formData: FormData) {
  try {
    const input = {
      id: (formData.get('id') || undefined) as string | undefined,
      code: formData.get('code') || undefined,
      name: formData.get('name') || undefined,
      ringgit_to_point: formData.get('ringgit_to_point') || undefined,
      threshold_visits: formData.get('threshold_visits') || undefined,
      is_default: (formData.get('is_default') as string | undefined) === 'on',
    };
    return await upsertTier(input);
  } catch (e) {
    logError(e, { op: 'upsertTierAction' });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function setDefaultTierAction(tierId: string) {
  try {
    return await setDefaultTier(tierId);
  } catch (e) {
    logError(e, { op: 'setDefaultTierAction', tierId });
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function listTiersAction() {
  return await listTiers();
}
