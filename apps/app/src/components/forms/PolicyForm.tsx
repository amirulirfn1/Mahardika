"use client";

import { useRef, useState, useTransition } from "react";
import { z } from "zod";

const Schema = z.object({
  policy_no: z.string().min(1, "Required"),
  carrier: z.string().min(1, "Required"),
  product: z.string().min(1, "Required"),
  status: z.string().min(1),
  start_date: z.string().min(1, "Required"),
  end_date: z.string().min(1, "Required"),
  premium_gross: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  premium_net: z
    .preprocess((v) => (v === undefined || v === null || v === "" ? null : typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative().nullable())
    .optional(),
  customer_id: z.string().min(1, "Required"),
  agent_id: z.string().optional(),
});

type Option = { id: string; label: string };

export function PolicyForm({
  onSubmit,
  customers,
  agents = [],
  initial,
  submitLabel = "Save",
}: {
  onSubmit: (data: FormData) => Promise<{ ok: boolean; error?: string; id?: string }>;
  customers: Option[];
  agents?: Option[];
  initial?: Partial<{
    policy_no: string;
    carrier: string;
    product: string;
    status: string;
    start_date: string;
    end_date: string;
    premium_gross: number;
    premium_net: number | null;
    customer_id: string;
    agent_id?: string | null;
  }>;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={(fd) => {
        setError(null);
        const parsed = Schema.safeParse({
          policy_no: fd.get('policy_no'),
          carrier: fd.get('carrier'),
          product: fd.get('product'),
          status: fd.get('status') ?? undefined,
          start_date: fd.get('start_date'),
          end_date: fd.get('end_date'),
          premium_gross: fd.get('premium_gross'),
          premium_net: fd.get('premium_net'),
          customer_id: fd.get('customer_id'),
          agent_id: fd.get('agent_id') ?? undefined,
        });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message ?? 'Invalid form');
          return;
        }
        const file = fileRef.current?.files?.[0] ?? null;
        if (file) {
          const lower = file.name.toLowerCase();
          if (file.size > 5 * 1024 * 1024) {
            setError('File too large (max 5MB)');
            return;
          }
          if (!lower.endsWith('.pdf')) {
            setError('Only PDF allowed');
            return;
          }
        }
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) setError(res.error || 'Failed');
        });
      }}
      className="space-y-4"
    >
      {error && <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Policy No</label>
          <input name="policy_no" defaultValue={initial?.policy_no ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Carrier</label>
          <input name="carrier" defaultValue={initial?.carrier ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Product</label>
          <input name="product" defaultValue={initial?.product ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select name="status" defaultValue={initial?.status ?? 'QUOTE'} className="w-full rounded border px-3 py-2">
            <option value="QUOTE">Quote</option>
            <option value="IN_FORCE">In force</option>
            <option value="LAPSED">Lapsed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Start Date</label>
          <input name="start_date" type="date" defaultValue={initial?.start_date ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">End Date</label>
          <input name="end_date" type="date" defaultValue={initial?.end_date ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Premium Gross</label>
          <input name="premium_gross" type="number" step="0.01" defaultValue={initial?.premium_gross?.toString() ?? ''} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Premium Net</label>
          <input name="premium_net" type="number" step="0.01" defaultValue={initial?.premium_net?.toString() ?? ''} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Customer</label>
          <select name="customer_id" defaultValue={initial?.customer_id ?? ''} className="w-full rounded border px-3 py-2" required>
            <option value="">Select...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Agent (optional)</label>
          <select name="agent_id" defaultValue={initial?.agent_id ?? ''} className="w-full rounded border px-3 py-2">
            <option value="">Unassigned</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Policy PDF</label>
          <input ref={fileRef} type="file" name="pdf" accept="application/pdf,.pdf" className="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
