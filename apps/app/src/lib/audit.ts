import { getServerClient } from "@/lib/supabase/server";

export type AuditEvent = {
  id: string;
  at: string;
  actor_id: string | null;
  entity: string;
  entity_id: string | null;
  action: string;
  before: unknown | null;
  after: unknown | null;
};

export async function listAuditForEntity(entity: string, entityId: string, limit = 50) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('audit_log')
    .select('id, at, actor_id, entity, entity_id, action, before_json, after_json')
    .eq('entity', entity)
    .eq('entity_id', entityId)
    .order('at', { ascending: false })
    .limit(limit);
  if (error) return { ok: false as const, error: error.message };
  return {
    ok: true as const,
    data: (data || []).map((row) => ({
      id: row.id,
      at: row.at,
      actor_id: row.actor_id,
      entity: row.entity,
      entity_id: row.entity_id,
      action: row.action,
      before: row.before_json,
      after: row.after_json,
    })) as AuditEvent[],
  };
}
