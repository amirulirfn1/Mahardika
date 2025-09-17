import { Role } from "@prisma/client";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

import { getSession } from "./session";

export type LegacyRole =
  | "platform_admin"
  | "agency_owner"
  | "agent"
  | "staff"
  | "customer";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: LegacyRole;
  agency_id: string | null;
  locale: string;
};

const roleMap: Record<Role, LegacyRole> = {
  [Role.PLATFORM_ADMIN]: "platform_admin",
  [Role.AGENCY_OWNER]: "agency_owner",
  [Role.AGENT]: "agent",
  [Role.AGENCY_STAFF]: "staff",
  [Role.CUSTOMER]: "customer",
};

export const getProfile = cache(async (): Promise<Profile | null> => {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      agencyId: true,
      locale: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    user_id: user.id,
    full_name: user.name ?? user.email,
    email: user.email,
    role: roleMap[user.role],
    agency_id: user.agencyId ?? null,
    locale: user.locale,
  };
});
