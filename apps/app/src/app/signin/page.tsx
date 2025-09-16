"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { supabase } from "@/lib/supabase/client";

const schema = z
  .object({
    method: z.enum(["email", "phone"]),
    email: z.string(),
    phone: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.method === "email") {
      const trimmedEmail = data.email.trim();
      if (!trimmedEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["email"], message: "Email is required" });
      } else if (!z.string().email().safeParse(trimmedEmail).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["email"], message: "Enter a valid email address" });
      }
    } else if (!data.phone.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "Phone number is required" });
    }
  });

const inputClasses =
  "mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ method: "email" as "email" | "phone", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setNotice(err);
  }, [searchParams]);

  useEffect(() => {
    setErrors({});
    setNotice(null);
  }, [form.method]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setNotice(null);
    const trimmedForm = {
      ...form,
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    setForm(trimmedForm);
    const parsed = schema.safeParse(trimmedForm);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      if (parsed.data.method === "email") {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email.trim(),
          password: parsed.data.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          phone: parsed.data.phone.trim(),
          password: parsed.data.password,
        });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setNotice(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithProvider(provider: "google" | "discord") {
    setLoading(true);
    setNotice(null);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const options: { redirectTo?: string; flowType?: "pkce" | "implicit" } = {
        redirectTo,
        flowType: "pkce",
      };
      const { error, data } = await supabase.auth.signInWithOAuth({ provider, options });
      if (error) throw error;
      if (data?.url) window.location.assign(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OAuth error";
      setNotice(msg);
      setLoading(false);
    }
  }

  return (
    <main>
      <Section>
        <div className="mx-auto w-full max-w-sm">
          <Card radius="marketing" intent="subtle">
            <CardContent density="marketing" className="space-y-6">
              <div className="text-left space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>
              </div>
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => signInWithProvider("google")}
                  disabled={loading}
                >
                  <span aria-hidden>🔐</span> Sign in with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => signInWithProvider("discord")}
                  disabled={loading}
                >
                  <span aria-hidden>💬</span> Sign in with Discord
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" aria-hidden />
                <span>or sign in with email</span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>
              <div className="flex gap-2 rounded-lg border border-border bg-muted/50 p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={form.method === "email" ? "primary" : "ghost"}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, method: "email" }))}
                  disabled={loading}
                >
                  Email
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={form.method === "phone" ? "primary" : "ghost"}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, method: "phone" }))}
                  disabled={loading}
                >
                  Phone
                </Button>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                {form.method === "email" ? (
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={inputClasses}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                    {errors.email ? (
                      <p id="email-error" className="text-xs text-destructive">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="e.g. +60123456789"
                      className={inputClasses}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      required
                    />
                    {errors.phone ? (
                      <p id="phone-error" className="text-xs text-destructive">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                )}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className={inputClasses}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    required
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <label className="inline-flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-border"
                        onChange={(e) => {
                          const el = document.getElementById("password") as HTMLInputElement | null;
                          if (el) el.type = e.target.checked ? "text" : "password";
                        }}
                      />
                      Show password
                    </label>
                    <a href="/signin?forgot=1" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  {errors.password ? (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                {notice ? <p className="text-sm text-destructive">{notice}</p> : null}
              </form>
              <p className="text-center text-xs text-muted-foreground">
                By continuing you agree to our <a href="/docs" className="underline">Terms</a> and <a href="/docs" className="underline">Privacy</a>.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account? <Link className="text-primary underline" href="/signup">Sign up</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}
