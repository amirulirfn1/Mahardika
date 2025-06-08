/**
 * =============================================================================
 * Rate Limiting Utility - Mahardika Platform
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
export interface RateLimitConfig {
  requests: number; // Number of requests allowed
  windowMs: number; // Time window in milliseconds
  keyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  requestWasSuccessful?: (
    request: NextRequest,
    response: NextResponse
  ) => boolean;
}

// Rate limit store interface
interface RateLimitStore {
  incr(key: string): Promise<number>;
  decrement(key: string): Promise<void>;
  resetKey(key: string): Promise<void>;
  resetAll(): Promise<void>;
  getExpiryTime(key: string): Promise<Date | undefined>;
}

// In-memory store implementation for Edge Functions
class MemoryStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: Date }>();
  private windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  async incr(key: string): Promise<number> {
    const now = new Date();
    const existing = this.store.get(key);

    // Clean up expired entries
    if (existing && existing.resetTime < now) {
      this.store.delete(key);
    }

    const current = this.store.get(key);
    if (!current) {
      const resetTime = new Date(now.getTime() + this.windowMs);
      this.store.set(key, { count: 1, resetTime });
      return 1;
    }

    current.count++;
    this.store.set(key, current);
    return current.count;
  }

  async decrement(key: string): Promise<void> {
    const current = this.store.get(key);
    if (current && current.count > 0) {
      current.count--;
      this.store.set(key, current);
    }
  }

  async resetKey(key: string): Promise<void> {
    this.store.delete(key);
  }

  async resetAll(): Promise<void> {
    this.store.clear();
  }

  async getExpiryTime(key: string): Promise<Date | undefined> {
    const current = this.store.get(key);
    return current?.resetTime;
  }

  // Cleanup expired entries periodically
  cleanup(): void {
    const now = new Date();
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limit result
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  totalHits: number;
}

// Create a rate limiter class
export class RateLimiter {
  private store: RateLimitStore;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: request => this.getDefaultKey(request),
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
      ...config,
    };
    this.store = new MemoryStore(this.config.windowMs);

    // Set up cleanup interval for memory store
    if (this.store instanceof MemoryStore) {
      setInterval(() => {
        (this.store as MemoryStore).cleanup();
      }, this.config.windowMs);
    }
  }

  private getDefaultKey(request: NextRequest): string {
    // Try to get IP from various headers
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-client-ip') ||
      'anonymous';

    // Include user agent for additional uniqueness
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const userAgentHash = this.simpleHash(userAgent);

    return `${ip}:${userAgentHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async check(request: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(request);
    const totalHits = await this.store.incr(key);
    const resetTime =
      (await this.store.getExpiryTime(key)) ||
      new Date(Date.now() + this.config.windowMs);

    const success = totalHits <= this.config.requests;
    const remaining = Math.max(0, this.config.requests - totalHits);

    return {
      success,
      limit: this.config.requests,
      remaining,
      resetTime,
      totalHits,
    };
  }

  async reset(request: NextRequest): Promise<void> {
    const key = this.config.keyGenerator!(request);
    await this.store.resetKey(key);
  }

  createErrorResponse(
    result: RateLimitResult,
    requestId?: string
  ): NextResponse {
    const retryAfter = Math.ceil(
      (result.resetTime.getTime() - Date.now()) / 1000
    );

    const response = NextResponse.json(
      {
        error: this.config.message,
        message: `Rate limit exceeded. You can make ${this.config.requests} requests per ${this.config.windowMs / 1000 / 60} minutes.`,
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.resetTime.toISOString(),
        retryAfter,
        requestId,
        // Mahardika branding
        service: 'Mahardika Platform',
        colors: {
          navy: '#0D1B2A',
          gold: '#F4B400',
        },
      },
      {
        status: 429,
        headers: this.createHeaders(result, retryAfter),
      }
    );

    return response;
  }

  private createHeaders(
    result: RateLimitResult,
    retryAfter: number
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Retry-After': retryAfter.toString(),
      'X-Mahardika-Service': 'rate-limiter',
    };

    if (this.config.standardHeaders) {
      headers['RateLimit-Limit'] = result.limit.toString();
      headers['RateLimit-Remaining'] = result.remaining.toString();
      headers['RateLimit-Reset'] = result.resetTime.toISOString();
    }

    if (this.config.legacyHeaders) {
      headers['X-RateLimit-Limit'] = result.limit.toString();
      headers['X-RateLimit-Remaining'] = result.remaining.toString();
      headers['X-RateLimit-Reset'] = result.resetTime.toISOString();
    }

    return headers;
  }

  addHeadersToResponse(
    response: NextResponse,
    result: RateLimitResult
  ): NextResponse {
    const retryAfter = Math.ceil(
      (result.resetTime.getTime() - Date.now()) / 1000
    );
    const headers = this.createHeaders(result, retryAfter);

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}

// Default rate limiters for common use cases
export const createRateLimiter = (config: Partial<RateLimitConfig> = {}) => {
  return new RateLimiter({
    requests: 20, // 20 requests
    windowMs: 60 * 1000, // per minute
    ...config,
  });
};

// Predefined rate limiters
export const standardRateLimit = createRateLimiter({
  requests: 20,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many requests. Please wait before trying again.',
});

export const strictRateLimit = createRateLimiter({
  requests: 10,
  windowMs: 60 * 1000, // 1 minute
  message: 'Rate limit exceeded. This endpoint has strict limits.',
});

export const uploadRateLimit = createRateLimiter({
  requests: 20,
  windowMs: 60 * 1000, // 1 minute
  message:
    'Upload rate limit exceeded. Please wait before uploading more files.',
  keyGenerator: request => {
    // For uploads, be more strict and include the endpoint
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    return `upload:${ip}`;
  },
});

export const aiMessageRateLimit = createRateLimiter({
  requests: 20,
  windowMs: 60 * 1000, // 1 minute
  message:
    'AI message rate limit exceeded. Please wait before sending more messages.',
  keyGenerator: request => {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    const userId = request.headers.get('x-user-id') || 'anonymous';
    return `ai:${ip}:${userId}`;
  },
});

// Higher-order function to wrap handlers with rate limiting
export function withRateLimit<T extends any[]>(
  rateLimiter: RateLimiter,
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();

    try {
      // Check rate limit
      const result = await rateLimiter.check(request);

      if (!result.success) {
        console.warn(`[RateLimit] Request blocked - ${requestId}`, {
          limit: result.limit,
          remaining: result.remaining,
          totalHits: result.totalHits,
          ip:
            request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        });

        return rateLimiter.createErrorResponse(result, requestId);
      }

      // Call the original handler
      const response = await handler(request, ...args);

      // Add rate limit headers to successful responses
      return rateLimiter.addHeadersToResponse(response, result);
    } catch (error) {
      console.error(
        `[RateLimit] Error in rate-limited handler - ${requestId}`,
        error
      );

      // Return a generic error response
      return NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
          service: 'Mahardika Platform',
        },
        { status: 500 }
      );
    }
  };
}

// Utility function for manual rate limiting in handlers
export async function checkRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter
): Promise<{
  allowed: boolean;
  response?: NextResponse;
  result: RateLimitResult;
}> {
  const result = await rateLimiter.check(request);

  if (!result.success) {
    return {
      allowed: false,
      response: rateLimiter.createErrorResponse(result),
      result,
    };
  }

  return {
    allowed: true,
    result,
  };
}

// Export types
export type { RateLimitConfig, RateLimitResult, RateLimitStore };
