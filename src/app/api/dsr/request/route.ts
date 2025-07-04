import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { csrfProtection } from '@/lib/csrf';
import crypto from 'crypto';

interface DSRFormData {
  type: 'export' | 'delete' | 'rectify';
  email: string;
  fullName: string;
  description: string;
  dataTypes: string[];
  urgency: 'low' | 'normal' | 'high';
  verificationDocument?: File;
}

async function handleDSRRequest(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    const type = formData.get('type') as string;
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;
    const description = formData.get('description') as string;
    const dataTypesStr = formData.get('dataTypes') as string;
    const urgency = formData.get('urgency') as string;
    const verificationDocument = formData.get('verificationDocument') as File | null;

    // Validate required fields
    if (!type || !email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate request type
    if (!['export', 'delete', 'rectify'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
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

    // Parse data types
    let dataTypes: string[] = [];
    try {
      dataTypes = JSON.parse(dataTypesStr || '[]');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid data types format' },
        { status: 400 }
      );
    }

    if (dataTypes.length === 0) {
      return NextResponse.json(
        { error: 'At least one data type must be selected' },
        { status: 400 }
      );
    }

    // Validate urgency
    if (!['low', 'normal', 'high'].includes(urgency)) {
      return NextResponse.json(
        { error: 'Invalid urgency level' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check for recent requests from the same email (prevent spam)
    const { data: recentRequests, error: recentError } = await supabaseClient
      .from('dsr_requests')
      .select('id, created_at')
      .eq('email', email.toLowerCase())
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(5);

    if (recentError) {
      console.error('Error checking recent requests:', recentError);
    } else if (recentRequests && recentRequests.length >= 3) {
      return NextResponse.json(
        { 
          error: 'Too many requests from this email address. Please wait 24 hours before submitting another request.',
          code: 'RATE_LIMITED'
        },
        { status: 429 }
      );
    }

    // Generate unique request ID
    const requestId = `dsr_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Handle verification document upload if provided
    let documentInfo = null;
    if (verificationDocument && verificationDocument.size > 0) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(verificationDocument.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, PNG, GIF, WebP, and PDF files are allowed.' },
          { status: 400 }
        );
      }

      if (verificationDocument.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      // In a real implementation, upload to secure storage (S3, etc.)
      // For now, we'll just store file metadata
      documentInfo = {
        name: verificationDocument.name,
        type: verificationDocument.type,
        size: verificationDocument.size,
        upload_path: `dsr_documents/${requestId}/${verificationDocument.name}`,
        uploaded_at: new Date().toISOString()
      };
    }

    // Determine priority based on urgency and request type
    let priority = 'normal';
    if (urgency === 'high' || type === 'delete') {
      priority = 'high';
    } else if (urgency === 'low') {
      priority = 'low';
    }

    // Create DSR request record
    const { data: dsrRequest, error: insertError } = await supabaseClient
      .from('dsr_requests')
      .insert({
        id: requestId,
        type,
        email: email.toLowerCase(),
        full_name: fullName,
        description: description || '',
        data_types: dataTypes,
        priority,
        status: 'pending_verification',
        verification_token: verificationToken,
        verification_expires_at: verificationExpiry.toISOString(),
        document_info: documentInfo,
        metadata: {
          submitted_ip: ip,
          user_agent: userAgent,
          urgency_requested: urgency,
          submission_timestamp: new Date().toISOString(),
          form_version: '2.0'
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create request' },
        { status: 500 }
      );
    }

    // Create audit log entry
    await supabaseClient
      .from('dsr_audit_log')
      .insert({
        request_id: requestId,
        action: 'request_submitted',
        new_values: {
          type,
          email: email.toLowerCase(),
          data_types: dataTypes,
          priority,
          has_verification_document: !!documentInfo
        },
        ip_address: ip,
        user_agent: userAgent
      });

    // Send verification email
    try {
      await sendVerificationEmail(email, fullName, requestId, verificationToken, type);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      
      // Delete the request if email sending fails (optional - depends on your requirements)
      await supabaseClient
        .from('dsr_requests')
        .delete()
        .eq('id', requestId);

      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your request has been submitted successfully. Please check your email to verify your identity.',
      requestId,
      nextSteps: [
        'Check your email inbox for a verification message',
        'Click the verification link in the email',
        'Your request will be processed once verified',
        'You will receive updates via email'
      ],
      estimatedProcessingTime: getEstimatedProcessingTime(type, priority),
      trackingUrl: `/privacy/rights/track?id=${requestId}`
    });

  } catch (error) {
    console.error('DSR request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send verification email to confirm identity
 */
async function sendVerificationEmail(
  email: string, 
  fullName: string, 
  requestId: string, 
  verificationToken: string, 
  requestType: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/privacy/rights/verify?token=${verificationToken}&id=${requestId}`;
  
  // In a real implementation, this would use your email service
  // For now, we'll log the email content
  const emailContent = {
    to: email,
    subject: `Verify Your Data ${getRequestTypeLabel(requestType)} Request - ${requestId}`,
    template: 'dsr_verification',
    data: {
      fullName,
      requestId,
      requestType: getRequestTypeLabel(requestType),
      verificationUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      supportEmail: 'privacy@mahardika.com'
    }
  };

  console.log('Verification email prepared:', emailContent);
  
  // Mock email sending - replace with actual email service
  return Promise.resolve({ success: true, messageId: `verify_${Date.now()}` });
}

/**
 * Get user-friendly label for request type
 */
function getRequestTypeLabel(type: string): string {
  switch (type) {
    case 'export': return 'Export';
    case 'delete': return 'Deletion';
    case 'rectify': return 'Rectification';
    default: return 'Rights';
  }
}

/**
 * Get estimated processing time based on type and priority
 */
function getEstimatedProcessingTime(type: string, priority: string): string {
  if (priority === 'high' || type === 'delete') {
    return '5-10 business days';
  } else if (priority === 'low') {
    return '20-30 business days';
  } else {
    return '10-20 business days';
  }
}

export const POST = csrfProtection(handleDSRRequest); 