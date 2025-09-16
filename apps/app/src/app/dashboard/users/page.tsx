import Link from "next/link";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSimple } from "@/components/dashboard/TableSimple";
import { Section } from "@/components/ui/Section";
import { users } from "@/lib/mock";

export default function UsersListPage() {
  return (
    <Section variant="app">
      <PageHeader title="Users" variant="spotlight" subtitle="All workspace members" />
      <TableSimple
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "action", header: "" },
        ]}
        rows={users.map((user) => ({
          name: user.name,
          email: user.email,
          role: user.role,
          action: (
            <Link className="text-sm text-primary underline" href={`/dashboard/users/${user.id}`}>
              View
            </Link>
          ),
        }))}
      />
    </Section>
  );
}
