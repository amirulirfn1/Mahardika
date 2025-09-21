"use server";

import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { z } from "zod";

import { getServiceRoleClient } from "@/lib/supabase/service";

type ActionResult =
  | { ok: true; userId: string; tenantId: string }
  | { ok: false; error: string };

const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).max(120),
  agencyName: z.string().min(1, { message: "Agency name is required" }).max(120),
  email: z.string().email({ message: "Enter a valid email" }).max(160),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128),
});

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const supabase = getServiceRoleClient();
  const normalized = slugify(base) || "agency";

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = attempt === 0 ? normalized : `${normalized}-${attempt + 1}`;
    const { data, error } = await supabase
      .from("agencies")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle<{ id: string }>();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  for (let fallback = 0; fallback < 24; fallback += 1) {
    const candidate = `${normalized}-${randomUUID().slice(0, 6)}`;
    const { data, error } = await supabase
      .from("agencies")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle<{ id: string }>();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error("Unable to allocate a unique agency slug");
}

export async function registerOwnerAction(raw: FormData | Record<string, unknown>): Promise<ActionResult> {
  const payload = raw instanceof FormData
    ? {
        fullName: String(raw.get("full_name") ?? ""),
        agencyName: String(raw.get("agency_name") ?? ""),
        email: String(raw.get("email") ?? ""),
        password: String(raw.get("password") ?? ""),
      }
    : {
        fullName: String((raw as Record<string, unknown>).fullName ?? ""),
        agencyName: String((raw as Record<string, unknown>).agencyName ?? ""),
        email: String((raw as Record<string, unknown>).email ?? ""),
        password: String((raw as Record<string, unknown>).password ?? ""),
      };

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue?.message ?? "Invalid form submission" };
  }

  const { fullName, agencyName, email, password } = parsed.data;
  const supabase = getServiceRoleClient();

  try {
    const lowerEmail = email.trim().toLowerCase();

    const { data: existing, error: existingError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", lowerEmail)
      .maybeSingle<{ id: string }>();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    if (existing) {
      return { ok: false, error: "An account with this email already exists" };
    }

    const passwordHash = await hash(password, 12);

    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .insert({
        email: lowerEmail,
        name: fullName,
        password_hash: passwordHash,
        locale: "en",
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (userError || !user) {
      throw userError ?? new Error("Failed to create user");
    }

    const slug = await ensureUniqueSlug(agencyName);

    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .insert({
        name: agencyName,
        slug,
        created_by: user.id,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (agencyError || !agency) {
      throw agencyError ?? new Error("Failed to create agency");
    }

    const { data: member, error: memberError } = await supabase
      .from("agency_members")
      .insert({
        tenant_id: agency.id,
        user_id: user.id,
        role: "OWNER",
        status: "ACTIVE",
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (memberError || !member) {
      throw memberError ?? new Error("Failed to create membership");
    }

    await supabase
      .from("seats")
      .insert({
        tenant_id: agency.id,
        member_id: member.id,
        role_cached: "OWNER",
        active: true,
      });

    return { ok: true, userId: user.id, tenantId: agency.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { ok: false, error: message };
  }
}