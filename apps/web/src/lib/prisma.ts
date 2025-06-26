/**
 * Prisma Database Client - Mahardika Platform
 * Multi-tenant SaaS database connection with proper connection handling
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import { PrismaClient } from '@prisma/client';
import { DATABASE_CONFIG } from './env';

// Global variable to store the Prisma client instance
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var __prisma: PrismaClient | undefined;
}

// Prisma Client configuration with proper logging and error handling
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: DATABASE_CONFIG.databaseUrl,
      },
    },
  });

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Connection helper functions
export async function connectToDatabase() {
  try {
    await prisma.$connect();
    
    return true;
  } catch (error) {
    
    return false;
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    
    return true;
  } catch (error) {
    
    return false;
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: 'active',
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Multi-tenant helper functions
export function createTenantContext(agencyId: string) {
  return {
    agencyId,
    // Helper to ensure all queries include agency filter
    withAgencyFilter: <T extends { agency_id?: string }>(data: T) => ({
      ...data,
      agency_id: agencyId,
    }),
  };
}

// Agency-scoped database operations
export function createAgencyClient(agencyId: string) {
  const context = createTenantContext(agencyId);

  return {
    // Users within agency
    users: {
      findMany: (args?: Parameters<typeof prisma.user.findMany>[0]) =>
        prisma.user.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      findUnique: (args: Parameters<typeof prisma.user.findUnique>[0]) =>
        prisma.user.findUnique({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.user.create>[0]) =>
        prisma.user.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
      update: (args: Parameters<typeof prisma.user.update>[0]) =>
        prisma.user.update({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
    },

    // Customers within agency
    customers: {
      findMany: (args?: Parameters<typeof prisma.customer.findMany>[0]) =>
        prisma.customer.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      findUnique: (args: Parameters<typeof prisma.customer.findUnique>[0]) =>
        prisma.customer.findUnique({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.customer.create>[0]) =>
        prisma.customer.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
      update: (args: Parameters<typeof prisma.customer.update>[0]) =>
        prisma.customer.update({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
    },

    // Policies within agency
    policies: {
      findMany: (args?: Parameters<typeof prisma.policy.findMany>[0]) =>
        prisma.policy.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      findUnique: (args: Parameters<typeof prisma.policy.findUnique>[0]) =>
        prisma.policy.findUnique({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.policy.create>[0]) =>
        prisma.policy.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
      update: (args: Parameters<typeof prisma.policy.update>[0]) =>
        prisma.policy.update({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
    },

    // Reviews within agency
    reviews: {
      findMany: (args?: Parameters<typeof prisma.review.findMany>[0]) =>
        prisma.review.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      findUnique: (args: Parameters<typeof prisma.review.findUnique>[0]) =>
        prisma.review.findUnique({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.review.create>[0]) =>
        prisma.review.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
      update: (args: Parameters<typeof prisma.review.update>[0]) =>
        prisma.review.update({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
    },

    // Analytics within agency
    analytics: {
      findMany: (args?: Parameters<typeof prisma.analytics.findMany>[0]) =>
        prisma.analytics.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.analytics.create>[0]) =>
        prisma.analytics.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
    },

    // Audit logs within agency
    auditLogs: {
      findMany: (args?: Parameters<typeof prisma.auditLog.findMany>[0]) =>
        prisma.auditLog.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.auditLog.create>[0]) =>
        prisma.auditLog.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
    },

    // Notifications within agency
    notifications: {
      findMany: (args?: Parameters<typeof prisma.notification.findMany>[0]) =>
        prisma.notification.findMany({
          ...args,
          where: { ...args?.where, agency_id: agencyId },
        }),
      findUnique: (
        args: Parameters<typeof prisma.notification.findUnique>[0]
      ) =>
        prisma.notification.findUnique({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
      create: (args: Parameters<typeof prisma.notification.create>[0]) =>
        prisma.notification.create({
          ...args,
          data: context.withAgencyFilter(args.data),
        }),
      update: (args: Parameters<typeof prisma.notification.update>[0]) =>
        prisma.notification.update({
          ...args,
          where: { ...args.where, agency_id: agencyId },
        }),
    },
  };
}

// Audit logging helper
export async function logDatabaseAction(
  agencyId: string,
  action: string,
  resource: string,
  resourceId: string,
  userId?: string,
  oldValues?: unknown,
  newValues?: unknown
) {
  try {
    await prisma.auditLog.create({
      data: {
        agency_id: agencyId,
        action,
        resource,
        resource_id: resourceId,
        user_id: userId,
        old_values: oldValues as any,
        new_values: newValues as any,
        created_at: new Date(),
      },
    });
  } catch (error) {
    // no-op
  }
}

// Export Prisma types for type safety
export type {
  Agency,
  User,
  Customer,
  Policy,
  PolicyStatus,
  Review,
  Analytics,
  AuditLog,
  SystemConfig,
  Notification,
} from '@prisma/client';

// Cleanup on process exit
process.on('beforeExit', async () => {
  await disconnectFromDatabase();
});

export default prisma;
