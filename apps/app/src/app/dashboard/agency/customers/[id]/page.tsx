import { revalidatePath } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { getServerClient } from "@/lib/supabase/server";
import { ConfirmAction } from "@/src/components/ConfirmAction";
import { VehicleInlineForm } from "@/src/components/forms/VehicleInlineForm";

import { addVehicle, removeVehicle } from "../_actions";

async function fetchCustomerWithVehicles(id: string) {
  const supabase = getServerClient();
  const [{ data: customer }, { data: vehicles }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, full_name, email, phone, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("vehicles")
      .select("id, plate_no, make, model, year, customer_id, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);
  return { customer, vehicles: vehicles || [] };
}

export const revalidate = 0;

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { customer, vehicles } = await fetchCustomerWithVehicles(params.id);
  if (!customer) return <div className="p-6">Customer not found</div>;

  async function onAddVehicle(formData: FormData) {
    "use server";
    const res = await addVehicle(params.id, formData);
    if (res.ok) revalidatePath(`/dashboard/agency/customers/${params.id}`);
    return res;
  }

  async function onRemoveVehicle(formData: FormData) {
    "use server";
    const vehicleId = String(formData.get("vehicle_id"));
    await removeVehicle(vehicleId);
    revalidatePath(`/dashboard/agency/customers/${params.id}`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{customer.full_name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/agency/customers/${customer.id}/edit`}
            className="underline"
          >
            Edit
          </Link>
          <Link href="/dashboard/agency/customers" className="underline">
            Back
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>Details</CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Email</div>
              <div>{customer.email ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-600">Phone</div>
              <div>{customer.phone ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-600">Created</div>
              <div>{new Date(customer.created_at).toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Vehicles</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <VehicleInlineForm onSubmit={onAddVehicle} />
            <div className="rounded border overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Plate</TH>
                    <TH>Make</TH>
                    <TH>Model</TH>
                    <TH>Year</TH>
                    <TH>Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {vehicles.map((v) => (
                    <TR key={v.id}>
                      <TD>{v.plate_no}</TD>
                      <TD>{v.make ?? "-"}</TD>
                      <TD>{v.model ?? "-"}</TD>
                      <TD>{v.year ?? "-"}</TD>
                      <TD>
                        <ConfirmAction
                          action={onRemoveVehicle}
                          confirmMessage="Remove this vehicle?"
                        >
                          <input type="hidden" name="vehicle_id" value={v.id} />
                          <Button variant="ghost" className="px-2">
                            Remove
                          </Button>
                        </ConfirmAction>
                      </TD>
                    </TR>
                  ))}
                  {vehicles.length === 0 && (
                    <TR>
                      <TD colSpan={5}>No vehicles</TD>
                    </TR>
                  )}
                </TBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
