"use client";
import { useState } from "react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export default function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "application">("profile");
  return (
    <Section variant="app">
      <PageHeader title="Settings" variant="spotlight" subtitle="Manage your profile and workspace preferences" />
      <div className="mb-6 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={tab === "profile" ? "primary" : "outline"}
          onClick={() => setTab("profile")}
          aria-pressed={tab === "profile"}
        >
          Profile
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === "application" ? "primary" : "outline"}
          onClick={() => setTab("application")}
          aria-pressed={tab === "application"}
        >
          Application
        </Button>
      </div>
      <Card>
        <CardContent className="space-y-3">
          {tab === "profile" ? (
            <>
              <div className="text-sm font-medium text-foreground">Profile</div>
              <div className="text-sm text-muted-foreground">Update your display name and contact info.</div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-foreground">Application</div>
              <div className="text-sm text-muted-foreground">Manage workspace preferences and notifications.</div>
            </>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
