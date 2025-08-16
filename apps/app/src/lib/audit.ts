import { getServerClient } from "@/lib/supabase/server";

export type AuditEvent = {
  id: string;
  occurred_at: string;
  actor_user_id: string | null;
  actor_agency_id: string | null;
  entity: 'policy' | 'payment' | 'storage_object' | 'message';
  entity_id: string | null;
  action: string;
  before: unknown | null;
  after: unknown | null;
};

export async function listAuditForEntity(entity: 'policy' | 'payment', entityId: string, limit = 50) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from('audit_events')
    .select('id, occurred_at, actor_user_id, actor_agency_id, entity, entity_id, action, before, after')
    .eq('entity', entity)
    .eq('entity_id', entityId)
    .order('occurred_at', { ascending: false })
    .limit(limit);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data: (data || []) as AuditEvent[] };
}


