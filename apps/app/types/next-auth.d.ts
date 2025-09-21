import type { DefaultSession } from "next-auth";

import type { AppRole } from "@/lib/auth/types";

declare module "next-auth" {
  interface Session {
    user: (DefaultSession['user'] & {
      id: string;
      role: AppRole;
      tenantId: string | null;
      locale: string;
    }) | null;
    tenantId: string | null;
  }

  interface User {
    role: AppRole;
    tenantId: string | null;
    locale: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    tenantId?: string | null;
    locale?: string;
    impersonatedTenantId?: string | null;
    userSyncedAt?: number;
  }
}
