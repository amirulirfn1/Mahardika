import { getProfile } from "@/lib/auth";

export default async function CustomerDashboardPage() {
  const profile = await getProfile();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Customer Dashboard</h1>
      <p>
        Hello {profile?.full_name ?? "Customer"} ({profile?.role})
      </p>
      <p className="text-gray-600">TODO: show active policies, renewal reminders</p>
    </div>
  );
}


