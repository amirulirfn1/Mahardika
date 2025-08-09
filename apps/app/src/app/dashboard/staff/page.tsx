import { getProfile } from "@/lib/auth";

export default async function StaffDashboardPage() {
  const profile = await getProfile();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
      <p>
        Welcome {profile?.full_name ?? "Staff"} ({profile?.role}) at agency {profile?.agency_id ?? "-"}
      </p>
      <p className="text-gray-600">TODO: staff tasks, customer list, upcoming renewals</p>
    </div>
  );
}


