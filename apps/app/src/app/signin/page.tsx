"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  method: z.enum(["email", "phone"]).default("email"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = React.useState<{ method: "email" | "phone"; email?: string; phone?: string; password: string }>({ method: "email", email: "", phone: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setNotice(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      if (form.method === "email") {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email!, password: form.password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ phone: form.phone!, password: form.password });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setNotice(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithProvider(provider: "google" | "discord") {
    setLoading(true);
    setNotice(null);
    try {
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error, data } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
      if (data?.url) window.location.assign(data.url);
    } catch (err: any) {
      setNotice(err?.message || "OAuth error");
      setLoading(false);
    }
  }

  return (
    <main>
      <Section className="pt-10">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <div className="mt-6 grid gap-2">
            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => signInWithProvider("google")} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.91 29.197 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.84 1.156 7.961 3.039l5.657-5.657C33.64 6.053 29.084 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.655 16.108 18.961 12 24 12c3.059 0 5.84 1.156 7.961 3.039l5.657-5.657C33.64 6.053 29.084 4 24 4c-7.798 0-14.426 4.438-17.694 10.691z"/><path fill="#4CAF50" d="M24 44c5.126 0 9.64-1.969 13.152-5.183l-6.062-4.992C29.028 35.875 26.651 36 24 36c-5.176 0-9.57-3.132-11.61-7.83l-6.535 5.036C8.088 39.668 15.37 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.023 3.033-3.26 5.453-6.211 6.825l.005-.003 6.062 4.992C34.87 41.871 44 36 44 24c0-1.341-.138-2.651-.389-3.917z"/></svg>
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => signInWithProvider("discord")} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.317 4.369A19.91 19.91 0 0 0 16.558 3c-.2.36-.43.846-.589 1.23a18.27 18.27 0 0 0-7.938 0A12.26 12.26 0 0 0 7.442 3a19.9 19.9 0 0 0-3.758 1.369C1.18 8.273.59 12.086.873 15.865a19.99 19.99 0 0 0 6.058 3.068c.466-.638.879-1.312 1.229-2.02c-.679-.258-1.33-.57-1.949-.933c.163-.12.323-.244.479-.371a13.9 13.9 0 0 0 10.62 0c.156.127.316.251.479.371c-.62.363-1.27.675-1.949.933c.35.708.763 1.382 1.229 2.02a19.99 19.99 0 0 0 6.058-3.068c.318-3.989-.546-7.767-2.751-11.496ZM9.862 14.59c-1.037 0-1.89-.95-1.89-2.117s.835-2.117 1.89-2.117c1.063 0 1.908.954 1.89 2.117c0 1.167-.835 2.117-1.89 2.117m4.276 0c-1.036 0-1.89-.95-1.89-2.117s.835-2.117 1.89-2.117c1.063 0 1.908.954 1.89 2.117c0 1.167-.827 2.117-1.89 2.117"/></svg>
              Continue with Discord
            </Button>
          </div>
          <div className="my-6 text-center text-sm text-neutral-500">or</div>
          <form onSubmit={onSubmit} className="mt-2 space-y-4">
            <div className="flex gap-2 text-sm">
              <button type="button" className={`rounded-md px-3 py-1 ${form.method === "email" ? "bg-neutral-200 dark:bg-white/10" : "bg-transparent"}`} onClick={() => setForm((f) => ({ ...f, method: "email" }))}>Email</button>
              <button type="button" className={`rounded-md px-3 py-1 ${form.method === "phone" ? "bg-neutral-200 dark:bg-white/10" : "bg-transparent"}`} onClick={() => setForm((f) => ({ ...f, method: "phone" }))}>Phone</button>
            </div>
            {form.method === "email" ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input id="email" type="email" name="email" autoComplete="email" className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} required />
                {errors.email ? (<p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>) : null}
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                <input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="e.g. +60123456789" className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} required />
                {errors.phone ? (<p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>) : null}
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input id="password" type="password" name="password" autoComplete="current-password" className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} required />
              {errors.password ? (<p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>) : null}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            {notice ? (<p className="text-sm text-red-600">{notice}</p>) : null}
          </form>
          <div className="mt-4 text-sm text-neutral-600 dark:text-white/70">
            Don’t have an account? <Link className="underline" href="/signup">Sign up</Link>
          </div>
        </div>
      </Section>
    </main>
  );
}

