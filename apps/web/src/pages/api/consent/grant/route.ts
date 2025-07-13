import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { csrfProtection } from '@mah/core/security/csrf';

async function handleGrantConsent(request: NextRequest) {
  try {
    const body = await request.json();
    const { consent_type, version = '1.0', metadata = {}, expires_at } = body;

    // Validate required fields
    if (!consent_type) {
      return NextResponse.json(
        { error: 'Missing consent_type' },
        { status: 400 }
      );
    }

    // Validate consent type
    if (
      !['marketing', 'analytics', 'functional', 'necessary'].includes(
        consent_type
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid consent_type' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: userData, error: authError } =
      await supabaseClient.auth.getUser();

    if (authError || !userData.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Add request metadata
    const enrichedMetadata = {
      ...metadata,
      ip_address:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip'),
      request_id: crypto.randomUUID(),
    };

    // Grant consent using the database function
    const { data, error: grantError } = await supabaseClient.rpc(
      'grant_user_consent',
      {
        p_consent_type: consent_type,
        p_version: version,
        p_metadata: enrichedMetadata,
        p_expires_at: expires_at,
      }
    );

    if (grantError) {
      console.error('Database error:', grantError);
      return NextResponse.json(
        { error: 'Failed to grant consent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      consent_id: data,
      message: `${consent_type} consent granted successfully`,
    });
  } catch (error) {
    console.error('Grant consent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = csrfProtection(handleGrantConsent);
