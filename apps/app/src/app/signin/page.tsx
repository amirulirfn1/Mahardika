"use client";
import React from "react";
import { z } from "zod";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
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
    console.log("signin:", form);
  }

  return (
    <main>
      <Section className="pt-10">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
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
                className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
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
            <button type="submit" className="inline-flex h-10 items-center rounded-md bg-neutral-900 px-4 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 w-full">Sign in</button>
          </form>
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
            Don’t have an account? <Link className="underline" href="/signup">Sign up</Link>
          </div>
        </div>
      </Section>
    </main>
  );
}



