"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const inputClasses =
  "mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.7-1.6 2.7-3.9 2.7-6.7 0-.6-.1-1.2-.2-1.8H12z" />
      <path fill="#34A853" d="M6.5 13.9l-.9.7-2.4 1.9C4.8 19.5 8.2 21.5 12 21.5c2.4 0 4.4-.8 5.9-2.2l-3-2.3c-.8.5-1.8.8-2.9.8-2.2 0-4.1-1.5-4.8-3.6z" />
      <path fill="#4A90E2" d="M3.2 7.5C2.4 8.9 2 10.4 2 12c0 1.6.4 3.1 1.2 4.5l3.3-2.6c-.2-.5-.3-1-.3-1.9 0-.8.2-1.4.3-1.9z" />
      <path fill="#FBBC05" d="M12 6.5c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 3.6 14.4 2.5 12 2.5c-3.8 0-7.2 2-9.1 5l3.4 2.6c.7-2.1 2.6-3.6 4.8-3.6z" />
    </svg>
  );
}

export interface SignInFormProps {
  googleEnabled: boolean;
}

export function SignInForm({ googleEnabled }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("next") || searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const supabase = getBrowserClient();
  const authDisabled = !supabase;

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(authDisabled ? "Authentication is temporarily unavailable." : null);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setNotice(errorParam);
    }
  }, [errorParam]);

  const disabled = submitting || oauthLoading || authDisabled;

  async function handleGoogleSignIn() {
    if (!googleEnabled || !supabase) {
      return;
    }

    setNotice(null);
    setErrors({});
    setOauthLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      setNotice("Redirecting to Google sign-in failed. Please try again.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setNotice(message);
    } finally {
      setOauthLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setNotice(null);

    if (!supabase) {
      setNotice("Authentication is temporarily unavailable.");
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
      });

      if (error) {
        throw error;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in";
      setNotice(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Section>
        <div className="mx-auto w-full max-w-sm">
          <Card radius="marketing" intent="subtle">
            <CardContent density="marketing" className="space-y-6">
              <header className="space-y-1 text-center">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in with your Mahardika credentials.</p>
              </header>

              {googleEnabled && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    className="w-full justify-center gap-3 bg-gradient-to-r from-[#1a73e8] via-[#4285f4] to-[#0c47b7] text-sm font-medium text-white shadow-lg shadow-[#1a73e8]/40 transition hover:from-[#1558c1] hover:via-[#366de5] hover:to-[#0a3ba1]"
                    onClick={handleGoogleSignIn}
                    disabled={disabled}
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Continue with Google
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Secure login powered by Supabase Auth.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" aria-hidden />
                    <span>or continue with email</span>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={inputClasses}
                    value={values.email}
                    onChange={(event) => setValues((prev) => ({ ...prev, email: event.currentTarget.value }))}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    required
                    disabled={disabled}
                  />
                  {errors.email ? (
                    <p id="email-error" className="text-xs text-destructive">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={inputClasses}
                    value={values.password}
                    onChange={(event) => setValues((prev) => ({ ...prev, password: event.currentTarget.value }))}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    required
                    disabled={disabled}
                  />
                  {errors.password ? (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={disabled}>
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>
                {notice ? <p className="text-sm text-destructive">{notice}</p> : null}
              </form>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account? <Link className="text-primary underline" href="/signup">Create one</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}