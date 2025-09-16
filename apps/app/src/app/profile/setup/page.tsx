import Link from "next/link";
import { redirect } from "next/navigation";

import { Section } from "@/components/ui/Section";
import { getProfile, getSession } from "@/lib/auth";

export default async function ProfileSetupPage() {
  const profile = await getProfile();
  if (profile) redirect("/dashboard");

  const session = await getSession();
  if (!session) redirect("/signin");

  const email = session.user.email;

  return (
    <main>
      <Section className="pt-16 pb-24">
        <div
          className="mx-auto w-full max-w-xl card p-8 text-center space-y-4 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <h1 className="text-2xl font-semibold tracking-tight">Finish setting up your account</h1>
          <p className="text-sm text-neutral-600 dark:text-white/70">
            We couldn&apos;t find a profile connected to
            {" "}
            {email ? <span className="font-medium text-neutral-900 dark:text-white">{email}</span> : "your account"}. Once we
            have a few more details we&apos;ll create your workspace and send you straight to the dashboard.
          </p>
          <p className="text-sm text-neutral-600 dark:text-white/70">
            Reach out to your administrator or drop us a message and we&apos;ll help you complete onboarding in just a moment.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
            >
              Contact support
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium ring-1 ring-neutral-300 text-neutral-900 hover:bg-[hsl(var(--accent))]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:ring-white/10 dark:hover:bg-[hsl(var(--accent))]/20 dark:focus-visible:ring-offset-neutral-950"
            >
              Return home
            </Link>
          </div>
          <p className="text-xs text-neutral-500 dark:text-white/60">
            We&apos;ll redirect you automatically once your profile has been created.
          </p>
        </div>
      </Section>
    </main>
  );
}
