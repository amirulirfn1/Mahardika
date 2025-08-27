import { getServerClient } from "./supabase/server";

export async function getSession() {
  const supabase = getServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getProfile() {
  if (process.env.SKIP_AUTH === "true") {
    return {
      id: "local-preview-profile",
      user_id: "local-preview-user",
      agency_id: null,
      role: "agency_owner",
      full_name: "Local Preview",
      phone: null,
    } as {
      id: string;
      user_id: string;
      agency_id: string | null;
      role: "platform_admin" | "agency_owner" | "staff" | "customer";
      full_name: string;
      phone: string | null;
    };
  }
  const supabase = getServerClient();
  const session = await getSession();
  if (!session?.user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, agency_id, role, full_name, phone")
    .eq("user_id", session.user.id)
    .single();
  if (error) return null;
  return data;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
