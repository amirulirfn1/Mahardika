"use client";
import Link from "next/link";
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

type FormState = { method: "email" | "phone"; email: string; phone: string; password: string };

export default function SignUpPage() {
  const [form, setForm] = useState<FormState>({ method: "email", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setErrors({});
    setNotice(null);
  }, [form.method]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setNotice(null);
    const trimmedForm: FormState = {
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
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email.trim(),
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
        });
        if (error) throw error;
        setNotice("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signUp({ phone: parsed.data.phone.trim(), password: parsed.data.password });
        if (error) throw error;
        setNotice("We sent an SMS OTP. Verify to complete sign up.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setNotice(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithProvider(provider: "google" | "discord") {
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
              <div className="space-y-2 text-left">
                <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                <p className="text-sm text-muted-foreground">Start managing policies, payments, and more.</p>
              </div>
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => signUpWithProvider("google")}
                  disabled={loading}
                >
                  <span aria-hidden>🔐</span> Sign up with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => signUpWithProvider("discord")}
                  disabled={loading}
                >
                  <span aria-hidden>💬</span> Sign up with Discord
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" aria-hidden />
                <span>or continue with email</span>
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
                    autoComplete="new-password"
                    className={inputClasses}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    required
                  />
                  {errors.password ? (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create account"}
                </Button>
                {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}
              </form>
              <p className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our <a href="/docs" className="underline">Terms</a> and <a href="/docs" className="underline">Privacy</a>.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link className="text-primary underline" href="/signin">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}
