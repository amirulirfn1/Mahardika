import Link from "next/link";
import { listPaymentsByPolicy } from "@/src/lib/payments";
import { createPaymentAction } from "./_actions";

export const revalidate = 0;

export default async function PolicyPaymentsPage({ params }: { params: { id: string } }) {
  const payments = await listPaymentsByPolicy(params.id);
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <Link href={`/dashboard/agency/policies/${params.id}`} className="underline">Back to Policy</Link>
      </div>

      <form action={async (fd) => {
        'use server';
        await createPaymentAction(params.id, fd);
      }} className="space-y-3 rounded border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input name="amount" type="number" step="0.01" min="0.01" required className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Channel</label>
            <select name="channel" className="w-full rounded border px-3 py-2">
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="ewallet">eWallet</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Reference</label>
            <input name="reference" className="w-full rounded border px-3 py-2" placeholder="optional" />
          </div>
          <div>
            <label className="block text-sm mb-1">Paid At</label>
            <input name="paid_at" type="datetime-local" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Notes</label>
            <textarea name="notes" className="w-full rounded border px-3 py-2" rows={3} />
          </div>
        </div>
        <button className="rounded bg-black text-white px-4 py-2">Add Payment</button>
      </form>

      <div className="rounded border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-2">Paid At</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Channel</th>
              <th className="text-left p-2">Reference</th>
            </tr>
          </thead>
          <tbody>
            {(payments.ok ? payments.data : []).map((p: { id: string; amount: number; channel: string; reference?: string | null; paid_at: string }) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{new Date(p.paid_at).toLocaleString()}</td>
                <td className="p-2">{Number(p.amount).toFixed(2)}</td>
                <td className="p-2">{p.channel}</td>
                <td className="p-2">{p.reference || '-'}</td>
              </tr>
            ))}
            {(!payments.ok || (payments.data || []).length === 0) && (
              <tr><td className="p-3 text-center text-gray-500" colSpan={4}>No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


