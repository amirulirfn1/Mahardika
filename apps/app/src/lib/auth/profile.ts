import { cache } from "react";

import { getServiceRoleClient } from "@/lib/supabase/service";

import { getSession } from "./session";
import type { AppRole } from "./types";

export type Profile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  locale: string;
  role: AppRole;
  tenant_id: string | null;
  agency_id: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  locale: string | null;
};

export const getProfile = cache(async (): Promise<Profile | null> => {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, email, name, phone, locale")
    .eq("id", session.user.id)
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    user_id: data.id,
    email: data.email,
    full_name: data.name,
    phone: data.phone,
    locale: data.locale ?? "en",
    role: session.user.role,
    tenant_id: session.tenantId,
    agency_id: session.tenantId,
  };
});
