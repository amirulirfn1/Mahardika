"use client";
import Link from "next/link";
import React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignUpPage() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    // eslint-disable-next-line no-console
    console.log("signup:", form);
  }

  return (
    <main>
      <Section className="pt-10">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
              />
              {errors.password ? (
                <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <div className="mt-4 text-sm text-neutral-600 dark:text-white/70">
            Already have an account? <Link className="underline" href="/signin">Sign in</Link>
          </div>
        </div>
      </Section>
    </main>
  );
}



