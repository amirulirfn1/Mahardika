import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import type { SessionWithUser } from "@/lib/auth/types";

export async function getSession(): Promise<SessionWithUser | null> {
  const session = await getServerSession(authOptions);
  return session as SessionWithUser | null;
}

export async function requireSession(params?: { redirectTo?: string }): Promise<SessionWithUser> {
  const session = await getSession();
  if (!session) {
    if (params?.redirectTo) {
      redirect(params.redirectTo);
    }

    throw new Error("Unauthenticated");
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
