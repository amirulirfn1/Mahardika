import { redirect } from "next/navigation";

import { CustomerForm } from "@/components/forms/CustomerForm";

import { createCustomer } from "../_actions";

export default function NewCustomerPage() {
  async function onSubmit(formData: FormData) {
    "use server";
    const res = await createCustomer(formData);
    if (res.ok && res.id) redirect(`/dashboard/agency/customers/${res.id}`);
    return res;
  }

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">New Customer</h1>
      <CustomerForm onSubmit={onSubmit} submitLabel="Create" />
    </div>
  );
}

