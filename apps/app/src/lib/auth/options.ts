import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function nowEpochSeconds() {
  return Math.floor(Date.now() / 1000);
}

const USER_REFRESH_INTERVAL_SECONDS = 60 * 5;

const adapter = PrismaAdapter(prisma) as Adapter;

type ExtendedAuthOptions = NextAuthOptions & { trustHost?: boolean };

export const authOptions: ExtendedAuthOptions = {
  adapter,
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordValid = await compare(password, user.passwordHash);
        if (!passwordValid) {
          return null;
        }

        if (user.role !== Role.PLATFORM_ADMIN && !user.agencyId) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId,
          locale: user.locale,
        } as {
          id: string;
          name: string | null;
          email: string | null;
          role: Role;
          agencyId: string | null;
          locale: string;
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as Role | undefined) ?? Role.AGENCY_STAFF;
        session.user.agencyId = (token.agencyId as string | null | undefined) ?? null;
        session.user.locale = (token.locale as string | undefined) ?? "en";
      }

      session.tenantId = (token.tenantId as string | null | undefined) ?? session.user?.agencyId ?? null;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? token.role;
        token.agencyId = (user as { agencyId?: string | null }).agencyId ?? null;
        token.locale = (user as { locale?: string }).locale ?? token.locale ?? "en";
        token.userSyncedAt = nowEpochSeconds();
        return token;
      }

      const lastSynced = typeof token.userSyncedAt === "number" ? token.userSyncedAt : 0;
      const shouldRefresh = nowEpochSeconds() - lastSynced >= USER_REFRESH_INTERVAL_SECONDS;

      if (shouldRefresh && token.sub) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, agencyId: true, locale: true },
        });

        if (freshUser) {
          token.role = freshUser.role;
          token.agencyId = freshUser.agencyId ?? null;
          token.locale = freshUser.locale;
          token.userSyncedAt = nowEpochSeconds();
        }
      }

      return token;
    },
  },
  trustHost: true,
};
