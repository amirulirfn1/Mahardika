import { Role } from "@prisma/client";

import type { SessionUser } from "@/lib/auth/types";

const ROLE_PRIORITY: Record<Role, number> = {
  [Role.PLATFORM_ADMIN]: 5,
  [Role.AGENCY_OWNER]: 4,
  [Role.AGENT]: 3,
  [Role.AGENCY_STAFF]: 2,
  [Role.CUSTOMER]: 1,
};

export function hasRole(user: SessionUser, roles: Role | Role[]): boolean {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user.role);
}

export function hasRoleAtLeast(user: SessionUser, minimum: Role): boolean {
  return ROLE_PRIORITY[user.role] >= ROLE_PRIORITY[minimum];
}

export function requireRole(user: SessionUser, roles: Role | Role[], message?: string) {
  if (!hasRole(user, roles)) {
    throw new Error(message ?? "Forbidden");
  }
}

export function canManageStaff(user: SessionUser) {
  return user.role === Role.PLATFORM_ADMIN || user.role === Role.AGENCY_OWNER;
}

export function canImpersonateTenant(user: SessionUser) {
  return user.role === Role.PLATFORM_ADMIN;
}

export function isAgencyMember(user: SessionUser) {
  return user.role === Role.AGENCY_OWNER || user.role === Role.AGENT || user.role === Role.AGENCY_STAFF;
}

export function isCustomer(user: SessionUser) {
  return user.role === Role.CUSTOMER;
}

export function assertTenantBound(user: SessionUser) {
  if (user.role !== Role.PLATFORM_ADMIN && !user.agencyId) {
    throw new Error("User is not assigned to an agency");
  }
}
