import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/planLimits';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const agencyId = formData.get('agencyId') as string | null;
  const customerId = formData.get('customerId') as string | null;
  if (!file || !agencyId || !customerId) return NextResponse.json({ error: 'file, agencyId, customerId required' }, { status: 400 });

  // plan check
  const agency = await prisma.agency.findUnique({ where: { id: agencyId }, select: { plan_type: true } });
  if (!agency) return NextResponse.json({ error: 'agency not found' }, { status: 404 });
  if (!PLAN_LIMITS[agency.plan_type as keyof typeof PLAN_LIMITS].quotes) {
    return NextResponse.json({ error: 'Quotation upload not allowed for plan' }, { status: 402 });
  }

  // upload to bucket
  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: { get: n => cookieStore.get(n)?.value },
  });
  const filePath = `${agencyId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('quotations').upload(filePath, file.stream(), { contentType: file.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = await supabase.storage.from('quotations').getPublicUrl(filePath);
  const publicUrl = data?.publicUrl;

  await prisma.$transaction([
    prisma.quotation.create({ data: { agency_id: agencyId, customer_id: customerId, file_url: publicUrl } }) as any,
  ]);

  return NextResponse.json({ success: true, url: publicUrl });
} 