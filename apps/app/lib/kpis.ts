import { getServerClient } from "./supabase/server";

export type Counts = { customers: number; policies: number; payments: number };

export async function getCounts(agencyId: string | null | undefined): Promise<Counts> {
  if (!agencyId) return { customers: 0, policies: 0, payments: 0 };
  const supabase = getServerClient();

  const [cRes, pRes, payRes] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("agency_id", agencyId),
    supabase.from("policies").select("id", { count: "exact", head: true }).eq("agency_id", agencyId),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("agency_id", agencyId),
  ]);

  const customers = cRes.count ?? 0;
  const policies = pRes.count ?? 0;
  const payments = payRes.count ?? 0;

  return { customers, policies, payments };
}

export type RecentPolicy = { policy_no: string; end_date: string; customer_name: string | null };

export async function getRecentPolicies(
  agencyId: string | null | undefined,
  limit = 5,
): Promise<RecentPolicy[]> {
  if (!agencyId) return [];
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("policies")
    .select("policy_no, end_date, customers(full_name)")
    .eq("agency_id", agencyId)
    .order("end_date", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(
    (row: {
      policy_no: string;
      end_date: string;
      customers?: Array<{ full_name?: string } | null> | null;
    }) => {
      const name = Array.isArray(row.customers)
        ? row.customers[0]?.full_name ?? null
        : null;
      return { policy_no: row.policy_no, end_date: row.end_date, customer_name: name };
    },
  );
}


