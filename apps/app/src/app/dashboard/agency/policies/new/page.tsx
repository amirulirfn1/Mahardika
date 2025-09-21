import { redirect } from "next/navigation";

import { PolicyForm } from "@/components/forms/PolicyForm";
import { getServerClient } from "@/lib/supabase/server";

import { createPolicyAction } from "../_actions";

async function fetchOptions() {
  const supabase = await getServerClient();
  const { data: customers } = await supabase.from('customers').select('id, full_name').order('full_name');
  return {
    customers: (customers || []).map((c) => ({ id: c.id, label: c.full_name })),
    agents: [],
  };
}

export default async function NewPolicyPage() {
  const { customers, agents } = await fetchOptions();

  async function onSubmit(formData: FormData) {
    'use server';
    const res = await createPolicyAction(formData);
    if (res.ok && res.id) redirect(`/dashboard/agency/policies/${res.id}`);
    return res;
  }

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">New Policy</h1>
      <PolicyForm onSubmit={onSubmit} customers={customers} agents={agents} submitLabel="Create" />
    </div>
  );
}
