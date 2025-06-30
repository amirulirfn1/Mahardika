import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { customer_id, value_rm, staff_id } = await request.json();
  if (!customer_id || !value_rm) {
    return NextResponse.json({ error: 'customer_id & value_rm required' }, { status: 400 });
  }
  const pointsNeeded = Math.round(Number(value_rm) * 10);
  if (pointsNeeded <= 0) {
    return NextResponse.json({ error: 'value_rm must be positive' }, { status: 400 });
  }
  const customer = await prisma.customer.findUnique({ where: { id: customer_id }, select: { loyalty_points: true, agency_id: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  if (customer.loyalty_points < pointsNeeded) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 402 });
  }
  const newBalance = customer.loyalty_points - pointsNeeded;
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: customer_id },
      data: { loyalty_points: { decrement: pointsNeeded } },
    }),
    prisma.pointsRedemption.create({
      data: {
        customer_id,
        agency_id: customer.agency_id,
        staff_id,
        points_deducted: pointsNeeded,
        value_rm,
      },
    }) as any,
  ]);
  return NextResponse.json({ success: true, newBalance });
} 