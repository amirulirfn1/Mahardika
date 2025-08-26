import { redirect } from "next/navigation";

import { getServerClient } from "@/lib/supabase/server";
import { PolicyForm } from "@/components/forms/PolicyForm";

import { updatePolicyAction, uploadPolicyPdfAction } from "../../_actions";

async function fetchPolicyAndOptions(id: string) {
  const supabase = getServerClient();
  const [{ data: policy }, { data: customers }, { data: vehicles }] = await Promise.all([
    supabase
      .from("policies")
      .select("id, policy_no, start_date, end_date, premium_myr, customer_id, vehicle_id")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("customers").select("id, full_name").order("full_name"),
    supabase.from("vehicles").select("id, plate_no").order("created_at", { ascending: false }),
  ]);
  return {
    policy,
    customers: (customers || []).map((c) => ({ id: c.id, label: c.full_name })),
    vehicles: (vehicles || []).map((v) => ({ id: v.id, label: v.plate_no })),
  };
}

export default async function EditPolicyPage({ params }: { params: { id: string } }) {
  const { policy, customers, vehicles } = await fetchPolicyAndOptions(params.id);
  if (!policy) return <div className="p-6">Policy not found</div>;

  async function onSubmit(formData: FormData) {
    "use server";
    const res = await updatePolicyAction(params.id, formData);
    const file = formData.get("pdf") as File | null;
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
        vehicles={vehicles}
        initial={{
          policy_no: policy.policy_no,
          start_date: policy.start_date,
          end_date: policy.end_date,
          premium_myr: policy.premium_myr,
          customer_id: policy.customer_id,
          vehicle_id: policy.vehicle_id,
        }}
        submitLabel="Update"
      />
    </div>
  );
}



