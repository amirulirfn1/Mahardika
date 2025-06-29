import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const orderId = formData.get('orderId') as string | null;

  if (!file || !orderId) {
    return NextResponse.json({ error: 'file and orderId required' }, { status: 400 });
  }

  // validate mime
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    return NextResponse.json({ error: 'Only jpg/png allowed' }, { status: 400 });
  }

  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  const fileExt = file.type === 'image/png' ? 'png' : 'jpg';
  const filePath = `${orderId}_${Date.now()}.${fileExt}`;

  // Upload to bucket
  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file.stream(), {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = await supabase.storage.from('payment-proofs').getPublicUrl(filePath);
  const publicUrl = data?.publicUrl;

  // Update order
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      proof_url: publicUrl,
      state: 'CLEARED',
      payment_status: 'Paid',
    },
  });

  return NextResponse.json(updated);
} 