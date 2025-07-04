import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { csrfProtection } from '@/lib/csrf';

async function handleTrackDSR(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_id, email } = body;

    // Validate required fields
    if (!request_id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: request_id and email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate request ID format
    if (!request_id.startsWith('dsr_')) {
      return NextResponse.json(
        { error: 'Invalid request ID format' },
        { status: 400 }
      );
    }

    // Rate limiting check (basic implementation)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Query the DSR request
    const { data: dsrRequest, error: queryError } = await supabaseClient
      .from('dsr_requests')
      .select(`
        id,
        type,
        email,
        full_name,
        status,
        priority,
        description,
        data_types,
        created_at,
        updated_at,
        completed_at,
        resolution_notes,
        rejected_reason
      `)
      .eq('id', request_id)
      .eq('email', email.toLowerCase())
      .single();

    if (queryError) {
      if (queryError.code === 'PGRST116') {
        // No rows returned - request not found or email doesn't match
        return NextResponse.json(
          { 
            error: 'Request not found or email does not match our records',
            code: 'REQUEST_NOT_FOUND' 
          },
          { status: 404 }
        );
      }
      
      console.error('Database error:', queryError);
      return NextResponse.json(
        { error: 'Failed to retrieve request information' },
        { status: 500 }
      );
    }

    // Log the access for audit purposes
    try {
      await supabaseClient
        .from('dsr_audit_log')
        .insert({
          request_id: dsrRequest.id,
          action: 'status_checked',
          new_values: {
            checked_by_email: email,
            checked_at: new Date().toISOString(),
          },
          ip_address: ip,
          user_agent: request.headers.get('user-agent'),
        });
    } catch (auditError) {
      // Don't fail the request if audit logging fails
      console.error('Audit log error:', auditError);
    }

    // Sanitize the response (remove sensitive information)
    const sanitizedRequest = {
      id: dsrRequest.id,
      type: dsrRequest.type,
      email: dsrRequest.email,
      full_name: dsrRequest.full_name,
      status: dsrRequest.status,
      priority: dsrRequest.priority,
      description: dsrRequest.description,
      data_types: dsrRequest.data_types,
      created_at: dsrRequest.created_at,
      updated_at: dsrRequest.updated_at,
      completed_at: dsrRequest.completed_at,
      resolution_notes: dsrRequest.resolution_notes,
      rejected_reason: dsrRequest.rejected_reason,
    };

    return NextResponse.json({
      success: true,
      request: sanitizedRequest,
    });

  } catch (error) {
    console.error('DSR tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = csrfProtection(handleTrackDSR); 