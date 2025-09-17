import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: (DefaultSession["user"] & {
      id: string;
      role: Role;
      agencyId: string | null;
      locale: string;
    }) | null;
    tenantId: string | null;
  }

  interface User {
    role: Role;
    agencyId: string | null;
    locale: string;
    passwordHash?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    agencyId?: string | null;
    locale?: string;
    tenantId?: string | null;
    userSyncedAt?: number;
  }
}
