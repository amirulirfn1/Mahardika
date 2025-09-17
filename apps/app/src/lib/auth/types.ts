import type { Role } from "@prisma/client";
import type { DefaultSession, Session } from "next-auth";

export type SessionUser = DefaultSession["user"] & {
  id: string;
  role: Role;
  agencyId: string | null;
  locale: string;
};

export type SessionWithUser = Session & {
  user: SessionUser;
  tenantId: string | null;
};
