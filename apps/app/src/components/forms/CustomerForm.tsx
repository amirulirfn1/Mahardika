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
});

export function CustomerForm({
  onSubmit,
  initial,
  submitLabel = "Save",
}: {
  onSubmit: (
    data: FormData,
  ) => Promise<{ ok: boolean; error?: string; id?: string }>;
  initial?: {
    full_name?: string;
    email?: string | null;
    phone?: string | null;
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
          full_name: fd.get("full_name"),
          email: fd.get("email") ?? undefined,
          phone: fd.get("phone") ?? undefined,
        });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message ?? "Invalid form");
          return;
        }
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) setError(res.error || "Failed");
        });
      }}
      className="space-y-4"
    >
      {error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm mb-1">Full name</label>
        <input
          name="full_name"
          defaultValue={initial?.full_name ?? ""}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          name="email"
          defaultValue={initial?.email ?? ""}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Phone</label>
        <input
          name="phone"
          defaultValue={initial?.phone ?? ""}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <button
        disabled={pending}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
