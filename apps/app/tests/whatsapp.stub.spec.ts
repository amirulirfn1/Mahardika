import { describe, it, expect } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getAdmin(): Promise<SupabaseClient> {
  // @ts-ignore service role
  return createClient(url, serviceRole);
}

describe.skip('WhatsApp stub provider', () => {
  it('creates an outbound_messages row (smoke)', async () => {
    const admin = await getAdmin();
    if (!url || !serviceRole) return;
    const agencies = await admin.from('agencies').select('id').limit(1);
    const agencyId = agencies.data?.[0]?.id as string | undefined;
    if (!agencyId) return;
    const { data, error } = await admin
      .from('outbound_messages')
      .insert({ agency_id: agencyId, channel: 'whatsapp', to_number: '60123456789', body: 'hello', status: 'sent' })
      .select('id')
      .single();
    expect(error).toBeFalsy();
    expect(data?.id).toBeTruthy();
  });
});


