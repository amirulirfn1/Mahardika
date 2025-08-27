import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { TableSimple } from "@/components/dashboard/TableSimple";
import { activity, users } from "@/lib/mock";

export default function DashboardOverviewPage() {
  return (
    <div className="container-default py-8">
      <PageHeader title="Overview" subtitle="Quick snapshot of your workspace" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active policies" value={128} change="+4 this week" />
        <StatCard label="Payments this month" value="$12,420" change="+12%" />
        <StatCard label="Net retention" value="97%" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="text-sm font-medium">Recent activity</div>
            <div className="mt-4">
              <TableSimple
                columns={[
                  { key: "desc", header: "Description" },
                  { key: "at", header: "When" },
                ]}
                rows={activity.map((a) => ({
                  desc: a.description,
                  at: new Date(a.timestamp).toLocaleString(),
                }))}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm font-medium">Top users</div>
            <div className="mt-4">
              <TableSimple
                columns={[
                  { key: "name", header: "Name" },
                  { key: "email", header: "Email" },
                ]}
                rows={users.map((u) => ({ name: u.name, email: u.email }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



