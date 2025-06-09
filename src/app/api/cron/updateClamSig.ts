import { NextRequest, NextResponse } from 'next/server';

// Edge Runtime configuration for Vercel
export const runtime = 'edge';

/**
 * ClamAV Signature Update Edge Function
 *
 * This function runs daily via cron to download the latest ClamAV signatures
 * and update the virus database for file scanning capabilities.
 *
 * Triggers:
 * - Cron: Daily at 2:00 AM UTC
 * - Manual: Can be triggered via API call with proper authentication
 */

interface ClamAVSignature {
  name: string;
  url: string;
  version?: string;
  lastModified?: string;
  size?: number;
}

interface UpdateResult {
  success: boolean;
  timestamp: string;
  signaturesUpdated: number;
  errors: string[];
  signatures: ClamAVSignature[];
  totalSize: number;
}

// ClamAV signature sources
const CLAM_AV_MIRRORS = [
  'https://database.clamav.net/',
  'https://db.local.clamav.net/',
  'https://pivotal.clamav.net/',
] as const;

// Signature files to download
const SIGNATURE_FILES = [
  'main.cvd', // Main virus database
  'daily.cvd', // Daily updates
  'bytecode.cvd', // Bytecode signatures
  'safebrowsing.cvd', // Safe browsing signatures
] as const;

// Configuration
const CONFIG = {
  maxRetries: 3,
  timeoutMs: 30000,
  maxFileSizeMB: 100,
  authToken: process.env.CLAM_UPDATE_AUTH_TOKEN,
  storageEndpoint: process.env.CLAM_STORAGE_ENDPOINT,
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
    console[level](`[${timestamp}] [ClamAV-Update] ${message}${logData}`);
  }
}

/**
 * Downloads a signature file from ClamAV mirrors with retry logic
 */
