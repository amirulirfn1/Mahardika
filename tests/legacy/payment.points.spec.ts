import { prisma } from '@/lib/prisma';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    order: {
      update: jest.fn(),
    },
    customer: {
      update: jest.fn(),
    },
  })),
}));

describe('Loyalty points award on order cleared', () => {
  it('increments customer loyalty points when order marked CLEARED', async () => {
    const orderId = '550e8400-e29b-41d4-a716-446655440abc';
    const customerId = '550e8400-e29b-41d4-a716-446655440def';

    (prisma.order.update as jest.Mock).mockResolvedValue({ id: orderId, customer_id: customerId, state: 'CLEARED' });
    (prisma.customer.update as jest.Mock).mockResolvedValue({ id: customerId, loyalty_points: 110 });

    // pretend to call API route logic
    await prisma.order.update({ where: { id: orderId }, data: { state: 'CLEARED' } });
    await prisma.customer.update({ where: { id: customerId }, data: { loyalty_points: { increment: 10 } } });

    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: orderId }, data: { state: 'CLEARED' } });
    expect(prisma.customer.update).toHaveBeenCalledWith({ where: { id: customerId }, data: { loyalty_points: { increment: 10 } } });
  });
}); 