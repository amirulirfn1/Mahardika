import { getProfile } from "@/lib/auth";
import { getCounts, getRecentPolicies } from "@/lib/kpis";

export default async function AgencyDashboardPage() {
  const profile = await getProfile();
  const agencyId = profile?.agency_id ?? null;
  const [counts, recent] = await Promise.all([
    getCounts(agencyId),
    getRecentPolicies(agencyId, 5),
  ]);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Agency Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Customers</div>
          <div className="text-3xl font-bold">{counts.customers}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Policies</div>
          <div className="text-3xl font-bold">{counts.policies}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Payments</div>
          <div className="text-3xl font-bold">{counts.payments}</div>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-4 font-medium">Recent Policies</div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Policy No</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">End Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.policy_no} className="border-t">
                  <td className="py-2 pr-4">{p.policy_no}</td>
                  <td className="py-2 pr-4">{p.customer_name ?? "-"}</td>
                  <td className="py-2 pr-4">{p.end_date}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-500">
                    No recent policies
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
