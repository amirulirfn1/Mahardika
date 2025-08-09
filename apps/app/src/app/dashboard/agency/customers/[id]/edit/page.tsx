import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/src/components/forms/CustomerForm";
import { updateCustomer } from "../../_actions";

async function fetchCustomer(id: string) {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("customers")
    .select("id, full_name, email, phone")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customer = await fetchCustomer(params.id);
  if (!customer) return <div className="p-6">Customer not found</div>;

  async function onSubmit(formData: FormData) {
    "use server";
    const res = await updateCustomer(params.id, formData);
    if (res.ok) redirect(`/dashboard/agency/customers/${params.id}`);
    return res;
  }

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Edit Customer</h1>
      <CustomerForm
        onSubmit={onSubmit}
        submitLabel="Update"
        initial={{ full_name: customer.full_name, email: customer.email, phone: customer.phone }}
      />
    </div>
  );
}


