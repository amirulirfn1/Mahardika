"use server";

import { randomUUID } from "crypto";
import { z } from "zod";

import { getSession } from "@/lib/auth/session";
import { getServiceRoleClient } from "@/lib/supabase/service";

type ActionResult =
  | { ok: true; userId: string; tenantId: string }
  | { ok: false; error: string };

const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).max(120),
  agencyName: z.string().min(1, { message: "Agency name is required" }).max(120),
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

export async function completeOwnerSetupAction(raw: FormData | Record<string, unknown>): Promise<ActionResult> {
  const payload = raw instanceof FormData
    ? {
        fullName: String(raw.get("full_name") ?? ""),
        agencyName: String(raw.get("agency_name") ?? ""),
      }
    : {
        fullName: String((raw as Record<string, unknown>).fullName ?? ""),
        agencyName: String((raw as Record<string, unknown>).agencyName ?? ""),
      };

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue?.message ?? "Invalid form submission" };
  }

  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Sign in to finish setting up your agency." };
  }
  const supabase = getServiceRoleClient();

  try {
    await supabase
      .from("user_profiles")
      .upsert(
        {
          id: session.user.id,
          email: session.user.email,
          name: parsed.data.fullName,
          locale: session.user.locale ?? "en",
        },
        { onConflict: "id" }
      );

    const { data: existingMembership } = await supabase
      .from("agency_members")
      .select("tenant_id")
      .eq("user_id", session.user.id)
      .eq("status", "ACTIVE")
      .limit(1)
      .maybeSingle<{ tenant_id: string }>();

    if (existingMembership?.tenant_id) {
      return { ok: true, userId: session.user.id, tenantId: existingMembership.tenant_id };
    }

    const slug = await ensureUniqueSlug(parsed.data.agencyName);

    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .insert({
        name: parsed.data.agencyName,
        slug,
        created_by: session.user.id,
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
        user_id: session.user.id,
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

    return { ok: true, userId: session.user.id, tenantId: agency.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { ok: false, error: message };
  }
}