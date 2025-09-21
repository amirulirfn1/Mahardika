"use server";

import { z } from "zod";

import { getProfile } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";
import { getServerClient } from "@/lib/supabase/server";

const CustomerSchema = z.object({
  full_name: z.string().min(2, 'Name too short'),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(''))
    .transform((v: string | undefined) => (v && v.length > 0 ? v : undefined)),
  phone: z
    .string()
    .optional()
    .transform((v: string | undefined) => normalizePhone(v ?? null) ?? undefined),
  national_id: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
  notes: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined)),
});

export async function createCustomer(formData: FormData) {
  try {
    const profile = await getProfile();
    if (!profile?.tenant_id) return { ok: false as const, error: 'No tenant context' };
    const parsed = CustomerSchema.safeParse({
      full_name: formData.get('full_name'),
      email: formData.get('email') ?? undefined,
      phone: formData.get('phone') ?? undefined,
      national_id: formData.get('national_id') ?? undefined,
      notes: formData.get('notes') ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };
    const supabase = await getServerClient();
    const { data, error } = await supabase
      .from('customers')
      .insert({ tenant_id: profile.tenant_id, ...parsed.data })
      .select('id')
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, id: data.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const parsed = CustomerSchema.partial().safeParse({
      full_name: formData.get('full_name') ?? undefined,
      email: formData.get('email') ?? undefined,
      phone: formData.get('phone') ?? undefined,
      national_id: formData.get('national_id') ?? undefined,
      notes: formData.get('notes') ?? undefined,
    });
    if (!parsed.success) return { ok: false as const, error: parsed.error.message };
    const supabase = await getServerClient();
    const { error } = await supabase
      .from('customers')
      .update(parsed.data)
      .eq('id', id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const supabase = await getServerClient();
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, error: msg };
  }
}
