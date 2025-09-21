import type { AppRole, SessionUser } from "@/lib/auth/types";

const ROLE_PRIORITY: Record<AppRole, number> = {
  SUPER_ADMIN: 5,
  OWNER: 4,
  ADMIN: 3,
  AGENT: 2,
  STAFF: 1,
};

export function hasRole(user: SessionUser, roles: AppRole | AppRole[]): boolean {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
}

export function hasRoleAtLeast(user: SessionUser, minimum: AppRole): boolean {
  return ROLE_PRIORITY[user.role] >= ROLE_PRIORITY[minimum];
}

export function requireRole(user: SessionUser, roles: AppRole | AppRole[], message?: string) {
  if (!hasRole(user, roles)) {
    throw new Error(message ?? "Forbidden");
  }
}

export function canManageStaff(user: SessionUser) {
  return user.role === "SUPER_ADMIN" || user.role === "OWNER" || user.role === "ADMIN";
}

export function canImpersonateTenant(user: SessionUser) {
  return user.role === "SUPER_ADMIN";
}

export function isAgencyMember(user: SessionUser) {
  return user.role !== "SUPER_ADMIN";
}

export function assertTenantBound(user: SessionUser) {
  if (user.role !== "SUPER_ADMIN" && !user.tenantId) {
    throw new Error("User is not assigned to a tenant");
  }
}
