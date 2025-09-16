import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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
      <Section>
        <div className="mx-auto w-full max-w-xl">
          <Card radius="marketing" intent="subtle">
            <CardContent density="marketing" className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Finish setting up your account</h1>
              <p className="text-sm text-muted-foreground">
                We could not find a profile connected to {email ? <span className="font-medium text-foreground">{email}</span> : "your account"}. Once we have a few more details we will create your workspace and send you straight to the dashboard.
              </p>
              <p className="text-sm text-muted-foreground">
                Reach out to your administrator or drop us a message and we will help you complete onboarding in just a moment.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full">Contact support</Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    Return home
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                We will redirect you automatically once your profile has been created.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}
