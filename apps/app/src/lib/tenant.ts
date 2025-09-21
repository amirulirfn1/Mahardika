import { canImpersonateTenant } from "@/lib/auth/rbac";
import type { SessionWithUser } from "@/lib/auth/types";

export function resolveTenantId(session: SessionWithUser, asTenant?: string | null) {
  if (canImpersonateTenant(session.user) && asTenant) {
    return asTenant;
  }

  if (session.tenantId) {
    return session.tenantId;
  }

  return session.user.tenantId;
}

export function requireTenantId(session: SessionWithUser, asTenant?: string | null) {
  const tenantId = resolveTenantId(session, asTenant);
  if (!tenantId) {
    throw new Error("Tenant context is required");
  }
  return tenantId;
}

interface TenantScopeOptions<TWhere extends Record<string, unknown>> {
  session: SessionWithUser;
  where?: TWhere;
  asTenant?: string | null;
  field?: string;
  map?: (tenantId: string) => TWhere;
}

export function tenantScope<TWhere extends Record<string, unknown>>({
  session,
  where,
  asTenant,
  field = "tenant_id",
  map,
}: TenantScopeOptions<TWhere>): TWhere {
  const tenantId = requireTenantId(session, asTenant);

  if (map) {
    const mapped = map(tenantId);
    return { ...(where ?? {}), ...mapped } as TWhere;
  }

  if (!where) {
    return { [field]: tenantId } as unknown as TWhere;
  }

  const existing = where[field];

  const scopedValue =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...existing, equals: tenantId }
      : tenantId;

  return { ...where, [field]: scopedValue } as TWhere;
}
