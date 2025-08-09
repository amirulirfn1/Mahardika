import Link from "next/link";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const page = Math.max(1, parseInt((searchParams.page as string) || "1", 10));
  const pageSize = 10;
  return { q, page, pageSize };
}

export default async function PoliciesListPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { q, page, pageSize } = parseSearchParams(searchParams);
  const supabase = getServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("policies")
    .select("id, policy_no, end_date, status, pdf_path, customer:customers(full_name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    // Simple OR across policy_no and customer name
    query = query.or(`policy_no.ilike.%${q}%,customers.full_name.ilike.%${q}%`);
  }

  const { data, count } = await query.range(from, to);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Policies</h1>
        <Link href="/dashboard/agency/policies/new" className="rounded bg-black text-white px-3 py-2 text-sm">
          New Policy
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search policy no or customer" className="rounded border px-3 py-2 w-full" />
        <button className="rounded border px-3 py-2">Search</button>
      </form>
      <div className="rounded border overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Policy No</TH>
              <TH>Customer</TH>
              <TH>End Date</TH>
              <TH>Status</TH>
              <TH>PDF</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {(data || []).map((p: { id: string; policy_no: string; end_date: string; status?: string | null; pdf_path?: string | null; customer?: { full_name: string } | { full_name: string }[] }) => (
              <TR key={p.id}>
                <TD>{p.policy_no}</TD>
                <TD>
                  {Array.isArray(p.customer) ? p.customer[0]?.full_name ?? "-" : p.customer?.full_name ?? "-"}
                </TD>
                <TD>{p.end_date}</TD>
                <TD>{p.status ?? "active"}</TD>
                <TD>{p.pdf_path ? "Yes" : "-"}</TD>
                <TD>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/agency/policies/${p.id}`} className="underline">View</Link>
                    <Link href={`/dashboard/agency/policies/${p.id}/edit`} className="underline">Edit</Link>
                  </div>
                </TD>
              </TR>
            ))}
            {(!data || data.length === 0) && (
              <TR>
                <TD colSpan={6}>
                  <div className="py-4 text-center text-gray-500">No policies</div>
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>Showing {data?.length ?? 0} of {count ?? 0}</div>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`?q=${encodeURIComponent(q)}&page=${page - 1}`} className="underline">Prev</Link>
          )}
          {(count ?? 0) > page * pageSize && (
            <Link href={`?q=${encodeURIComponent(q)}&page=${page + 1}`} className="underline">Next</Link>
          )}
        </div>
      </div>
    </div>
  );
}


