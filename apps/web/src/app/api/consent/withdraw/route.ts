import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { csrfProtection } from '@/lib/csrf';

async function handleWithdrawConsent(request: NextRequest) {
  try {
    const body = await request.json();
    const { consent_type, version = '1.0' } = body;

    // Validate required fields
    if (!consent_type) {
      return NextResponse.json(
        { error: 'Missing consent_type' },
        { status: 400 }
      );
    }

    // Validate consent type
    if (!['marketing', 'analytics', 'functional', 'necessary'].includes(consent_type)) {
      return NextResponse.json(
        { error: 'Invalid consent_type' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: userData, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !userData.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Withdraw consent using the database function
    const { data, error: withdrawError } = await supabaseClient
      .rpc('withdraw_user_consent', {
        p_consent_type: consent_type,
        p_version: version,
      });

    if (withdrawError) {
      console.error('Database error:', withdrawError);
      return NextResponse.json(
        { error: 'Failed to withdraw consent' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No active consent found to withdraw' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${consent_type} consent withdrawn successfully`,
    });

  } catch (error) {
    console.error('Withdraw consent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = csrfProtection(handleWithdrawConsent); 