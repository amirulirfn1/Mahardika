import { colors } from "@mahardika/ui";
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Edge Runtime configuration for Vercel
export const runtime = 'edge';

/**
 * =============================================================================
 * PDF Lifecycle Management Edge Function - Mahardika Platform
 * Brand Colors: Navy colors.navy, Gold colors.gold
 * =============================================================================
 *
 * This function runs daily via cron to automatically delete policy PDF files
 * that are older than 18 months, helping maintain storage efficiency and
 * compliance with data retention policies.
 *
 * Triggers:
 * - Cron: Daily at 3:00 AM UTC
 * - Manual: Can be triggered via API call with proper authentication
 */

interface LifecycleResult {
  success: boolean;
  timestamp: string;
  expired_files_found: number;
  files_deleted: number;
  total_size_mb: number;
  deleted_files: string[];
  error?: string;
  requestId: string;
}

// Configuration
const CONFIG = {
  authToken: process.env.PDF_LIFECYCLE_AUTH_TOKEN,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  retentionMonths: 18,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
} as const;

/**
 * Validates the incoming request
 */
function validateRequest(request: NextRequest): {
  valid: boolean;
  error?: string;
} {
  // Check if it's a cron job (Vercel sets specific headers)
  const isCronJob = request.headers.get('user-agent')?.includes('vercel-cron');

  // Check for manual trigger with authentication
  const authHeader = request.headers.get('authorization');
  const isAuthenticated = authHeader === `Bearer ${CONFIG.authToken}`;

  if (!isCronJob && !isAuthenticated) {
    return {
      valid: false,
      error:
        'Unauthorized. This endpoint requires cron trigger or valid authentication.',
    };
  }

  return { valid: true };
}

/**
 * Logs messages with appropriate level
 */
function log(
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  data?: any
) {
  const timestamp = new Date().toISOString();
  const logData = data ? ` | ${JSON.stringify(data)}` : '';

  if (CONFIG.logLevel === 'debug' || level !== 'debug') {
    // no-op
  }
}

/**
 * Creates Supabase client with service role key
 */
function createSupabaseClient() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(CONFIG.supabaseUrl, CONFIG.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Gets storage statistics before cleanup
 */
async function getStorageStats(supabase: any): Promise<any> {
  try {
    const { data, error } = await supabase.rpc('get_pdf_storage_stats');

    if (error) {
      log('warn', 'Failed to get storage stats', { error: error.message });
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    log('error', 'Error fetching storage stats', { error });
    return null;
  }
}

/**
 * Runs the PDF lifecycle cleanup process
 */
async function runLifecycleCleanup(): Promise<
  Omit<LifecycleResult, 'requestId'>
> {
  const startTime = Date.now();

  try {
    log('info', 'Starting PDF lifecycle cleanup process', {
      retentionMonths: CONFIG.retentionMonths,
    });

    const supabase = createSupabaseClient();

    // Get storage stats before cleanup
    const statsBefore = await getStorageStats(supabase);
    if (statsBefore) {
      log('info', 'Storage stats before cleanup', statsBefore);
    }

    // Run the cleanup function
    const { data: result, error } = await supabase.rpc(
      'run_pdf_lifecycle_cleanup'
    );

    if (error) {
      throw new Error(`Cleanup function failed: ${error.message}`);
    }

    const duration = Date.now() - startTime;

    log('info', 'PDF lifecycle cleanup completed', {
      ...result,
      duration: `${duration}ms`,
    });

    // Get storage stats after cleanup
    const statsAfter = await getStorageStats(supabase);
    if (statsAfter) {
      log('info', 'Storage stats after cleanup', statsAfter);
    }

    return {
      success: result.success,
      timestamp: result.timestamp,
      expired_files_found: result.expired_files_found || 0,
      files_deleted: result.files_deleted || 0,
      total_size_mb: result.total_size_mb || 0,
      deleted_files: result.deleted_files || [],
      ...(result.error && { error: result.error }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const duration = Date.now() - startTime;

    log('error', 'PDF lifecycle cleanup failed', {
      error: errorMessage,
      duration: `${duration}ms`,
    });

    return {
      success: false,
      timestamp: new Date().toISOString(),
      expired_files_found: 0,
      files_deleted: 0,
      total_size_mb: 0,
      deleted_files: [],
      error: errorMessage,
    };
  }
}

/**
 * Sends notification about cleanup results (if configured)
 */
async function sendCleanupNotification(result: LifecycleResult): Promise<void> {
  try {
    // Only send notifications for significant events
    if (result.files_deleted > 0 || !result.success) {
      log('info', 'Cleanup notification', {
        files_deleted: result.files_deleted,
        total_size_mb: result.total_size_mb,
        success: result.success,
      });

      // In a real implementation, you might send emails, Slack notifications, etc.
      // For now, we just log the notification
    }
  } catch (error) {
    log('warn', 'Failed to send cleanup notification', { error });
  }
}

/**
 * Main Edge Function handler
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  log('info', 'PDF lifecycle cleanup triggered', {
    requestId,
    userAgent: request.headers.get('user-agent'),
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip'),
  });

  try {
    // Validate the request
    const validation = validateRequest(request);
    if (!validation.valid) {
      log('warn', 'Unauthorized cleanup attempt', {
        requestId,
        error: validation.error,
      });
      return NextResponse.json(
        { error: validation.error, requestId },
        { status: 401 }
      );
    }

    // Perform the cleanup
    const result = await runLifecycleCleanup();

    const response: LifecycleResult = {
      ...result,
      requestId,
    };

    // Send notification about cleanup results
    await sendCleanupNotification(response);

    // Return appropriate response
    const status = result.success ? 200 : 500;

    log('info', 'Lifecycle cleanup request completed', {
      requestId,
      status,
      success: result.success,
      files_deleted: result.files_deleted,
    });

    return NextResponse.json(response, {
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId,
        'X-Mahardika-Service': 'pdf-lifecycle',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    log('error', 'Lifecycle cleanup request failed', {
      requestId,
      error: errorMessage,
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        requestId,
        timestamp: new Date().toISOString(),
        expired_files_found: 0,
        files_deleted: 0,
        total_size_mb: 0,
        deleted_files: [],
      } as LifecycleResult,
      { status: 500 }
    );
  }
}

// POST handler for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
