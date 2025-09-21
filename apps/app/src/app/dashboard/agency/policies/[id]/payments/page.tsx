import Link from "next/link";

import { getCustomerBalance } from "@/lib/loyalty";
import { listPaymentsByPolicy } from "@/lib/payments";
import { getServerClient } from "@/lib/supabase/server";

import { createPaymentAction, restorePaymentAction, softDeletePaymentAction } from "./_actions";

export const revalidate = 0;

export default async function PolicyPaymentsPage({ params }: { params: { id: string } }) {
  const payments = await listPaymentsByPolicy(params.id);
  const supabase = await getServerClient();
  const { data: policy } = await supabase
    .from('policies')
    .select('customer_id')
    .eq('id', params.id)
    .maybeSingle();
  const customerId = policy?.customer_id as string | undefined;
  const balance = customerId ? await getCustomerBalance(customerId) : null;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <Link href={`/dashboard/agency/policies/${params.id}`} className="underline">
          Back to Policy
        </Link>
      </div>

      <form
        action={async (fd) => {
          'use server';
          await createPaymentAction(params.id, fd);
        }}
        className="space-y-3 rounded border p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Amount</label>
            <input name="amount" type="number" step="0.01" min="0.01" required className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Method</label>
            <select name="method" className="w-full rounded border px-3 py-2">
              <option value="TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Reference</label>
            <input name="reference" className="w-full rounded border px-3 py-2" placeholder="optional" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Paid At</label>
            <input name="paid_at" type="datetime-local" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Notes</label>
            <textarea name="notes" className="w-full rounded border px-3 py-2" rows={3} />
          </div>
        </div>
        <button className="rounded bg-black px-4 py-2 text-white">Add Payment</button>
      </form>

      <div className="rounded border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Paid At</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-left">Reference</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(payments.ok ? payments.data : []).map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{new Date(p.paid_at).toLocaleString()}</td>
                <td className="p-2">{Number(p.amount).toFixed(2)}</td>
                <td className="p-2">{p.method}</td>
                <td className="p-2">{p.reference || '-'}</td>
                <td className="p-2 space-x-2">
                  <form
                    action={async () => {
                      'use server';
                      await softDeletePaymentAction(p.id);
                    }}
                    className="inline"
                  >
                    <button className="text-xs underline">Soft delete</button>
                  </form>
                  <form
                    action={async () => {
                      'use server';
                      await restorePaymentAction(p.id);
                    }}
                    className="inline"
                  >
                    <button className="text-xs underline">Restore</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!payments.ok || (payments.data || []).length === 0) && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={5}>
                  No payments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {balance?.ok && (
        <div className="text-sm text-gray-600">Current points balance: {balance.points}</div>
      )}
    </div>
  );
}
