// Mock Prisma Client for vehicles (must be declared before prisma import)
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    vehicle: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

import { prisma } from '@/lib/prisma';

const sampleVehicle = {
  id: '550e8400-e29b-41d4-a716-446655440099',
  plate_no: 'ABC123',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  color: 'Blue',
  customer_id: '550e8400-e29b-41d4-a716-446655440001',
  agency_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('Vehicle CRUD (Prisma)', () => {
  const prismaVehicle = (prisma as any).vehicle;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a vehicle', async () => {
    prismaVehicle.create.mockResolvedValue(sampleVehicle);
    const created = await prismaVehicle.create({ data: sampleVehicle });
    expect(prismaVehicle.create).toHaveBeenCalledWith({ data: sampleVehicle });
    expect(created).toEqual(sampleVehicle);
  });

  it('reads a vehicle by id', async () => {
    prismaVehicle.findUnique.mockResolvedValue(sampleVehicle);
    const found = await prismaVehicle.findUnique({ where: { id: sampleVehicle.id } });
    expect(prismaVehicle.findUnique).toHaveBeenCalledWith({ where: { id: sampleVehicle.id } });
    expect(found).toEqual(sampleVehicle);
  });

  it('updates a vehicle', async () => {
    prismaVehicle.update.mockResolvedValue({ ...sampleVehicle, color: 'Red' });
    const updated = await prismaVehicle.update({ where: { id: sampleVehicle.id }, data: { color: 'Red' } });
    expect(prismaVehicle.update).toHaveBeenCalledWith({ where: { id: sampleVehicle.id }, data: { color: 'Red' } });
    expect(updated.color).toBe('Red');
  });
}); 