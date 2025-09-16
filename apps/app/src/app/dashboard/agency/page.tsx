import Link from "next/link";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getProfile } from "@/lib/auth";
import { getCounts, getRecentPolicies } from "@/lib/kpis";

export default async function AgencyDashboardPage() {
  const profile = await getProfile();
  const agencyId = profile?.agency_id ?? null;
  const [counts, recent] = await Promise.all([getCounts(agencyId), getRecentPolicies(agencyId, 5)]);

  return (
    <Section variant="app">
      <PageHeader title="Agency" variant="spotlight" subtitle="Key metrics for your workspace" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Customers", value: counts.customers },
          { label: "Policies", value: counts.policies },
          { label: "Payments", value: counts.payments },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
              <div className="text-2xl font-semibold text-foreground">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="space-y-4">
          <div className="text-sm font-medium text-foreground">Recent policies</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/80 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2 pr-4 text-left">Policy</th>
                  <th className="py-2 pr-4 text-left">Customer</th>
                  <th className="py-2 pr-4 text-left">End date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((policy) => (
                  <tr key={policy.policy_no} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="py-2 pr-4">{policy.policy_no}</td>
                    <td className="py-2 pr-4">{policy.customer_name ?? "-"}</td>
                    <td className="py-2 pr-4">{policy.end_date}</td>
                  </tr>
                ))}
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-sm text-muted-foreground">
                      No recent policies
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/agency/policies"
          className="rounded-xl border border-border bg-card p-4 text-sm text-foreground shadow-card transition hover:border-primary/60 hover:text-primary"
        >
          <div className="font-medium">Policies</div>
          <div className="text-sm text-muted-foreground">Manage policies and PDFs</div>
        </Link>
        <Link
          href="/dashboard/agency/loyalty"
          className="rounded-xl border border-border bg-card p-4 text-sm text-foreground shadow-card transition hover:border-primary/60 hover:text-primary"
        >
          <div className="font-medium">Loyalty</div>
          <div className="text-sm text-muted-foreground">Configure tiers and rewards</div>
        </Link>
        <Link
          href="/dashboard/agency/communications"
          className="rounded-xl border border-border bg-card p-4 text-sm text-foreground shadow-card transition hover:border-primary/60 hover:text-primary"
        >
          <div className="font-medium">Communications</div>
          <div className="text-sm text-muted-foreground">Review outbound messages</div>
        </Link>
      </div>
    </Section>
  );
}
