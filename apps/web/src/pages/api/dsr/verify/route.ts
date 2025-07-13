import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, request_id } = body;

    // Validate required fields
    if (!token || !request_id) {
      return NextResponse.json(
        { error: 'Missing token or request ID' },
        { status: 400 }
      );
    }

    // Validate token format
    if (token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
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

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Find the request with the verification token
    const { data: dsrRequest, error: queryError } = await supabaseClient
      .from('dsr_requests')
      .select('*')
      .eq('id', request_id)
      .eq('verification_token', token)
      .single();

    if (queryError) {
      if (queryError.code === 'PGRST116') {
        // No rows returned - invalid token/request combination
        return NextResponse.json(
          { 
            error: 'Invalid verification token or request not found',
            code: 'INVALID_TOKEN'
          },
          { status: 404 }
        );
      }
      
      // Log error for debugging - consider using proper logging service in production
      // console.error('Database error:', queryError);
      return NextResponse.json(
        { error: 'Failed to verify request' },
        { status: 500 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(dsrRequest.verification_expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json(
        { 
          error: 'Verification token has expired. Please submit a new request.',
          code: 'TOKEN_EXPIRED'
        },
        { status: 410 }
      );
    }

    // Check if already verified
    if (dsrRequest.status !== 'pending_verification') {
      return NextResponse.json(
        { 
          error: 'Request has already been verified or processed',
          code: 'ALREADY_VERIFIED',
          request: {
            id: dsrRequest.id,
            type: dsrRequest.type,
            status: dsrRequest.status,
            created_at: dsrRequest.created_at
          }
        },
        { status: 409 }
      );
    }

    // Update the request status to pending and clear verification fields
    const { data: updatedRequest, error: updateError } = await supabaseClient
      .from('dsr_requests')
      .update({
        status: 'pending',
        verification_token: null,
        verification_expires_at: null,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', request_id)
      .select()
      .single();

    if (updateError) {
      // Log error for debugging - consider using proper logging service in production
      // console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      );
    }

    // Create audit log entry
    try {
      await supabaseClient
        .from('dsr_audit_log')
        .insert({
          request_id: dsrRequest.id,
          action: 'email_verified',
          new_values: {
            status: 'pending',
            verified_at: new Date().toISOString(),
            verification_method: 'email_token'
          },
          ip_address: ip,
          user_agent: request.headers.get('user-agent')
        });
    } catch (auditError) {
      // Don't fail the verification if audit logging fails
      // Log error for debugging - consider using proper logging service in production
      // console.error('Audit log error:', auditError);
    }

    // Trigger automated processing via Edge Function
    try {
      const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-dsr-request`;
      const edgeResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          requestId: dsrRequest.id,
          type: dsrRequest.type,
          email: dsrRequest.email,
          priority: dsrRequest.priority,
        }),
      });

      if (!edgeResponse.ok) {
        // Log error for debugging - consider using proper logging service in production
        // console.error('Edge function error:', await edgeResponse.text());
        // Don't fail verification if edge function fails - the job can be processed later
      } else {
        // Log success for debugging - consider using proper logging service in production
        // console.log('DSR processing job queued successfully');
      }
    } catch (edgeError) {
      // Log error for debugging - consider using proper logging service in production
      // console.error('Edge function invocation error:', edgeError);
      // Continue - the request is verified and can be processed manually if needed
    }

    // Send confirmation email
    try {
      await sendVerificationConfirmationEmail(dsrRequest.email, dsrRequest.full_name, dsrRequest.id, dsrRequest.type);
    } catch (emailError) {
      // Log error for debugging - consider using proper logging service in production
      // console.error('Failed to send confirmation email:', emailError);
      // Don't fail verification if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. Your request is now being processed.',
      request: {
        id: updatedRequest.id,
        type: updatedRequest.type,
        email: updatedRequest.email,
        full_name: updatedRequest.full_name,
        status: updatedRequest.status,
        priority: updatedRequest.priority,
        created_at: updatedRequest.created_at,
        verified_at: updatedRequest.verified_at,
        data_types: updatedRequest.data_types,
        description: updatedRequest.description
      }
    });

  } catch (error) {
    // Log error for debugging - consider using proper logging service in production
    // console.error('DSR verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send verification confirmation email
 */
async function sendVerificationConfirmationEmail(
  email: string, 
  fullName: string, 
  requestId: string, 
  requestType: string
) {
  // Log email sending for debugging - consider using proper logging service in production
  // console.log(`Sending verification confirmation email to ${email}`);
  
  // In a real implementation, this would use your email service
  const emailContent = {
    to: email,
    subject: `Verification Complete - Your ${getRequestTypeLabel(requestType)} Request is Being Processed`,
    template: 'dsr_verification_confirmation',
    data: {
      fullName,
      requestId,
      requestType: getRequestTypeLabel(requestType),
      trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/privacy/rights/track?id=${requestId}`,
      supportEmail: 'privacy@mahardika.com',
      estimatedCompletion: getEstimatedCompletion(requestType),
    }
  };

  // Log email content for debugging - consider using proper logging service in production
  // console.log('Verification confirmation email prepared:', emailContent);
  
  // Mock email sending
  return { success: true, messageId: `confirm_${Date.now()}` };
}

/**
 * Get user-friendly label for request type
 */
function getRequestTypeLabel(type: string): string {
  switch (type) {
    case 'export': return 'Data Export';
    case 'delete': return 'Data Deletion';
    case 'rectify': return 'Data Rectification';
    default: return 'Data Rights';
  }
}

/**
 * Get estimated completion timeframe
 */
function getEstimatedCompletion(type: string): string {
  switch (type) {
    case 'export': return '10-20 business days';
    case 'delete': return '5-15 business days';
    case 'rectify': return '15-30 business days';
    default: return '10-30 business days';
  }
} 