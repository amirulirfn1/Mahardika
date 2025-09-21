import type { DefaultSession, Session } from "next-auth";

export const APP_ROLES = ["SUPER_ADMIN", "OWNER", "ADMIN", "AGENT", "STAFF"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export type SessionUser = DefaultSession['user'] & {
  id: string;
  role: AppRole;
  tenantId: string | null;
  locale: string;
};

export type SessionWithUser = Session & {
  user: SessionUser;
  tenantId: string | null;
};

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  locale: string;
  role: AppRole;
  tenantId: string | null;
};
