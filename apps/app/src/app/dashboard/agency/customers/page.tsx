import { revalidatePath } from "next/cache";
import Link from "next/link";

import { ConfirmAction } from "@/components/ConfirmAction";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";

import { deleteCustomer } from "./_actions";

export const revalidate = 0;

function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const page = Math.max(1, parseInt((searchParams.page as string) || "1", 10));
  const pageSize = Math.max(
    1,
    parseInt((searchParams.pageSize as string) || "10", 10),
  );
  return { q, page, pageSize };
}

export default async function CustomersListPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { q, page, pageSize } = parseSearchParams(searchParams);
  const supabase = getServerClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("customers")
    .select("id, full_name, email, phone, vehicles(id)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`,
    );
  }

  const { data, count } = await query.range(from, to);

  async function onDelete(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    await deleteCustomer(id);
    revalidatePath("/dashboard/agency/customers");
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link
          href="/dashboard/agency/customers/new"
          className="rounded bg-black text-white px-3 py-2 text-sm"
        >
          New Customer
        </Link>
      </div>
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone"
          className="rounded border px-3 py-2 w-full"
        />
        <button className="rounded border px-3 py-2">Search</button>
      </form>
      <div className="rounded border overflow-x-auto">
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
            {(data || []).map(
              (c: {
                id: string;
                full_name: string;
                email?: string | null;
                phone?: string | null;
                vehicles?: { id: string }[];
              }) => (
                <TR key={c.id}>
                  <TD>{c.full_name}</TD>
                  <TD>{c.email ?? "-"}</TD>
                  <TD>{c.phone ?? "-"}</TD>
                  <TD>{Array.isArray(c.vehicles) ? c.vehicles.length : 0}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/agency/customers/${c.id}`}
                        className="underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/agency/customers/${c.id}/edit`}
                        className="underline"
                      >
                        Edit
                      </Link>
                      <ConfirmAction
                        action={onDelete}
                        confirmMessage="Delete this customer? This cannot be undone."
                      >
                        <input type="hidden" name="id" value={c.id} />
                        <Button variant="ghost" className="px-2">
                          Delete
                        </Button>
                      </ConfirmAction>
                    </div>
                  </TD>
                </TR>
              ),
            )}
            {(!data || data.length === 0) && (
              <TR>
                <TD colSpan={5}>
                  <div className="py-4 text-center text-gray-500">
                    No customers
                  </div>
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>
          Showing {data?.length ?? 0} of {count ?? 0}
        </div>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`?q=${encodeURIComponent(q)}&page=${page - 1}&pageSize=${pageSize}`}
              className="underline"
            >
              Prev
            </Link>
          )}
          {(count ?? 0) > page * pageSize && (
            <Link
              href={`?q=${encodeURIComponent(q)}&page=${page + 1}&pageSize=${pageSize}`}
              className="underline"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

