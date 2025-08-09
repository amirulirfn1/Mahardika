import { redirect } from "next/navigation";

import { getProfile } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const profile = await getProfile();
  if (!profile) return redirect("/profile/setup");

  switch (profile.role) {
    case "platform_admin":
    case "agency_owner":
      return redirect("/dashboard/agency");
    case "staff":
      return redirect("/dashboard/staff");
    case "customer":
      return redirect("/dashboard/customer");
    default:
      return redirect("/");
  }
}
