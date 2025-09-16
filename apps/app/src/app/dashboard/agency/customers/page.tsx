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
...
