import Link from "next/link";

import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

async function listMessages() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('conversations')
    .select('id, created_at, channel, direction, body, customer:customers(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

export default async function CommunicationsPage() {
  const rows = await listMessages();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Communications</h1>
        <Link href="/dashboard/agency" className="underline">Back</Link>
      </div>
      <div className="rounded border overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>When</TH>
              <TH>Channel</TH>
              <TH>Direction</TH>
              <TH>Customer</TH>
              <TH>Body</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => {
              const customer = Array.isArray(r.customer) ? r.customer[0] : r.customer;
              return (
                <TR key={r.id}>
                  <TD>{new Date(r.created_at as string).toLocaleString()}</TD>
                  <TD>{r.channel}</TD>
                  <TD>{r.direction}</TD>
                  <TD>{customer?.full_name ?? '-'}</TD>
                  <TD className="max-w-[400px] truncate" title={r.body || ''}>{r.body ?? '-'}</TD>
                </TR>
              );
            })}
            {rows.length === 0 && (
              <TR>
                <TD colSpan={5}>No communications yet</TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
