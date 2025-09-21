import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import type { AppRole, AuthUser } from "@/lib/auth/types";
import { env } from "@/lib/env";
import { getServiceRoleClient } from "@/lib/supabase/service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const USER_REFRESH_INTERVAL_SECONDS = 60 * 5;

function nowEpochSeconds() {
  return Math.floor(Date.now() / 1000);
}

type UserProfileRow = {
  id: string;
  email: string;
  name: string | null;
  locale: string | null;
  password_hash: string | null;
  platform_role: string | null;
};

type MembershipRow = {
  tenant_id: string;
  role: AppRole;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
};

async function ensureUserProfile(params: {
  email: string;
  name?: string | null;
  locale?: string | null;
}): Promise<{ id: string } & Pick<AuthUser, "role" | "tenantId" | "locale">> {
  const supabase = getServiceRoleClient();

  const { data: existing, error: existingError } = await supabase
    .from("user_profiles")
    .select("id, locale, platform_role")
    .eq("email", params.email)
    .maybeSingle<UserProfileRow>();

  if (existingError) {
    throw new Error(existingError.message);
  }

  let userId = existing?.id;
  let locale = existing?.locale ?? params.locale ?? "en";
  let role: AppRole | "SUPER_ADMIN" = "STAFF";
  let tenantId: string | null = null;

  if (!existing) {
    const { data: created, error: createError } = await supabase
      .from("user_profiles")
      .insert({
        email: params.email,
        name: params.name ?? null,
        locale,
      })
      .select("id, locale")
      .maybeSingle<{ id: string; locale: string | null }>();

    if (createError || !created) {
      throw createError ?? new Error("Failed to create Supabase profile");
    }

    userId = created.id;
    locale = created.locale ?? locale;
  } else if (existing.platform_role === "SUPER_ADMIN") {
    return { id: existing.id, role: "SUPER_ADMIN", tenantId: null, locale };
  }

  const { data: membership, error: membershipErr } = await supabase
    .from("agency_members")
    .select("tenant_id, role, status")
    .eq("user_id", userId!)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<MembershipRow>();

  if (membershipErr) {
    throw new Error(membershipErr.message);
  }

  role = membership?.role ?? "STAFF";
  tenantId = membership?.tenant_id ?? null;

  return {
    id: userId!,
    role,
    tenantId,
    locale,
  };
}

async function resolveUserClaims(userId: string): Promise<Pick<AuthUser, "role" | "tenantId" | "locale">> {
  const supabase = getServiceRoleClient();
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id, locale, platform_role")
    .eq("id", userId)
    .maybeSingle<UserProfileRow>();

  if (error) {
    throw new Error(error.message);
  }
  if (!profile) {
    throw new Error("Profile not found");
  }

  const locale = profile.locale ?? "en";
  if (profile.platform_role === "SUPER_ADMIN") {
    return { role: "SUPER_ADMIN", tenantId: null, locale };
  }

  const { data: membership, error: membershipErr } = await supabase
    .from("agency_members")
    .select("tenant_id, role, status")
    .eq("user_id", userId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<MembershipRow>();

  if (membershipErr) {
    throw new Error(membershipErr.message);
  }

  return {
    role: membership?.role ?? "STAFF",
    tenantId: membership?.tenant_id ?? null,
    locale,
  };
}

async function authenticateWithCredentials(email: string, password: string): Promise<AuthUser | null> {
  const supabase = getServiceRoleClient();
  const { data: userRow, error } = await supabase
    .from("user_profiles")
    .select("id, email, name, locale, password_hash, platform_role")
    .eq("email", email)
    .maybeSingle<UserProfileRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!userRow?.password_hash) {
    return null;
  }

  const passwordValid = await compare(password, userRow.password_hash);
  if (!passwordValid) {
    return null;
  }

  const claims = await resolveUserClaims(userRow.id);

  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    locale: claims.locale,
    role: claims.role,
    tenantId: claims.tenantId,
  };
}

const providers: NextAuthOptions["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials) {
      const parsed = credentialsSchema.safeParse(rawCredentials);
      if (!parsed.success) {
        return null;
      }

      const { email, password } = parsed.data;
      try {
        const user = await authenticateWithCredentials(email.toLowerCase(), password);
        return user ?? null;
      } catch (err) {
        console.error("[auth] credential auth error", err);
        return null;
      }
    },
  }),
];

if (env.GOOGLE_AUTH_ENABLED && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    })
  );
}

export const authOptions: NextAuthOptions & { trustHost?: boolean } = {
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) {
          return false;
        }

        try {
          const profile = await ensureUserProfile({
            email,
            name: user.name,
          });

          user.id = profile.id;
          (user as AuthUser).role = profile.role as AppRole;
          (user as AuthUser).tenantId = profile.tenantId;
          (user as AuthUser).locale = profile.locale;
        } catch (err) {
          console.error("[auth] google sign-in failed", err);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AppRole | undefined) ?? "STAFF";
        session.user.tenantId = (token.impersonatedTenantId as string | null | undefined) ?? (token.tenantId as string | null | undefined) ?? null;
        session.user.locale = (token.locale as string | undefined) ?? "en";
      }

      session.tenantId = session.user?.tenantId ?? null;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        const authUser = user as AuthUser;
        token.sub = authUser.id;
        token.role = authUser.role;
        token.tenantId = authUser.tenantId;
        token.locale = authUser.locale;
        token.userSyncedAt = nowEpochSeconds();
        return token;
      }

      if (user) {
        const authUser = user as AuthUser;
        token.role = authUser.role;
        token.tenantId = authUser.tenantId;
        token.locale = authUser.locale;
        token.userSyncedAt = nowEpochSeconds();
        return token;
      }

      const lastSynced = typeof token.userSyncedAt === "number" ? token.userSyncedAt : 0;
      const shouldRefresh = nowEpochSeconds() - lastSynced >= USER_REFRESH_INTERVAL_SECONDS;

      if (shouldRefresh && token.sub) {
        try {
          const claims = await resolveUserClaims(token.sub);
          token.role = claims.role;
          token.tenantId = claims.tenantId;
          token.locale = claims.locale;
          token.userSyncedAt = nowEpochSeconds();
        } catch (err) {
          console.error("[auth] refresh claims failed", err);
        }
      }

      return token;
    },
  },
  trustHost: true,
};