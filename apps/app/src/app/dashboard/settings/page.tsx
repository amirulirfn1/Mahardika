"use client";
import { useState } from "react";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

export default function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "application">("profile");
  return (
    <div className="container-default py-8">
      <PageHeader title="Settings" />
      <div className="mb-6 flex items-center gap-2 text-sm">
        <button
          className={`px-3 py-1 rounded-md border ${tab === "profile" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
          onClick={() => setTab("profile")}
          aria-pressed={tab === "profile"}
        >
          Profile
        </button>
        <button
          className={`px-3 py-1 rounded-md border ${tab === "application" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
          onClick={() => setTab("application")}
          aria-pressed={tab === "application"}
        >
          Application
        </button>
      </div>
      <Card>
        <CardContent>
          {tab === "profile" ? (
            <div className="space-y-4">
              <div className="text-sm font-medium">Profile</div>
              <div className="text-neutral-600 dark:text-neutral-300">Update your display name and contact info.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm font-medium">Application</div>
              <div className="text-neutral-600 dark:text-neutral-300">Manage workspace preferences and notifications.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



