import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { users } from "@/lib/mock";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = users.find((item) => item.id === params.id);
  if (!user) return notFound();
  return (
    <Section variant="app">
      <PageHeader title={user.name} subtitle={user.email} variant="spotlight" />
      <Card>
        <CardContent className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">Role</div>
          <div className="text-lg text-foreground">{user.role}</div>
        </CardContent>
      </Card>
    </Section>
  );
}
