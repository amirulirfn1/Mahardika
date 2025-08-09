"use client";

import { useRef, useState, useTransition } from "react";
import { z } from "zod";

const Schema = z.object({
  policy_no: z.string().min(1, "Required"),
  start_date: z.string().min(1, "Required"),
  end_date: z.string().min(1, "Required"),
  premium_myr: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  customer_id: z.string().min(1, "Required"),
  vehicle_id: z.string().optional(),
});

type Option = { id: string; label: string };

export function PolicyForm({
  onSubmit,
  customers,
  vehicles,
  initial,
  submitLabel = "Save",
}: {
  onSubmit: (data: FormData) => Promise<{ ok: boolean; error?: string; id?: string }>;
  customers: Option[];
  vehicles: Option[];
  initial?: Partial<{ policy_no: string; start_date: string; end_date: string; premium_myr: number; customer_id: string; vehicle_id?: string | null }>;
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
          policy_no: fd.get("policy_no"),
          start_date: fd.get("start_date"),
          end_date: fd.get("end_date"),
          premium_myr: fd.get("premium_myr"),
          customer_id: fd.get("customer_id"),
          vehicle_id: fd.get("vehicle_id") ?? undefined,
        });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message ?? "Invalid form");
          return;
        }
        const file = fileRef.current?.files?.[0] ?? null;
        if (file) {
          const lower = file.name.toLowerCase();
          if (file.size > 5 * 1024 * 1024) {
            setError("File too large (max 5MB)");
            return;
          }
          if (!lower.endsWith(".pdf")) {
            setError("Only PDF allowed");
            return;
          }
        }
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) setError(res.error || "Failed");
        });
      }}
      className="space-y-4"
    >
      {error && <div className="rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Policy No</label>
          <input name="policy_no" defaultValue={initial?.policy_no ?? ""} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Premium (MYR)</label>
          <input name="premium_myr" type="number" step="0.01" defaultValue={initial?.premium_myr?.toString() ?? ""} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input name="start_date" type="date" defaultValue={initial?.start_date ?? ""} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input name="end_date" type="date" defaultValue={initial?.end_date ?? ""} className="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Customer</label>
          <select name="customer_id" defaultValue={initial?.customer_id ?? ""} className="w-full rounded border px-3 py-2" required>
            <option value="">Select...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Vehicle (optional)</label>
          <select name="vehicle_id" defaultValue={initial?.vehicle_id ?? ""} className="w-full rounded border px-3 py-2">
            <option value="">(none)</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Policy PDF</label>
          <input ref={fileRef} type="file" name="pdf" accept="application/pdf,.pdf" className="w-full rounded border px-3 py-2" />
        </div>
      </div>
      <button disabled={pending} className="rounded bg-black text-white px-4 py-2 disabled:opacity-50">
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}


