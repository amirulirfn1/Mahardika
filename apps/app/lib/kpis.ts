import { getServerClient } from "./supabase/server";

export type Counts = { customers: number; policies: number; payments: number };

export async function getCounts(tenantId: string | null | undefined): Promise<Counts> {
  if (!tenantId) return { customers: 0, policies: 0, payments: 0 };
  const supabase = await getServerClient();

  const [cRes, pRes, payRes] = await Promise.all([
    supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('policies')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('policy_payments')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
  ]);

  const customers = cRes.count ?? 0;
  const policies = pRes.count ?? 0;
  const payments = payRes.count ?? 0;

  return { customers, policies, payments };
}

export type RecentPolicy = {
  policy_no: string;
  end_date: string;
  customer_name: string | null;
};

export async function getRecentPolicies(tenantId: string | null | undefined, limit = 5): Promise<RecentPolicy[]> {
  if (!tenantId) return [];
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('policies')
    .select('policy_no, end_date, customer:customers(full_name)')
    .eq('tenant_id', tenantId)
    .order('end_date', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(row => {
    const customer = Array.isArray(row.customer) ? row.customer[0] : row.customer;
    return {
      policy_no: row.policy_no,
      end_date: row.end_date,
      customer_name: customer?.full_name ?? null,
    };
  });
}
