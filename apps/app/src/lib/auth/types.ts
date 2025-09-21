export const APP_ROLES = ["SUPER_ADMIN", "OWNER", "ADMIN", "AGENT", "STAFF"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  role: AppRole;
  tenantId: string | null;
}

export interface AuthSession {
  user: AuthUser;
  tenantId: string | null;
}

export type SessionUser = AuthUser;