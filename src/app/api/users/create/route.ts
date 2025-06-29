import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/planLimits';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, agency_id } = body;
  if (!email || !agency_id) {
    return NextResponse.json({ error: 'email and agency_id required' }, { status: 400 });
  }
  // fetch agency & plan
  const agency = await prisma.agency.findUnique({ where: { id: agency_id }, select: { plan_type: true } });
  if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
  const limit = PLAN_LIMITS[agency.plan_type as keyof typeof PLAN_LIMITS].staff;
  const staffCount = await prisma.user.count({ where: { agency_id } });
  if (staffCount >= limit) {
    return NextResponse.json({ error: 'Staff limit reached', limit }, { status: 402 });
  }
  // create user (passwordless invitation not handled)
  const created = await prisma.user.create({ data: { email, name: name ?? email, agency_id } });
  return NextResponse.json(created, { status: 201 });
} 