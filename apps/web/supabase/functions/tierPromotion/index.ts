import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface TierRule {
  current: string;
  target: string;
  minPoints: number;
}

const TIER_RULES: TierRule[] = [
  { current: 'bronze', target: 'silver', minPoints: 1000 },
  { current: 'silver', target: 'gold', minPoints: 3000 },
  { current: 'gold', target: 'platinum', minPoints: 6000 },
];

serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const summaries: Record<string, number> = {};
  for (const rule of TIER_RULES) {
    const { data: updated, error } = await supabase
      .from('customers')
      .update({ tier: rule.target })
      .eq('tier', rule.current)
      .gte('loyalty_points', rule.minPoints)
      .select('id, agency_id');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    const promotedCount = updated?.length ?? 0;
    summaries[`${rule.current}->${rule.target}`] = promotedCount;

    if (promotedCount > 0 && updated) {
      const auditRows = updated.map((u) => ({
        agency_id: u.agency_id,
        action: 'tier_promotion',
        resource: 'customer',
        resource_id: u.id,
        user_role: 'system',
        new_values: { tier: rule.target },
      }));
      const { error: auditErr } = await supabase.from('audit_logs').insert(auditRows);
      if (auditErr) {
        console.error('Audit log error', auditErr.message);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, promoted: summaries }));
}); 