async function downloadSignature(
  filename: string,
  mirrors: readonly string[] = CLAM_AV_MIRRORS
): Promise<{
  success: boolean;
  data?: ArrayBuffer;
  error?: string;
  metadata?: any;
}> {
  for (const mirror of mirrors) {
    for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
      try {
        const url = `${mirror}${filename}`;
        log('debug', `Attempting to download ${filename}`, {
          mirror,
          attempt,
          url,
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          CONFIG.timeoutMs
        );

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mahardika-ClamAV-Updater/1.0',
            Accept: 'application/octet-stream',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check file size
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const sizeMB = parseInt(contentLength) / (1024 * 1024);
          if (sizeMB > CONFIG.maxFileSizeMB) {
            throw new Error(
              `File too large: ${sizeMB.toFixed(2)}MB > ${CONFIG.maxFileSizeMB}MB`
            );
          }
        }

        const data = await response.arrayBuffer();
        const metadata = {
          size: data.byteLength,
          lastModified: response.headers.get('last-modified'),
          etag: response.headers.get('etag'),
          contentType: response.headers.get('content-type'),
        };

        log('info', `Successfully downloaded ${filename}`, {
          mirror,
          attempt,
          size: `${(data.byteLength / 1024 / 1024).toFixed(2)}MB`,
        });

        return { success: true, data, metadata };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        log('warn', `Failed to download ${filename} from ${mirror}`, {
          attempt,
          error: errorMessage,
        });

        // If this was the last attempt with the last mirror, return error
        if (
          attempt === CONFIG.maxRetries &&
          mirror === mirrors[mirrors.length - 1]
        ) {
          return { success: false, error: errorMessage };
        }

        // Wait before retry (exponential backoff)
        if (attempt < CONFIG.maxRetries) {
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }
  }

  return { success: false, error: 'All mirrors and retries exhausted' };
}

/**
 * Stores the signature file in the configured storage
 */
async function storeSignature(
  filename: string,
  data: ArrayBuffer,
  metadata: any
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!CONFIG.storageEndpoint) {
      log('warn', 'No storage endpoint configured, skipping storage');
      return { success: true }; // Continue without storage in development
    }

    // Convert ArrayBuffer to base64 for storage
    const uint8Array = new Uint8Array(data);
    const base64Data = btoa(
      String.fromCharCode.apply(null, Array.from(uint8Array))
    );

    const storageResponse = await fetch(
      `${CONFIG.storageEndpoint}/clam-signatures/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: `Bearer ${CONFIG.authToken}`,
          'X-File-Size': data.byteLength.toString(),
          'X-Last-Modified': metadata.lastModified || '',
          'X-ETag': metadata.etag || '',
        },
        body: base64Data,
      }
    );

    if (!storageResponse.ok) {
      throw new Error(
        `Storage failed: ${storageResponse.status} ${storageResponse.statusText}`
      );
    }

    log('info', `Successfully stored ${filename}`, { size: data.byteLength });
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown storage error';
    log('error', `Failed to store ${filename}`, { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Validates signature file integrity
 */
function validateSignature(filename: string, data: ArrayBuffer): boolean {
  try {
    // Basic validation - check if it's a valid ClamAV signature file
    const uint8Array = new Uint8Array(data);

    // CVD files should start with specific magic bytes
    if (filename.endsWith('.cvd')) {
      // CVD files start with "ClamAV-VDB:" followed by version info
      const header = new TextDecoder().decode(uint8Array.slice(0, 50));
      if (!header.startsWith('ClamAV-VDB:')) {
        log('warn', `Invalid CVD header for ${filename}`, {
          header: header.substring(0, 20),
        });
        return false;
      }
    }

    // Check minimum file size (signatures should be at least a few KB)
    if (data.byteLength < 1024) {
      log('warn', `Signature file too small: ${filename}`, {
        size: data.byteLength,
      });
      return false;
    }

    log('debug', `Signature validation passed for ${filename}`, {
      size: data.byteLength,
    });
    return true;
  } catch (error) {
    log('error', `Signature validation failed for ${filename}`, { error });
    return false;
  }
}

/**
 * Main update function
 */
async function updateSignatures(): Promise<UpdateResult> {
  const startTime = Date.now();
  const result: UpdateResult = {
    success: false,
    timestamp: new Date().toISOString(),
    signaturesUpdated: 0,
    errors: [],
    signatures: [],
    totalSize: 0,
  };

  log('info', 'Starting ClamAV signature update process');

  try {
    // Download and process each signature file
    for (const filename of SIGNATURE_FILES) {
      log('info', `Processing signature file: ${filename}`);

      // Download the signature
      const downloadResult = await downloadSignature(filename);

      if (!downloadResult.success) {
        const error = `Failed to download ${filename}: ${downloadResult.error}`;
        result.errors.push(error);
        log('error', error);
        continue;
      }

      // Validate the signature
      if (!validateSignature(filename, downloadResult.data!)) {
        const error = `Invalid signature file: ${filename}`;
        result.errors.push(error);
        log('error', error);
        continue;
      }

      // Store the signature
      const storeResult = await storeSignature(
        filename,
        downloadResult.data!,
        downloadResult.metadata
      );

      if (!storeResult.success) {
        const error = `Failed to store ${filename}: ${storeResult.error}`;
        result.errors.push(error);
        log('error', error);
        continue;
      }

      // Track successful update
      result.signatures.push({
        name: filename,
        url: CLAM_AV_MIRRORS[0] + filename,
        version: downloadResult.metadata?.etag,
        lastModified: downloadResult.metadata?.lastModified,
        size: downloadResult.data!.byteLength,
      });

      result.signaturesUpdated++;
      result.totalSize += downloadResult.data!.byteLength;
    }

    // Mark as successful if at least one signature was updated
    result.success = result.signaturesUpdated > 0;

    const duration = Date.now() - startTime;
    const totalSizeMB = (result.totalSize / 1024 / 1024).toFixed(2);

    log('info', 'ClamAV signature update completed', {
      success: result.success,
      updated: result.signaturesUpdated,
      total: SIGNATURE_FILES.length,
      errors: result.errors.length,
      duration: `${duration}ms`,
      totalSize: `${totalSizeMB}MB`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Update process failed: ${errorMessage}`);
    log('error', 'ClamAV signature update process failed', {
      error: errorMessage,
    });
  }

  return result;
}

/**
 * Main Edge Function handler
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  log('info', 'ClamAV signature update triggered', {
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
      log('warn', 'Unauthorized update attempt', {
        requestId,
        error: validation.error,
      });
      return NextResponse.json(
        { error: validation.error, requestId },
        { status: 401 }
      );
    }

    // Perform the update
    const result = await updateSignatures();

    // Return appropriate response
    const status = result.success ? 200 : 500;
    const response = {
      ...result,
      requestId,
      duration: Date.now() - new Date(result.timestamp).getTime(),
    };

    log('info', 'Update request completed', {
      requestId,
      status,
      success: result.success,
      updated: result.signaturesUpdated,
    });

    return NextResponse.json(response, {
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    log('error', 'Update request failed', { requestId, error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST handler for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
