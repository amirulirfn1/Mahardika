import { z } from "zod";

const getEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return undefined;
};

const envSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL" }),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string()
      .min(1, { message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required" }),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_JWT_SECRET: z.string().min(1).optional(),
    DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    APP_URL: z.string().url().optional(),
    SKIP_AUTH: z.enum(["true", "false"]).default("false"),
  })
  .superRefine((value, ctx) => {
    if (value.SKIP_AUTH === "false" && !value.NEXTAUTH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXTAUTH_SECRET is required when SKIP_AUTH is false",
        path: ["NEXTAUTH_SECRET"],
      });
    }
  });

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: getEnvValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    "STORAGE_NEXT_PUBLIC_SUPABASE_URL",
    "STORAGE_SUPABASE_URL"
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "STORAGE_NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "STORAGE_SUPABASE_ANON_KEY"
  ),
  SUPABASE_SERVICE_ROLE_KEY: getEnvValue("SUPABASE_SERVICE_ROLE_KEY", "STORAGE_SUPABASE_SERVICE_ROLE_KEY"),
  SUPABASE_JWT_SECRET: getEnvValue("SUPABASE_JWT_SECRET", "STORAGE_SUPABASE_JWT_SECRET"),
  DATABASE_URL: getEnvValue("DATABASE_URL", "STORAGE_POSTGRES_PRISMA_URL", "STORAGE_POSTGRES_URL"),
  NEXTAUTH_SECRET: getEnvValue("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: getEnvValue("NEXTAUTH_URL"),
  APP_URL: getEnvValue("APP_URL"),
  SKIP_AUTH: getEnvValue("SKIP_AUTH") ?? "false",
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`);
  throw new Error(`Invalid environment configuration\n${issues.join("\n")}`);
}

export const env = {
  ...parsed.data,
  SKIP_AUTH: parsed.data.SKIP_AUTH === "true",
  NEXTAUTH_URL: parsed.data.NEXTAUTH_URL ?? parsed.data.APP_URL,
};
