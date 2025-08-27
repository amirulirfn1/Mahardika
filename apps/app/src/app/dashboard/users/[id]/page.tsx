import { notFound } from "next/navigation";
import { users } from "@/lib/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = users.find((u) => u.id === params.id);
  if (!user) return notFound();
  return (
    <div className="container-default py-8">
      <PageHeader title={user.name} subtitle={user.email} />
      <Card>
        <CardContent>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Role</div>
          <div className="mt-1 text-lg">{user.role}</div>
        </CardContent>
      </Card>
    </div>
  );
}



