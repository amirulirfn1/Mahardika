import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { getServiceRoleClient } from "@/lib/supabase/service";

import type { AppRole, AuthSession, AuthUser } from "./types";

interface ProfileRow {
  id: string;
  email: string;
  name: string | null;
  locale: string | null;
  platform_role: string | null;
}

interface MembershipRow {
  tenant_id: string;
  role: AppRole;
}

function deriveLocale(profile?: ProfileRow | null, userMetadata?: Record<string, unknown>): string {
  if (profile?.locale) return profile.locale;
  const metaLocale = userMetadata?.locale;
  return typeof metaLocale === "string" && metaLocale.length > 0 ? metaLocale : "en";
}

export async function getSession(): Promise<AuthSession | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const service = getServiceRoleClient();

  let { data: profile } = await service
    .from("user_profiles")
    .select("id, email, name, locale, platform_role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (!profile) {
    const { data: createdProfile } = await service
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.full_name as string | undefined) ?? null,
        locale: deriveLocale(undefined, user.user_metadata ?? undefined),
      })
      .select("id, email, name, locale, platform_role")
      .maybeSingle<ProfileRow>();

    profile = createdProfile ?? null;
  }

  let role: AppRole = profile?.platform_role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "STAFF";
  let tenantId: string | null = null;

  if (role !== "SUPER_ADMIN") {
    const { data: membership } = await service
      .from("agency_members")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<MembershipRow>();

    if (membership) {
      role = membership.role;
      tenantId = membership.tenant_id;
    }
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email ?? profile?.email ?? "",
    name: profile?.name ?? (user.user_metadata?.full_name as string | undefined) ?? null,
    locale: deriveLocale(profile, user.user_metadata ?? undefined),
    role,
    tenantId,
  };

  return {
    user: authUser,
    tenantId,
  };
}

export async function requireSession(params?: { redirectTo?: string }): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    if (params?.redirectTo) {
      redirect(params.redirectTo);
    }
    redirect("/signin");
  }
  return session;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}