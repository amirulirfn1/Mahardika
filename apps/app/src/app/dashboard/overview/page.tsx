import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableSimple } from "@/components/dashboard/TableSimple";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { activity, users } from "@/lib/mock";

export default function DashboardOverviewPage() {
  return (
    <Section variant="app">
      <PageHeader
        title="Overview"
        subtitle="Quick snapshot of your workspace"
        variant="spotlight"
      />
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Active policies" value="128" change="+4 this week" />
        <StatCard label="Payments this month" value="$12,420" change="+12%" />
        <StatCard label="Net retention" value="97%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <div className="text-sm font-medium text-foreground">Recent activity</div>
            <TableSimple
              columns={[
                { key: "desc", header: "Description" },
                { key: "at", header: "When" },
              ]}
              rows={activity.map((item) => ({
                desc: item.description,
                at: new Date(item.timestamp).toLocaleString(),
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <div className="text-sm font-medium text-foreground">Top users</div>
            <TableSimple
              columns={[
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
              ]}
              rows={users.map((user) => ({ name: user.name, email: user.email }))}
            />
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
