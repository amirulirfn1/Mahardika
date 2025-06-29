import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const vehicleSchema = z.object({
  plate_no: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  color: z.string().optional(),
  customer_id: z.string().uuid(),
  agency_id: z.string().uuid(),
});

// Helper: parse id from query
function getIdParam(url: string) {
  const { searchParams } = new URL(url);
  return searchParams.get('id');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const plateSearch = searchParams.get('plate');

    if (id) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
      }
      return NextResponse.json(vehicle);
    }

    const vehicles = await prisma.vehicle.findMany({
      where: plateSearch
        ? { plate_no: { contains: plateSearch, mode: 'insensitive' } }
        : undefined,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Vehicles GET error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = vehicleSchema.parse(body);

    const created = await prisma.vehicle.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Vehicles POST error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = getIdParam(request.url);
    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 });
    }
    const body = await request.json();
    const data = vehicleSchema.partial().parse(body);

    const updated = await prisma.vehicle.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Vehicles PUT error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getIdParam(request.url);
    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 });
    }
    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vehicles DELETE error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
} 