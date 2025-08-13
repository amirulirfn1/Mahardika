import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getServerClient } from "@/lib/supabase/server";
import { listPaymentsByPolicy } from "@/src/lib/payments";
import { getPolicyPdfUrl } from "@/src/lib/storage";
import { softDeletePolicy, restorePolicy } from "@/src/lib/policies";

type PolicyDetail = {
  id: string;
  policy_no: string;
  start_date: string;
  end_date: string;
  premium_myr: number;
  status?: string | null;
  pdf_path?: string | null;
  customer?: { full_name: string } | { full_name: string }[] | null;
  vehicle?: { plate_no: string } | { plate_no: string }[] | null;
};

async function fetchPolicy(id: string): Promise<PolicyDetail | null> {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("policies")
    .select("id, policy_no, start_date, end_date, premium_myr, status, pdf_path, customer:customers(full_name), vehicle:vehicles(plate_no)")
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as PolicyDetail) ?? null;
}

export default async function PolicyDetailPage({ params }: { params: { id: string } }) {
  const policy = await fetchPolicy(params.id);
  if (!policy) return <div className="p-6">Policy not found</div>;
  const supabase = getServerClient();
  const signed = policy.pdf_path ? await getPolicyPdfUrl({ supabase, path: policy.pdf_path }) : null;
  const signedUrl = signed && signed.ok ? signed.url : null;
  const payments = await listPaymentsByPolicy(params.id);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-gray-600 text-sm">Customer</div>
          <div>
            {Array.isArray(policy.customer)
              ? policy.customer[0]?.full_name ?? "-"
              : policy.customer?.full_name ?? "-"}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Vehicle</div>
          <div>
            {Array.isArray(policy.vehicle)
              ? policy.vehicle[0]?.plate_no ?? "-"
              : policy.vehicle?.plate_no ?? "-"}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Start</div>
          <div>{policy.start_date}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">End</div>
          <div>{policy.end_date}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Premium (MYR)</div>
          <div>{policy.premium_myr}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Status</div>
          <div>{policy.status ?? "active"}</div>
        </div>
      </div>

      {policy.pdf_path ? (
        signedUrl ? (
          <a href={signedUrl} target="_blank" rel="noopener noreferrer">
            <Button type="button">Open PDF (signed URL)</Button>
          </a>
        ) : (
          <div className="text-sm text-gray-600">Unable to generate signed URL</div>
        )
      ) : (
        <div className="text-sm text-gray-600">No PDF uploaded</div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Payments</h2>
          <Link href={`/dashboard/agency/policies/${policy.id}/payments`} className="underline">Manage</Link>
        </div>
        <div className="rounded border overflow-hidden">
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
              {(payments.ok ? payments.data : []).slice(0, 5).map((p: { id: string; amount: number; channel: string; reference?: string | null; paid_at: string }) => (
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

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Danger zone</h2>
        <form
          action={async () => {
            "use server";
            await softDeletePolicy(policy.id);
          }}
        >
          <button className="rounded bg-red-600 text-white px-4 py-2">Soft delete policy</button>
        </form>
        <form
          action={async () => {
            "use server";
            await restorePolicy(policy.id);
          }}
        >
          <button className="rounded border px-4 py-2">Restore policy</button>
        </form>
      </div>
    </div>
  );
}


