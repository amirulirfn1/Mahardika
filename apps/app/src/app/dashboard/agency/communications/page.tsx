import Link from "next/link";

import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";

export const revalidate = 0;

async function listMessages() {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("outbound_messages")
    .select("id, channel, to_number, template, body, status, error, created_at")
    .order("created_at", { ascending: false })
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
              <TH>To</TH>
              <TH>Status</TH>
              <TH>Body</TH>
              <TH>Error</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD>{new Date(r.created_at as string).toLocaleString()}</TD>
                <TD>{r.channel}</TD>
                <TD>{r.to_number}</TD>
                <TD>{r.status}</TD>
                <TD className="max-w-[400px] truncate" title={r.body || ''}>{r.body}</TD>
                <TD className="max-w-[300px] truncate" title={r.error || ''}>{r.error}</TD>
              </TR>
            ))}
            {rows.length === 0 && (
              <TR>
                <TD colSpan={6}>No messages yet</TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
    </div>
  );
}


