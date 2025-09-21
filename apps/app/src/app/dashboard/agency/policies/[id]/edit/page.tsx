import { redirect } from "next/navigation";

import { PolicyForm } from "@/components/forms/PolicyForm";
import { getServerClient } from "@/lib/supabase/server";

import { updatePolicyAction, uploadPolicyPdfAction } from "../../_actions";

async function fetchPolicyAndOptions(id: string) {
  const supabase = await getServerClient();
  const [{ data: policy }, { data: customers }] = await Promise.all([
    supabase
      .from('policies')
      .select('id, policy_no, carrier, product, status, start_date, end_date, premium_gross, premium_net, customer_id, agent_id')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('customers').select('id, full_name').order('full_name'),
  ]);
  return {
    policy,
    customers: (customers || []).map((c) => ({ id: c.id, label: c.full_name })),
    agents: [],
  };
}

export default async function EditPolicyPage({ params }: { params: { id: string } }) {
  const { policy, customers, agents } = await fetchPolicyAndOptions(params.id);
  if (!policy) return <div className="p-6">Policy not found</div>;

  async function onSubmit(formData: FormData) {
    'use server';
    const res = await updatePolicyAction(params.id, formData);
    const file = formData.get('pdf') as File | null;
    if (file && file.size > 0) {
      await uploadPolicyPdfAction(params.id, file);
    }
    if (res.ok) redirect(`/dashboard/agency/policies/${params.id}`);
    return res;
  }

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">Edit Policy</h1>
      <PolicyForm
        onSubmit={onSubmit}
        customers={customers}
        agents={agents}
        initial={{
          policy_no: policy.policy_no,
          carrier: policy.carrier,
          product: policy.product,
          status: policy.status,
          start_date: policy.start_date ?? undefined,
          end_date: policy.end_date ?? undefined,
          premium_gross: policy.premium_gross ?? undefined,
          premium_net: policy.premium_net ?? undefined,
          customer_id: policy.customer_id,
          agent_id: policy.agent_id ?? undefined,
        }}
        submitLabel="Update"
      />
    </div>
  );
}
