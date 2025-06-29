import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const quotations = await prisma.quotation.findMany({ where: { customer_id: id }, orderBy: { created_at: 'desc' } });
  return NextResponse.json(quotations);
} 