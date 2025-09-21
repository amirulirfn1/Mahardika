"use client";

import { useState, useTransition } from "react";
import { z } from "zod";

const CustomerSchema = z.object({
  full_name: z.string().min(2, "Name too short"),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v: string | undefined) => (v && v.length > 0 ? v : undefined)),
  phone: z.string().optional(),
  national_id: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  notes: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

export function CustomerForm({
  onSubmit,
  initial,
  submitLabel = "Save",
}: {
  onSubmit: (data: FormData) => Promise<{ ok: boolean; error?: string; id?: string }>;
  initial?: {
    full_name?: string;
    email?: string | null;
    phone?: string | null;
    national_id?: string | null;
    notes?: string | null;
  };
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        const parsed = CustomerSchema.safeParse({
          full_name: fd.get('full_name'),
          email: fd.get('email') ?? undefined,
          phone: fd.get('phone') ?? undefined,
          national_id: fd.get('national_id') ?? undefined,
          notes: fd.get('notes') ?? undefined,
        });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message ?? 'Invalid form');
          return;
        }
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) setError(res.error || 'Failed');
        });
      }}
      className="space-y-4"
    >
      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm">Full name</label>
        <input
          name="full_name"
          defaultValue={initial?.full_name ?? ''}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input
          name="email"
          defaultValue={initial?.email ?? ''}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Phone</label>
        <input
          name="phone"
          defaultValue={initial?.phone ?? ''}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">National ID</label>
        <input
          name="national_id"
          defaultValue={initial?.national_id ?? ''}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Notes</label>
        <textarea
          name="notes"
          defaultValue={initial?.notes ?? ''}
          className="w-full rounded border px-3 py-2"
          rows={3}
        />
      </div>
      <button
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
