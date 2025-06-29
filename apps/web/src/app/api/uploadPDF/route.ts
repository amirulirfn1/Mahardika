import { colors } from "@mahardika/ui";
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withRateLimit, uploadRateLimit } from '@/lib/rateLimit';

// Edge Runtime configuration for Vercel
export const runtime = 'edge';

/**
 * =============================================================================
 * PDF Upload Edge Function - Mahardika Platform
 * Brand Colors: Navy colors.navy, Gold colors.gold
 * =============================================================================
 *
 * This function handles secure PDF uploads to the policy-pdfs bucket with:
 * - Rate limiting: 20 requests per minute
 * - File validation: PDF only, max 50MB
 * - Agency-based folder organization
 * - Virus scanning integration (future)
 * - Audit logging
 */

interface UploadResult {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  agencyId?: string;
  message?: string;
  error?: string;
  requestId: string;
}

// Configuration
const CONFIG = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: ['application/pdf'],
  bucketName: 'policy-pdfs',
  virusScanEnabled: process.env.ENABLE_VIRUS_SCAN === 'true',
} as const;

/**
 * Validates the uploaded file
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${CONFIG.maxFileSize / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (!CONFIG.allowedMimeTypes.includes(file.type as 'application/pdf')) {
    return {
      valid: false,
      error: `Invalid file type. Only PDF files are allowed.`,
    };
  }

  // Check file name
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return {
      valid: false,
      error: `File must have a .pdf extension.`,
    };
  }

  // Basic security checks
  if (file.name.includes('../') || file.name.includes('..\\')) {
    return {
      valid: false,
      error: `Invalid file name. Path traversal attempts are not allowed.`,
    };
  }

  return { valid: true };
}

/**
 * Gets user's agency ID from authentication
 */
async function getUserAgencyId(
  request: NextRequest,
  supabase: any
): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Get user's agency ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('agency_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    return userData.agency_id;
  } catch (error) {
    
    return null;
  }
}

/**
 * Generates a secure file name
 */
function generateSecureFileName(
  originalName: string,
  agencyId: string
): string {
  const timestamp = Date.now();
  const randomString = crypto.randomUUID().slice(0, 8);
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();

  return `${agencyId}/${timestamp}_${randomString}_${sanitizedName}`;
}

/**
 * Uploads file to Supabase storage
 */
async function uploadToStorage(
  file: File,
  fileName: string,
  supabase: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(CONFIG.bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size,
        },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Gets signed URL for secure file access
 */
async function getSignedFileUrl(
  fileName: string,
  supabase: any
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(CONFIG.bucketName)
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    if (error) {
      
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    
    return null;
  }
}

/**
 * Logs upload activity for audit purposes
 */
async function logUploadActivity(
  fileName: string,
  fileSize: number,
  agencyId: string,
  success: boolean,
  supabase: any,
  error?: string
): Promise<void> {
  try {
    await supabase.rpc('audit_pdf_lifecycle', {
      action_type: success ? 'pdf_uploaded' : 'pdf_upload_failed',
      file_name: fileName,
      file_size_bytes: fileSize,
      agency_id_param: agencyId,
    });
  } catch (auditError) {
    // no-op
  }
}

/**
 * Main upload handler (without rate limiting)
 */
async function handleUpload(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  try {
    // Validate configuration
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
          requestId,
        } as UploadResult,
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseServiceKey
    );

    // Get user's agency ID
    const agencyId = await getUserAgencyId(request, supabase);
    if (!agencyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in to upload files.',
          requestId,
        } as UploadResult,
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided. Please select a PDF file to upload.',
          requestId,
        } as UploadResult,
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          requestId,
        } as UploadResult,
        { status: 400 }
      );
    }

    // Generate secure file name
    const secureFileName = generateSecureFileName(file.name, agencyId);

    // Upload to storage
    const uploadResult = await uploadToStorage(file, secureFileName, supabase);

    if (!uploadResult.success) {
      await logUploadActivity(
        secureFileName,
        file.size,
        agencyId,
        false,
        supabase,
        uploadResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error: uploadResult.error || 'Upload failed',
          requestId,
        } as UploadResult,
        { status: 500 }
      );
    }

    // Get signed URL for secure access
    const signedUrl = await getSignedFileUrl(secureFileName, supabase);

    // Log successful upload
    await logUploadActivity(
      secureFileName,
      file.size,
      agencyId,
      true,
      supabase
    );

    

    return NextResponse.json(
      {
        success: true,
        fileName: secureFileName,
        fileUrl: signedUrl || `${CONFIG.bucketName}/${secureFileName}`,
        fileSize: file.size,
        agencyId,
        message: 'File uploaded successfully',
        requestId,
      } as UploadResult,
      {
        status: 200,
        headers: {
          'X-Mahardika-Service': 'pdf-upload',
          'X-Request-ID': requestId,
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Upload processing failed';

    

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        requestId,
      } as UploadResult,
      { status: 500 }
    );
  }
}

// Export rate-limited handlers
export const POST = withRateLimit(uploadRateLimit, handleUpload);

// GET method for endpoint info (also rate limited)
export const GET = withRateLimit(
  uploadRateLimit,
  async (request: NextRequest) => {
    return NextResponse.json(
      {
        service: 'Mahardika PDF Upload',
        version: '1.0.0',
        limits: {
          maxFileSize: `${CONFIG.maxFileSize / 1024 / 1024}MB`,
          allowedTypes: CONFIG.allowedMimeTypes,
          rateLimit: '20 requests per minute',
        },
        colors: {
          navy: 'colors.navy',
          gold: 'colors.gold',
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'X-Mahardika-Service': 'pdf-upload',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  }
);
