"use client";

import { useState, useTransition } from "react";
import { z } from "zod";

const VehicleSchema = z.object({
  plate_no: z.string().min(1, "Plate is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((v: string | undefined) => (v ? parseInt(v, 10) : undefined))
    .refine(
      (v: number | undefined) =>
        v == null ? true : Number.isInteger(v) && v >= 1900 && v <= 2100,
      {
        message: "Year must be 1900..2100",
      },
    ),
});

export function VehicleInlineForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(null);
        const parsed = VehicleSchema.safeParse({
          plate_no: fd.get("plate_no"),
          make: fd.get("make") ?? undefined,
          model: fd.get("model") ?? undefined,
          year: fd.get("year") ?? undefined,
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
      className="space-y-3"
    >
      {error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          name="plate_no"
          placeholder="Plate No"
          className="rounded border px-3 py-2 col-span-2"
          required
        />
        <input
          name="make"
          placeholder="Make"
          className="rounded border px-3 py-2"
        />
        <input
          name="model"
          placeholder="Model"
          className="rounded border px-3 py-2"
        />
        <input
          name="year"
          placeholder="Year"
          className="rounded border px-3 py-2"
        />
      </div>
      <button
        disabled={pending}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add Vehicle"}
      </button>
    </form>
  );
}
