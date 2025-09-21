"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const inputClasses =
  "mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setNotice(null);

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
      const result = await signIn("credentials", {
        redirect: false,
        email: parsed.data.email.trim().toLowerCase(),
        password: parsed.data.password,
        callbackUrl,
      });

      if (result?.error) {
        setNotice(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        return;
      }

      if (result?.url) {
        router.push(result.url);
        return;
      }

      router.push(callbackUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
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
                  />
                  {errors.password ? (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
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