import { revalidatePath } from "next/cache";
import Link from "next/link";

import { ConfirmAction } from "@/components/ConfirmAction";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";

import { deleteCustomer } from "./_actions";

export const revalidate = 0;

function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const page = Math.max(1, parseInt((searchParams.page as string) || "1", 10));
  const pageSize = Math.max(1, parseInt((searchParams.pageSize as string) || "10", 10));
  return { q, page, pageSize };
}

export default async function CustomersListPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { q, page, pageSize } = parseSearchParams(searchParams);
  const supabase = getServerClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("customers")
    .select("id, full_name, email, phone, vehicles(id)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data, count } = await query.range(from, to);

  async function onDelete(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await deleteCustomer(id);
    revalidatePath("/dashboard/agency/customers");
  }

  return (
    <Section variant="app">
      <PageHeader
        title="Customers"
        subtitle="Manage customer records and vehicles"
        variant="spotlight"
        actions={
          <Link href="/dashboard/agency/customers/new">
            <Button size="sm">New customer</Button>
          </Link>
        }
      />
      <form className="flex flex-col gap-2 sm:flex-row" action="">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        />
        <Button type="submit" variant="outline" className="sm:w-auto">
          Search
        </Button>
      </form>
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Email</TH>
                  <TH>Phone</TH>
                  <TH>Vehicles (#)</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {(data || []).map((customer: { id: string; full_name: string; email?: string | null; phone?: string | null; vehicles?: { id: string }[] }) => (
                  <TR key={customer.id}>
                    <TD>{customer.full_name}</TD>
                    <TD>{customer.email ?? "-"}</TD>
                    <TD>{customer.phone ?? "-"}</TD>
                    <TD>{Array.isArray(customer.vehicles) ? customer.vehicles.length : 0}</TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Link className="text-sm text-primary underline" href={`/dashboard/agency/customers/${customer.id}`}>
                          View
                        </Link>
                        <Link className="text-sm text-primary underline" href={`/dashboard/agency/customers/${customer.id}/edit`}>
                          Edit
                        </Link>
                        <ConfirmAction action={onDelete} confirmMessage="Delete this customer? This cannot be undone.">
                          <input type="hidden" name="id" value={customer.id} />
                          <Button variant="ghost" type="submit" className="px-2 text-destructive">
                            Delete
                          </Button>
                        </ConfirmAction>
                      </div>
                    </TD>
                  </TR>
                ))}
                {(!data || data.length === 0) && (
                  <TR>
                    <TD colSpan={5}>
                      <div className="py-6 text-center text-sm text-muted-foreground">No customers</div>
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
        <div>Showing {data?.length ?? 0} of {count ?? 0}</div>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={`?q=${encodeURIComponent(q)}&page=${page - 1}&pageSize=${pageSize}`} className="underline">
              Prev
            </Link>
          ) : null}
          {(count ?? 0) > page * pageSize ? (
            <Link href={`?q=${encodeURIComponent(q)}&page=${page + 1}&pageSize=${pageSize}`} className="underline">
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
