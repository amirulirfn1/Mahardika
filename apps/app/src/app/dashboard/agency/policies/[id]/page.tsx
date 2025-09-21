import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { listAuditForEntity } from "@/lib/audit";
import { getCustomerBalance } from "@/lib/loyalty";
import { listPaymentsByPolicy } from "@/lib/payments";
import { restorePolicy, softDeletePolicy } from "@/lib/policies";
import { getPolicyPdfUrl } from "@/lib/storage";
import { getServerClient } from "@/lib/supabase/server";

import { sendRenewalReminderAction } from "./_actions";

interface FileEntry {
  path: string;
  name?: string;
  kind?: string;
  uploaded_at?: string;
}

interface PolicyDetail {
  id: string;
  policy_no: string;
  carrier: string;
  product: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  premium_gross: number | null;
  premium_net: number | null;
  files_json: unknown;
  customer?: { full_name?: string } | { full_name?: string }[] | null;
}

async function fetchPolicy(id: string): Promise<PolicyDetail | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('policies')
    .select('id, policy_no, carrier, product, status, start_date, end_date, premium_gross, premium_net, files_json, customer:customers(full_name)')
    .eq('id', id)
    .maybeSingle();
  return (data as PolicyDetail | null) ?? null;
}

export default async function PolicyDetailPage({ params }: { params: { id: string } }) {
  const policy = await fetchPolicy(params.id);
  if (!policy) return <div className="p-6">Policy not found</div>;

  const supabase = await getServerClient();
  const files = (Array.isArray(policy.files_json) ? policy.files_json : []) as FileEntry[];
  const primaryFile = files.length > 0 ? files[files.length - 1] : null;
  const signed = primaryFile ? await getPolicyPdfUrl({ supabase, path: primaryFile.path }) : null;
  const signedUrl = signed && signed.ok ? signed.url : null;

  const payments = await listPaymentsByPolicy(params.id);
  const audit = await listAuditForEntity('policy', params.id, 50);
  const { data: policyRow } = await supabase
    .from('policies')
    .select('customer_id')
    .eq('id', params.id)
    .maybeSingle();
  const customerId = (policyRow?.customer_id as string | undefined) ?? undefined;
  const balance = customerId ? await getCustomerBalance(customerId) : null;

  const customer = Array.isArray(policy.customer) ? policy.customer[0] : policy.customer;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Policy {policy.policy_no}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/agency/policies/${policy.id}/edit`} className="underline">
            Edit
          </Link>
          <Link href="/dashboard/agency/policies" className="underline">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="text-sm text-gray-600">Customer</div>
          <div>{customer?.full_name ?? '-'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Carrier</div>
          <div>{policy.carrier}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Product</div>
          <div>{policy.product}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Status</div>
          <div>{policy.status}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Start</div>
          <div>{policy.start_date ?? '-'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">End</div>
          <div>{policy.end_date ?? '-'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Premium Gross</div>
          <div>{policy.premium_gross != null ? policy.premium_gross.toFixed(2) : '-'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Premium Net</div>
          <div>{policy.premium_net != null ? policy.premium_net.toFixed(2) : '-'}</div>
        </div>
      </div>

      {primaryFile ? (
        signedUrl ? (
          <a href={signedUrl} target="_blank" rel="noopener noreferrer">
            <Button type="button">Open Latest PDF</Button>
          </a>
        ) : (
          <div className="text-sm text-gray-600">Unable to generate signed URL</div>
        )
      ) : (
        <div className="text-sm text-gray-600">No documents uploaded</div>
      )}

      <div className="space-y-3 rounded border p-4">
        <div className="font-medium">Communications</div>
        <form
          action={async (fd) => {
            'use server';
            const to = String(fd.get('to'));
            if (!to) return;
            await sendRenewalReminderAction(policy.id, to);
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm">WhatsApp number</label>
            <input name="to" className="w-full rounded border px-3 py-2" placeholder="60XXXXXXXXX" />
          </div>
          <Button type="submit">Send WhatsApp reminder</Button>
        </form>
        <div>
          <a className="text-sm underline" href="/dashboard/agency/communications">
            View communications log
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
          <Link href={`/dashboard/agency/policies/${policy.id}/payments`} className="underline">
            Manage
          </Link>
        </div>
        <div className="rounded border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left">Paid At</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Method</th>
                <th className="p-2 text-left">Reference</th>
              </tr>
            </thead>
            <tbody>
              {(payments.ok ? payments.data : []).slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{new Date(p.paid_at).toLocaleString()}</td>
                  <td className="p-2">{Number(p.amount).toFixed(2)}</td>
                  <td className="p-2">{p.method}</td>
                  <td className="p-2">{p.reference || '-'}</td>
                </tr>
              ))}
              {(!payments.ok || (payments.data || []).length === 0) && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={4}>
                    No payments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {balance?.ok && (
          <div className="text-sm text-gray-600">Customer points balance: {balance.points}</div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Danger zone</h2>
        <form
          action={async () => {
            'use server';
            await softDeletePolicy(policy.id);
          }}
        >
          <button className="rounded bg-red-600 px-4 py-2 text-white">Soft delete policy</button>
        </form>
        <form
          action={async () => {
            'use server';
            await restorePolicy(policy.id);
          }}
        >
          <button className="rounded border px-4 py-2">Restore policy</button>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Audit</h2>
        <div className="rounded border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left">When</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Actor</th>
                <th className="p-2 text-left">Summary</th>
              </tr>
            </thead>
            <tbody>
              {(audit.ok ? audit.data : []).map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-2">{new Date(entry.at).toLocaleString()}</td>
                  <td className="p-2">{entry.action}</td>
                  <td className="p-2">{entry.actor_id ? entry.actor_id.slice(0, 8) : '-'}</td>
                  <td className="p-2 max-w-[500px] truncate" title={JSON.stringify(entry.after || entry.before || {})}>
                    {Object.keys(entry.after || entry.before || {}).join(', ') || '-'}
                  </td>
                </tr>
              ))}
              {(!audit.ok || (audit.data || []).length === 0) && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={4}>
                    No audit entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
