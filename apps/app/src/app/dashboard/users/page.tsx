import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSimple } from "@/components/dashboard/TableSimple";
import { users } from "@/lib/mock";

export default function UsersListPage() {
  return (
    <div className="container-default py-8">
      <PageHeader title="Users" />
      <TableSimple
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "action", header: "" },
        ]}
        rows={users.map((u) => ({
          name: u.name,
          email: u.email,
          role: u.role,
          action: (
            <Link className="underline" href={`/dashboard/users/${u.id}`}>
              View
            </Link>
          ),
        }))}
      />
    </div>
  );
}



