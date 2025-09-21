import { revalidatePath } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getCustomerBalance, listLedgerByCustomer, listTiers } from "@/lib/loyalty";
import { getServerClient } from "@/lib/supabase/server";

import { setCustomerTierAction } from "./_actions";

async function fetchCustomer(id: string) {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('customers')
    .select('id, full_name, email, phone, national_id, loyalty_tier, points_balance, created_at')
    .eq('id', id)
    .maybeSingle();
  return data;
}

export const revalidate = 0;

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await fetchCustomer(params.id);
  if (!customer) return <div className="p-6">Customer not found</div>;
  const [balance, ledger, tiers] = await Promise.all([
    getCustomerBalance(params.id),
    listLedgerByCustomer(params.id, 10),
    listTiers(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{customer.full_name}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/agency/customers/${customer.id}/edit`} className="underline">
            Edit
          </Link>
          <Link href="/dashboard/agency/customers" className="underline">
            Back
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>Details</CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-gray-600">Email</div>
              <div>{customer.email ?? '-'}</div>
            </div>
            <div>
              <div className="text-gray-600">Phone</div>
              <div>{customer.phone ?? '-'}</div>
            </div>
            <div>
              <div className="text-gray-600">National ID</div>
              <div>{customer.national_id ?? '-'}</div>
            </div>
            <div>
              <div className="text-gray-600">Created</div>
              <div>{customer.created_at ? new Date(customer.created_at).toLocaleString() : '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Loyalty</CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <div className="text-gray-600">Points Balance</div>
              <div>{balance.ok ? balance.points : 0}</div>
            </div>
            <div>
              <div className="text-gray-600">Current Tier</div>
              <div>{customer.loyalty_tier ?? 'Not set'}</div>
            </div>
          </div>
          <form
            action={async (fd) => {
              'use server';
              const tierId = String(fd.get('tier_id'));
              await setCustomerTierAction(params.id, tierId);
              revalidatePath(`/dashboard/agency/customers/${params.id}`);
            }}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm">Assign Tier</label>
              <select name="tier_id" className="w-full rounded border px-3 py-2">
                {(tiers.ok ? tiers.data : []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code}){t.is_default ? ' - default' : ''}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Set Tier</Button>
          </form>

          <div className="mt-6 rounded border overflow-hidden">
            <Table>
              <THead>
                <TR>
                  <TH>When</TH>
                  <TH>Points</TH>
                  <TH>Reason</TH>
                  <TH>Reference</TH>
                </TR>
              </THead>
              <TBody>
                {(ledger.ok ? ledger.data : []).map((entry: { id: string; occurred_at: string; points: number; reason: string | null; ref_type: string; ref_id: string | null }) => (
                  <TR key={entry.id}>
                    <TD>{new Date(entry.occurred_at).toLocaleString()}</TD>
                    <TD>{entry.points}</TD>
                    <TD>{entry.reason || '-'}</TD>
                    <TD>{entry.ref_type ?? '-'}{entry.ref_id ? ` #${entry.ref_id.slice(0, 6)}` : ''}</TD>
                  </TR>
                ))}
                {(!ledger.ok || (ledger.data || []).length === 0) && (
                  <TR>
                    <TD colSpan={4}>No loyalty activity</TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
