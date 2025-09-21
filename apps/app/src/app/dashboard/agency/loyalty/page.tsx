import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { listTiers } from "@/lib/loyalty";

import { setDefaultTierAction, upsertTierAction } from "./_actions";

export const revalidate = 0;

export default async function LoyaltyTiersPage() {
  const tiers = await listTiers();

  async function upsert(formData: FormData) {
    'use server';
    const res = await upsertTierAction(formData);
    if (res.ok) {
      revalidatePath('/dashboard/agency/loyalty');
    }
  }

  async function setDefault(formData: FormData) {
    'use server';
    const tierId = String(formData.get('tier_id'));
    const res = await setDefaultTierAction(tierId);
    if (res.ok) {
      revalidatePath('/dashboard/agency/loyalty');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Loyalty Tiers</h1>
      </div>

      <Card>
        <CardHeader>Existing Tiers</CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded border">
            <Table>
              <THead>
                <TR>
                  <TH>Code</TH>
                  <TH>Name</TH>
                  <TH>Ringgit to Point</TH>
                  <TH>Threshold Visits</TH>
                  <TH>Default</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {(tiers.ok ? tiers.data : []).map((t) => (
                  <TR key={t.id}>
                    <TD>{t.code}</TD>
                    <TD>{t.name}</TD>
                    <TD>{Number(t.ringgit_to_point).toFixed(2)}</TD>
                    <TD>{t.threshold_visits ?? '-'}</TD>
                    <TD>{t.is_default ? 'Yes' : 'No'}</TD>
                    <TD>
                      {!t.is_default && (
                        <form action={setDefault}>
                          <input type="hidden" name="tier_id" value={t.id} />
                          <Button variant="ghost" className="px-2">Set default</Button>
                        </form>
                      )}
                    </TD>
                  </TR>
                ))}
                {(!tiers.ok || (tiers.data || []).length === 0) && (
                  <TR>
                    <TD colSpan={6}>No tiers yet</TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Add or Edit Tier</CardHeader>
        <CardContent>
          <form action={upsert} className="max-w-xl space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm">Code</label>
                <input name="code" className="w-full rounded border px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm">Name</label>
                <input name="name" className="w-full rounded border px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm">Ringgit to Point</label>
                <input name="ringgit_to_point" type="number" step="0.01" min="0.01" className="w-full rounded border px-3 py-2" defaultValue={1.0} />
              </div>
              <div>
                <label className="mb-1 block text-sm">Threshold Visits</label>
                <input name="threshold_visits" type="number" min="0" className="w-full rounded border px-3 py-2" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input id="is_default" name="is_default" type="checkbox" />
                <label htmlFor="is_default" className="text-sm">Set as default</label>
              </div>
            </div>
            <Button type="submit">Save Tier</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
