"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/phone";
import { getServerClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

const CustomerSchema = z.object({
  full_name: z.string().min(2, "Name too short"),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v: string | undefined) => (v && v.length > 0 ? v : undefined)),
  phone: z
    .string()
    .optional()
    .transform((v: string | undefined) => normalizePhone(v ?? null) ?? undefined),
});

const VehicleSchema = z.object({
  plate_no: z.string().min(1, "Plate is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((v: string | undefined) => (v ? parseInt(v, 10) : undefined))
    .refine((v: number | undefined) => (v == null ? true : Number.isInteger(v) && v >= 1900 && v <= 2100), {
      message: "Year must be 1900..2100",
    }),
});

export async function createCustomer(formData: FormData) {
  try {
    const profile = await getProfile();
    if (!profile?.agency_id) return { ok: false, error: "No agency" } as const;
    const parsed = CustomerSchema.safeParse({
      full_name: formData.get("full_name"),
      email: formData.get("email") ?? undefined,
      phone: formData.get("phone") ?? undefined,
    });
    if (!parsed.success) return { ok: false, error: parsed.error.message } as const;
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("customers")
      .insert({ agency_id: profile.agency_id, ...parsed.data })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true, id: data.id } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const parsed = CustomerSchema.partial().safeParse({
      full_name: formData.get("full_name") ?? undefined,
      email: formData.get("email") ?? undefined,
      phone: formData.get("phone") ?? undefined,
    });
    if (!parsed.success) return { ok: false, error: parsed.error.message } as const;
    const supabase = getServerClient();
    const { error } = await supabase.from("customers").update(parsed.data).eq("id", id);
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}

export async function deleteCustomer(id: string) {
  try {
    const supabase = getServerClient();
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}

export async function addVehicle(customerId: string, formData: FormData) {
  try {
    const profile = await getProfile();
    if (!profile?.agency_id) return { ok: false, error: "No agency" } as const;
    const parsed = VehicleSchema.safeParse({
      plate_no: formData.get("plate_no"),
      make: formData.get("make") ?? undefined,
      model: formData.get("model") ?? undefined,
      year: formData.get("year") ?? undefined,
    });
    if (!parsed.success) return { ok: false, error: parsed.error.message } as const;
    const supabase = getServerClient();
    const { error } = await supabase
      .from("vehicles")
      .insert({ agency_id: profile.agency_id, customer_id: customerId, ...parsed.data });
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}

export async function removeVehicle(vehicleId: string) {
  try {
    const supabase = getServerClient();
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
    if (error) return { ok: false, error: error.message } as const;
    return { ok: true } as const;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg } as const;
  }
}


