import { redirect } from "next/navigation";

import { getProfile } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const profile = await getProfile();
  if (!profile) return redirect('/profile/setup');

  switch (profile.role) {
    case 'SUPER_ADMIN':
    case 'OWNER':
    case 'ADMIN':
    case 'AGENT':
      return redirect('/dashboard/agency');
    case 'STAFF':
      return redirect('/dashboard/staff');
    default:
      return redirect('/');
  }
}
