"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

import { registerOwnerAction } from "./_actions";

const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  agencyName: z.string().min(1, { message: "Agency name is required" }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const inputClasses =
  "mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    agencyName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const disabled = isPending;

  function handleChange<Key extends keyof typeof form>(key: Key, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const parsed = schema.safeParse(form);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }

    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return null;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    const parsed = validate();
    if (!parsed) {
      return;
    }

    startTransition(async () => {
      const result = await registerOwnerAction({
        fullName: parsed.fullName.trim(),
        agencyName: parsed.agencyName.trim(),
        email: parsed.email.trim().toLowerCase(),
        password: parsed.password,
      });

      if (!result.ok) {
        setNotice(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: parsed.email.trim().toLowerCase(),
        password: parsed.password,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        setNotice("Account created. Please sign in manually.");
        router.push("/signin");
        return;
      }

      router.push(signInResult?.url ?? "/dashboard");
    });
  }

  return (
    <main>
      <Section>
        <div className="mx-auto w-full max-w-sm">
          <Card radius="marketing" intent="subtle">
            <CardContent density="marketing" className="space-y-6">
              <header className="space-y-1 text-center">
                <h1 className="text-2xl font-semibold">Create your agency workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Start a new Mahardika tenant backed by Supabase. You will be the Owner of the agency.
                </p>
              </header>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="full_name" className="text-sm font-medium text-muted-foreground">
                    Your name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    autoComplete="name"
                    className={inputClasses}
                    value={form.fullName}
                    onChange={(event) => handleChange("fullName", event.currentTarget.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "full-name-error" : undefined}
                    required
                    disabled={disabled}
                  />
                  {errors.fullName ? (
                    <p id="full-name-error" className="text-xs text-destructive">
                      {errors.fullName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <label htmlFor="agency_name" className="text-sm font-medium text-muted-foreground">
                    Agency name
                  </label>
                  <input
                    id="agency_name"
                    name="agency_name"
                    autoComplete="organization"
                    className={inputClasses}
                    value={form.agencyName}
                    onChange={(event) => handleChange("agencyName", event.currentTarget.value)}
                    aria-invalid={Boolean(errors.agencyName)}
                    aria-describedby={errors.agencyName ? "agency-name-error" : undefined}
                    required
                    disabled={disabled}
                  />
                  {errors.agencyName ? (
                    <p id="agency-name-error" className="text-xs text-destructive">
                      {errors.agencyName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClasses}
                    value={form.email}
                    onChange={(event) => handleChange("email", event.currentTarget.value)}
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
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={inputClasses}
                    value={form.password}
                    onChange={(event) => handleChange("password", event.currentTarget.value)}
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
                  {disabled ? "Creating..." : "Create agency"}
                </Button>
                {notice ? <p className="text-sm text-destructive">{notice}</p> : null}
              </form>
              <p className="text-center text-xs text-muted-foreground">
                By creating an account you agree to the Mahardika Terms and Privacy Policy.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Already have an agency? <Link className="text-primary underline" href="/signin">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}