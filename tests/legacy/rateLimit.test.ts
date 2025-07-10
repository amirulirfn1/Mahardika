/**
 * =============================================================================
 * Rate Limiting Tests - Mahardika Platform
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  RateLimiter,
  createRateLimiter,
  standardRateLimit,
  uploadRateLimit,
  aiMessageRateLimit,
  withRateLimit,
  checkRateLimit,
} from '@mah/core/security/rateLimit';

// Mock NextRequest
const createMockRequest = (
  options: {
    ip?: string;
    userAgent?: string;
    userId?: string;
  } = {}
) => {
  const headers = new Headers();
  if (options.ip) headers.set('x-forwarded-for', options.ip);
  if (options.userAgent) headers.set('user-agent', options.userAgent);
  if (options.userId) headers.set('x-user-id', options.userId);

  return {
    headers,
  } as NextRequest;
};

// Helper to wait for time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Rate Limiting Utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('RateLimiter Class', () => {
    it('should create a rate limiter with default config', () => {
      const limiter = createRateLimiter();
      expect(limiter).toBeInstanceOf(RateLimiter);
    });

    it('should allow requests within limit', async () => {
      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000, // 1 minute
      });

      const request = createMockRequest({ ip: '192.168.1.1' });

      // First 5 requests should succeed
      for (let i = 1; i <= 5; i++) {
        const result = await limiter.check(request);
        expect(result.success).toBe(true);
        expect(result.totalHits).toBe(i);
        expect(result.remaining).toBe(5 - i);
        expect(result.limit).toBe(5);
      }
    });

    it('should block requests that exceed limit', async () => {
      const limiter = createRateLimiter({
        requests: 3,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.2' });

      // First 3 requests should succeed
      for (let i = 1; i <= 3; i++) {
        const result = await limiter.check(request);
        expect(result.success).toBe(true);
      }

      // 4th request should fail
      const blockedResult = await limiter.check(request);
      expect(blockedResult.success).toBe(false);
      expect(blockedResult.totalHits).toBe(4);
      expect(blockedResult.remaining).toBe(0);
    });

    it('should reset after time window', async () => {
      const limiter = createRateLimiter({
        requests: 2,
        windowMs: 1000, // 1 second for testing
      });

      const request = createMockRequest({ ip: '192.168.1.3' });

      // Use up the limit
      await limiter.check(request);
      await limiter.check(request);

      const blockedResult = await limiter.check(request);
      expect(blockedResult.success).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(1100);

      // Should be allowed again
      const resetResult = await limiter.check(request);
      expect(resetResult.success).toBe(true);
      expect(resetResult.totalHits).toBe(1);
    });

    it('should generate different keys for different IPs', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const request1 = createMockRequest({ ip: '192.168.1.4' });
      const request2 = createMockRequest({ ip: '192.168.1.5' });

      // Both should be allowed as they have different IPs
      const result1 = await limiter.check(request1);
      const result2 = await limiter.check(request2);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it('should include user agent in key generation', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const request1 = createMockRequest({
        ip: '192.168.1.6',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      });
      const request2 = createMockRequest({
        ip: '192.168.1.6',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      });

      // Same IP but different user agents should get different limits
      const result1 = await limiter.check(request1);
      const result2 = await limiter.check(request2);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe('Error Response Generation', () => {
    it('should create proper error response', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
        message: 'Custom rate limit message',
      });

      const request = createMockRequest({ ip: '192.168.1.7' });

      // Use up the limit
      await limiter.check(request);
      const blockedResult = await limiter.check(request);

      const errorResponse = limiter.createErrorResponse(
        blockedResult,
        'test-request-id'
      );

      expect(errorResponse.status).toBe(429);

      const body = await errorResponse.json();
      expect(body.error).toBe('Custom rate limit message');
      expect(body.limit).toBe(1);
      expect(body.remaining).toBe(0);
      expect(body.requestId).toBe('test-request-id');
      expect(body.service).toBe('Mahardika Platform');
      expect(body.colors.navy).toBe('#0D1B2A');
      expect(body.colors.gold).toBe('#F4B400');

      expect(errorResponse.headers.get('Retry-After')).toBeTruthy();
      expect(errorResponse.headers.get('X-Mahardika-Service')).toBe(
        'rate-limiter'
      );
      expect(errorResponse.headers.get('RateLimit-Limit')).toBe('1');
      expect(errorResponse.headers.get('RateLimit-Remaining')).toBe('0');
    });

    it('should add headers to successful responses', async () => {
      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.8' });
      const result = await limiter.check(request);

      const response = NextResponse.json({ success: true });
      const enhancedResponse = limiter.addHeadersToResponse(response, result);

      expect(enhancedResponse.headers.get('RateLimit-Limit')).toBe('5');
      expect(enhancedResponse.headers.get('RateLimit-Remaining')).toBe('4');
      expect(enhancedResponse.headers.get('X-Mahardika-Service')).toBe(
        'rate-limiter'
      );
    });
  });

  describe('Predefined Rate Limiters', () => {
    it('should have correct configuration for standard rate limit', () => {
      // We can't directly test private properties, but we can test behavior
      const request = createMockRequest({ ip: '192.168.1.9' });

      expect(standardRateLimit).toBeInstanceOf(RateLimiter);
      // The standard rate limit should allow 20 requests per minute
    });

    it('should have upload-specific configuration', async () => {
      const request = createMockRequest({ ip: '192.168.1.10' });

      // Upload rate limiter should use upload-specific key generation
      const result1 = await uploadRateLimit.check(request);
      expect(result1.success).toBe(true);
      expect(result1.limit).toBe(20);
    });

    it('should have AI-specific configuration with user ID', async () => {
      const request = createMockRequest({
        ip: '192.168.1.11',
        userId: 'user-123',
      });

      const result = await aiMessageRateLimit.check(request);
      expect(result.success).toBe(true);
      expect(result.limit).toBe(20);
    });
  });

  describe('withRateLimit Higher-Order Function', () => {
    it('should allow requests within limit', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }));

      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      });

      const rateLimitedHandler = withRateLimit(limiter, mockHandler);
      const request = createMockRequest({ ip: '192.168.1.12' });

      const response = await rateLimitedHandler(request);

      expect(response.status).toBe(200);
      expect(mockHandler).toHaveBeenCalledWith(request);

      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it('should block requests that exceed limit', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }));

      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const rateLimitedHandler = withRateLimit(limiter, mockHandler);
      const request = createMockRequest({ ip: '192.168.1.13' });

      // First request should succeed
      const response1 = await rateLimitedHandler(request);
      expect(response1.status).toBe(200);

      // Second request should be blocked
      const response2 = await rateLimitedHandler(request);
      expect(response2.status).toBe(429);
      expect(mockHandler).toHaveBeenCalledTimes(1); // Handler should only be called once

      const body = await response2.json();
      expect(body.error).toContain('Too many requests');
      expect(body.service).toBe('Mahardika Platform');
    });

    it('should handle handler errors gracefully', async () => {
      const mockHandler = vi.fn().mockRejectedValue(new Error('Handler error'));

      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      });

      const rateLimitedHandler = withRateLimit(limiter, mockHandler);
      const request = createMockRequest({ ip: '192.168.1.14' });

      const response = await rateLimitedHandler(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe('Internal server error');
      expect(body.service).toBe('Mahardika Platform');
    });
  });

  describe('checkRateLimit Utility Function', () => {
    it('should return allowed for requests within limit', async () => {
      const limiter = createRateLimiter({
        requests: 3,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.15' });
      const check = await checkRateLimit(request, limiter);

      expect(check.allowed).toBe(true);
      expect(check.response).toBeUndefined();
      expect(check.result.success).toBe(true);
      expect(check.result.remaining).toBe(2);
    });

    it('should return not allowed for requests exceeding limit', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.16' });

      // Use up the limit
      await limiter.check(request);

      const check = await checkRateLimit(request, limiter);

      expect(check.allowed).toBe(false);
      expect(check.response).toBeInstanceOf(NextResponse);
      expect(check.result.success).toBe(false);

      if (check.response) {
        expect(check.response.status).toBe(429);
      }
    });
  });

  describe('Brand Color Integration', () => {
    it('should include Mahardika brand colors in error responses', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.17' });

      // Use up the limit
      await limiter.check(request);
      const blockedResult = await limiter.check(request);

      const errorResponse = limiter.createErrorResponse(blockedResult);
      const body = await errorResponse.json();

      expect(body.colors).toEqual({
        navy: '#0D1B2A',
        gold: '#F4B400',
      });

      expect(body.service).toBe('Mahardika Platform');
    });

    it('should include Mahardika service headers', async () => {
      const limiter = createRateLimiter({
        requests: 1,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.18' });

      // Use up the limit
      await limiter.check(request);
      const blockedResult = await limiter.check(request);

      const errorResponse = limiter.createErrorResponse(blockedResult);

      expect(errorResponse.headers.get('X-Mahardika-Service')).toBe(
        'rate-limiter'
      );
    });
  });

  describe('Performance and Memory Management', () => {
    it('should clean up expired entries', async () => {
      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 100, // Very short window for testing
      });

      const request = createMockRequest({ ip: '192.168.1.19' });

      // Make some requests
      await limiter.check(request);
      await limiter.check(request);

      // Wait for cleanup to occur
      vi.advanceTimersByTime(200);

      // Memory store should have cleaned up expired entries
      // We can't directly test this, but we can verify that new requests work
      const result = await limiter.check(request);
      expect(result.totalHits).toBe(1); // Should reset to 1 after cleanup
    });

    it('should handle concurrent requests correctly', async () => {
      const limiter = createRateLimiter({
        requests: 10,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: '192.168.1.20' });

      // Make multiple concurrent requests
      const promises = Array.from({ length: 5 }, () => limiter.check(request));
      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Total hits should be correct
      const finalResult = await limiter.check(request);
      expect(finalResult.totalHits).toBe(6);
      expect(finalResult.remaining).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing IP headers gracefully', async () => {
      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      });

      const request = createMockRequest(); // No IP headers

      const result = await limiter.check(request);
      expect(result.success).toBe(true);
      // Should use 'anonymous' as fallback
    });

    it('should handle malformed IP headers', async () => {
      const limiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      });

      const request = createMockRequest({ ip: 'malformed,ip,headers' });

      const result = await limiter.check(request);
      expect(result.success).toBe(true);
      // Should use first part of malformed header
    });

    it('should reset individual keys without affecting others', async () => {
      const limiter = createRateLimiter({
        requests: 2,
        windowMs: 60000,
      });

      const request1 = createMockRequest({ ip: '192.168.1.21' });
      const request2 = createMockRequest({ ip: '192.168.1.22' });

      // Use up limits for both
      await limiter.check(request1);
      await limiter.check(request1);
      await limiter.check(request2);

      // Reset only request1
      await limiter.reset(request1);

      // request1 should be reset, request2 should still have count
      const result1 = await limiter.check(request1);
      const result2 = await limiter.check(request2);

      expect(result1.totalHits).toBe(1); // Reset
      expect(result2.totalHits).toBe(2); // Not reset
    });
  });
});
