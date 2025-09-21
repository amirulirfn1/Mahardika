import { describe, it, expect } from 'vitest';

import { tenantScope, requireTenantId } from '@/lib/tenant';

describe('tenant helpers', () => {
  const session = {
    user: { id: 'u', role: 'OWNER', tenantId: 'tenant-123', locale: 'en' },
    tenantId: 'tenant-123',
  } as any;

  it('returns tenant when present', () => {
    expect(requireTenantId(session)).toBe('tenant-123');
  });

  it('scopes plain where clause', () => {
    const scoped = tenantScope({ session, where: { status: 'ACTIVE' } });
    expect(scoped).toEqual({ status: 'ACTIVE', tenant_id: 'tenant-123' });
  });

  it('uses mapping function', () => {
    const scoped = tenantScope({ session, map: (tenantId) => ({ tenant_id: tenantId, foo: true }) });
    expect(scoped).toEqual({ tenant_id: 'tenant-123', foo: true });
  });
});
