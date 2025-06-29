import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  let where: any = {};
  if (state === 'pending') {
    where = { state: { not: 'CLEARED' } };
  }
  const orders = await prisma.order.findMany({ where, orderBy: { created_at: 'desc' } });
  return NextResponse.json(orders);
} 