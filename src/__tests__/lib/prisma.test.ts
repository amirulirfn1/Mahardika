/**
 * Prisma Database Client Tests - Mahardika Platform
 * Testing database connections, multi-tenant operations, and helper functions
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import {
  prisma,
  connectToDatabase,
  disconnectFromDatabase,
  checkDatabaseHealth,
  createTenantContext,
  createAgencyClient,
  logDatabaseAction,
} from '@/lib/prisma';

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn(),
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    policy: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    analytics: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

// Mock environment
jest.mock('@/lib/env', () => ({
  DATABASE_CONFIG: {
    databaseUrl: 'postgresql://test:test@localhost:5432/mahardika_test',
  },
}));

describe('Prisma Database Client', () => {
  const mockAgencyId = '550e8400-e29b-41d4-a716-446655440000';
  const mockUserId = '550e8400-e29b-41d4-a716-446655440001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const mockConnect = jest.fn().mockResolvedValue(undefined);
      (prisma.$connect as jest.Mock) = mockConnect;

      const result = await connectToDatabase();

      expect(mockConnect).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle connection errors', async () => {
      const mockConnect = jest
        .fn()
        .mockRejectedValue(new Error('Connection failed'));
      (prisma.$connect as jest.Mock) = mockConnect;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await connectToDatabase();

      expect(mockConnect).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Failed to connect to database:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should disconnect from database successfully', async () => {
      const mockDisconnect = jest.fn().mockResolvedValue(undefined);
      (prisma.$disconnect as jest.Mock) = mockDisconnect;

      const result = await disconnectFromDatabase();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle disconnection errors', async () => {
      const mockDisconnect = jest
        .fn()
        .mockRejectedValue(new Error('Disconnection failed'));
      (prisma.$disconnect as jest.Mock) = mockDisconnect;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await disconnectFromDatabase();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Failed to disconnect from database:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Database Health Check', () => {
    it('should return healthy status when database is accessible', async () => {
      const mockQueryRaw = jest.fn().mockResolvedValue([{ '?column?': 1 }]);
      (prisma.$queryRaw as jest.Mock) = mockQueryRaw;

      const result = await checkDatabaseHealth();

      expect(mockQueryRaw).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        connection: 'active',
      });
    });

    it('should return unhealthy status when database is not accessible', async () => {
      const mockQueryRaw = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));
      (prisma.$queryRaw as jest.Mock) = mockQueryRaw;

      const result = await checkDatabaseHealth();

      expect(mockQueryRaw).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'unhealthy',
        timestamp: expect.any(String),
        connection: 'failed',
        error: 'Database error',
      });
    });

    it('should handle unknown errors', async () => {
      const mockQueryRaw = jest.fn().mockRejectedValue('Unknown error');
      (prisma.$queryRaw as jest.Mock) = mockQueryRaw;

      const result = await checkDatabaseHealth();

      expect(result).toEqual({
        status: 'unhealthy',
        timestamp: expect.any(String),
        connection: 'failed',
        error: 'Unknown error',
      });
    });
  });

  describe('Tenant Context', () => {
    it('should create tenant context with agency ID', () => {
      const context = createTenantContext(mockAgencyId);

      expect(context.agencyId).toBe(mockAgencyId);
      expect(typeof context.withAgencyFilter).toBe('function');
    });

    it('should add agency_id to data with withAgencyFilter', () => {
      const context = createTenantContext(mockAgencyId);
      const testData = { name: 'Test User', email: 'test@example.com' };

      const result = context.withAgencyFilter(testData);

      expect(result).toEqual({
        ...testData,
        agency_id: mockAgencyId,
      });
    });

    it('should preserve existing agency_id when using withAgencyFilter', () => {
      const context = createTenantContext(mockAgencyId);
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        agency_id: 'existing-agency-id',
      };

      const result = context.withAgencyFilter(testData);

      expect(result.agency_id).toBe(mockAgencyId);
    });
  });

  describe('Agency Client', () => {
    let agencyClient: ReturnType<typeof createAgencyClient>;

    beforeEach(() => {
      agencyClient = createAgencyClient(mockAgencyId);
    });

    describe('Users Operations', () => {
      it('should find users with agency filter', async () => {
        const mockUsers = [
          { id: '1', name: 'User 1', agency_id: mockAgencyId },
        ];
        (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

        const result = await agencyClient.users.findMany();

        expect(prisma.user.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockUsers);
      });

      it('should find unique user with agency filter', async () => {
        const mockUser = {
          id: mockUserId,
          name: 'User 1',
          agency_id: mockAgencyId,
        };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        const result = await agencyClient.users.findUnique({
          where: { id: mockUserId },
        });

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: mockUserId, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockUser);
      });

      it('should create user with agency filter', async () => {
        const userData = { name: 'New User', email: 'new@example.com' };
        const mockUser = {
          id: mockUserId,
          ...userData,
          agency_id: mockAgencyId,
        };
        (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

        const result = await agencyClient.users.create({
          data: userData,
        });

        expect(prisma.user.create).toHaveBeenCalledWith({
          data: { ...userData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockUser);
      });

      it('should update user with agency filter', async () => {
        const updateData = { name: 'Updated User' };
        const mockUser = {
          id: mockUserId,
          ...updateData,
          agency_id: mockAgencyId,
        };
        (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

        const result = await agencyClient.users.update({
          where: { id: mockUserId },
          data: updateData,
        });

        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUserId, agency_id: mockAgencyId },
          data: updateData,
        });
        expect(result).toEqual(mockUser);
      });
    });

    describe('Customers Operations', () => {
      it('should find customers with agency filter', async () => {
        const mockCustomers = [
          { id: '1', name: 'Customer 1', agency_id: mockAgencyId },
        ];
        (prisma.customer.findMany as jest.Mock).mockResolvedValue(
          mockCustomers
        );

        const result = await agencyClient.customers.findMany();

        expect(prisma.customer.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockCustomers);
      });

      it('should create customer with agency filter', async () => {
        const customerData = {
          name: 'New Customer',
          email: 'customer@example.com',
        };
        const mockCustomer = {
          id: '1',
          ...customerData,
          agency_id: mockAgencyId,
        };
        (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);

        const result = await agencyClient.customers.create({
          data: customerData,
        });

        expect(prisma.customer.create).toHaveBeenCalledWith({
          data: { ...customerData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockCustomer);
      });
    });

    describe('Policies Operations', () => {
      it('should find policies with agency filter', async () => {
        const mockPolicies = [
          { id: '1', policy_number: 'POL-001', agency_id: mockAgencyId },
        ];
        (prisma.policy.findMany as jest.Mock).mockResolvedValue(mockPolicies);

        const result = await agencyClient.policies.findMany();

        expect(prisma.policy.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockPolicies);
      });

      it('should create policy with agency filter', async () => {
        const policyData = {
          policy_number: 'POL-002',
          customer_id: 'customer-1',
          policy_type: 'Auto Insurance',
        };
        const mockPolicy = { id: '2', ...policyData, agency_id: mockAgencyId };
        (prisma.policy.create as jest.Mock).mockResolvedValue(mockPolicy);

        const result = await agencyClient.policies.create({
          data: policyData,
        });

        expect(prisma.policy.create).toHaveBeenCalledWith({
          data: { ...policyData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockPolicy);
      });
    });

    describe('Reviews Operations', () => {
      it('should find reviews with agency filter', async () => {
        const mockReviews = [{ id: '1', rating: 5, agency_id: mockAgencyId }];
        (prisma.review.findMany as jest.Mock).mockResolvedValue(mockReviews);

        const result = await agencyClient.reviews.findMany();

        expect(prisma.review.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockReviews);
      });

      it('should create review with agency filter', async () => {
        const reviewData = {
          rating: 5,
          customer_id: 'customer-1',
          title: 'Great service',
        };
        const mockReview = { id: '1', ...reviewData, agency_id: mockAgencyId };
        (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);

        const result = await agencyClient.reviews.create({
          data: reviewData,
        });

        expect(prisma.review.create).toHaveBeenCalledWith({
          data: { ...reviewData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockReview);
      });
    });

    describe('Analytics Operations', () => {
      it('should find analytics with agency filter', async () => {
        const mockAnalytics = [
          { id: '1', metric_name: 'revenue', agency_id: mockAgencyId },
        ];
        (prisma.analytics.findMany as jest.Mock).mockResolvedValue(
          mockAnalytics
        );

        const result = await agencyClient.analytics.findMany();

        expect(prisma.analytics.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockAnalytics);
      });

      it('should create analytics with agency filter', async () => {
        const analyticsData = {
          metric_name: 'new_customers',
          metric_value: 25,
          metric_type: 'count',
        };
        const mockAnalytics = {
          id: '1',
          ...analyticsData,
          agency_id: mockAgencyId,
        };
        (prisma.analytics.create as jest.Mock).mockResolvedValue(mockAnalytics);

        const result = await agencyClient.analytics.create({
          data: analyticsData,
        });

        expect(prisma.analytics.create).toHaveBeenCalledWith({
          data: { ...analyticsData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockAnalytics);
      });
    });

    describe('Audit Logs Operations', () => {
      it('should find audit logs with agency filter', async () => {
        const mockLogs = [
          { id: '1', action: 'CREATE', agency_id: mockAgencyId },
        ];
        (prisma.auditLog.findMany as jest.Mock).mockResolvedValue(mockLogs);

        const result = await agencyClient.auditLogs.findMany();

        expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockLogs);
      });

      it('should create audit log with agency filter', async () => {
        const logData = {
          action: 'UPDATE',
          resource: 'user',
          resource_id: mockUserId,
        };
        const mockLog = { id: '1', ...logData, agency_id: mockAgencyId };
        (prisma.auditLog.create as jest.Mock).mockResolvedValue(mockLog);

        const result = await agencyClient.auditLogs.create({
          data: logData,
        });

        expect(prisma.auditLog.create).toHaveBeenCalledWith({
          data: { ...logData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockLog);
      });
    });

    describe('Notifications Operations', () => {
      it('should find notifications with agency filter', async () => {
        const mockNotifications = [
          { id: '1', title: 'Welcome', agency_id: mockAgencyId },
        ];
        (prisma.notification.findMany as jest.Mock).mockResolvedValue(
          mockNotifications
        );

        const result = await agencyClient.notifications.findMany();

        expect(prisma.notification.findMany).toHaveBeenCalledWith({
          where: { agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockNotifications);
      });

      it('should create notification with agency filter', async () => {
        const notificationData = {
          title: 'New Message',
          content: 'You have a new message',
          type: 'info',
        };
        const mockNotification = {
          id: '1',
          ...notificationData,
          agency_id: mockAgencyId,
        };
        (prisma.notification.create as jest.Mock).mockResolvedValue(
          mockNotification
        );

        const result = await agencyClient.notifications.create({
          data: notificationData,
        });

        expect(prisma.notification.create).toHaveBeenCalledWith({
          data: { ...notificationData, agency_id: mockAgencyId },
        });
        expect(result).toEqual(mockNotification);
      });
    });
  });

  describe('Audit Logging', () => {
    it('should log database action successfully', async () => {
      const mockCreate = jest.fn().mockResolvedValue({ id: '1' });
      (prisma.auditLog.create as jest.Mock) = mockCreate;

      await logDatabaseAction(
        mockAgencyId,
        'CREATE',
        'user',
        mockUserId,
        mockUserId,
        null,
        { name: 'New User' }
      );

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          agency_id: mockAgencyId,
          action: 'CREATE',
          resource: 'user',
          resource_id: mockUserId,
          user_id: mockUserId,
          old_values: null,
          new_values: { name: 'New User' },
          created_at: expect.any(Date),
        },
      });
    });

    it('should handle audit logging errors gracefully', async () => {
      const mockCreate = jest
        .fn()
        .mockRejectedValue(new Error('Audit log failed'));
      (prisma.auditLog.create as jest.Mock) = mockCreate;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await logDatabaseAction(mockAgencyId, 'CREATE', 'user', mockUserId);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to log database action:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should log action with optional parameters', async () => {
      const mockCreate = jest.fn().mockResolvedValue({ id: '1' });
      (prisma.auditLog.create as jest.Mock) = mockCreate;

      await logDatabaseAction(mockAgencyId, 'DELETE', 'customer', 'customer-1');

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          agency_id: mockAgencyId,
          action: 'DELETE',
          resource: 'customer',
          resource_id: 'customer-1',
          user_id: undefined,
          old_values: undefined,
          new_values: undefined,
          created_at: expect.any(Date),
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection timeout', async () => {
      const mockConnect = jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Connection timeout')), 100)
            )
        );
      (prisma.$connect as jest.Mock) = mockConnect;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await connectToDatabase();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Failed to connect to database:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle malformed query errors', async () => {
      const mockQueryRaw = jest
        .fn()
        .mockRejectedValue(new Error('Malformed query'));
      (prisma.$queryRaw as jest.Mock) = mockQueryRaw;

      const result = await checkDatabaseHealth();

      expect(result.status).toBe('unhealthy');
      expect(result.error).toBe('Malformed query');
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle large result sets efficiently', async () => {
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        agency_id: mockAgencyId,
      }));

      (prisma.user.findMany as jest.Mock).mockResolvedValue(largeDataSet);

      const agencyClient = createAgencyClient(mockAgencyId);
      const result = await agencyClient.users.findMany();

      expect(result).toHaveLength(1000);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { agency_id: mockAgencyId },
      });
    });

    it('should handle concurrent operations', async () => {
      const agencyClient = createAgencyClient(mockAgencyId);

      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.customer.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.policy.findMany as jest.Mock).mockResolvedValue([]);

      const promises = [
        agencyClient.users.findMany(),
        agencyClient.customers.findMany(),
        agencyClient.policies.findMany(),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(prisma.customer.findMany).toHaveBeenCalled();
      expect(prisma.policy.findMany).toHaveBeenCalled();
    });
  });
});
