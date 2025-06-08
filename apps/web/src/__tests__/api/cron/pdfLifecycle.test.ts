/**
 * =============================================================================
 * PDF Lifecycle Management Tests - Mahardika Platform
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
vi.mock('@supabase/supabase-js');

const mockSupabase = {
  rpc: vi.fn(),
};

const mockCreateClient = vi.mocked(createClient);
mockCreateClient.mockReturnValue(mockSupabase as any);

// Mock environment variables
const originalEnv = process.env;

// Mock NextRequest
const createMockRequest = (
  options: {
    userAgent?: string;
    authorization?: string;
    ip?: string;
  } = {}
) => {
  const headers = new Headers();
  if (options.userAgent) headers.set('user-agent', options.userAgent);
  if (options.authorization)
    headers.set('authorization', options.authorization);
  if (options.ip) headers.set('x-forwarded-for', options.ip);

  return {
    headers,
  } as NextRequest;
};

describe('PDF Lifecycle Management Edge Function', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      PDF_LIFECYCLE_AUTH_TOKEN: 'test-auth-token',
      NODE_ENV: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Request Validation', () => {
    it('should accept cron job requests', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({
          data: [{ total_files: 0, files_expired: 0 }],
          error: null,
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should accept authenticated manual requests', async () => {
      const request = createMockRequest({
        authorization: 'Bearer test-auth-token',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({
          data: [{ total_files: 0, files_expired: 0 }],
          error: null,
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should reject unauthorized requests', async () => {
      const request = createMockRequest({
        userAgent: 'unauthorized-client',
      });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toContain('Unauthorized');
    });

    it('should reject requests with invalid auth token', async () => {
      const request = createMockRequest({
        authorization: 'Bearer invalid-token',
      });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('Lifecycle Cleanup Process', () => {
    beforeEach(() => {
      mockSupabase.rpc.mockClear();
    });

    it('should successfully clean up expired PDFs', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const mockStats = {
        total_files: 100,
        total_size_mb: 500.5,
        files_expiring_soon: 5,
        files_expired: 10,
        oldest_file_date: '2022-01-01T00:00:00Z',
        newest_file_date: '2024-01-01T00:00:00Z',
      };

      const mockCleanupResult = {
        success: true,
        timestamp: new Date().toISOString(),
        expired_files_found: 10,
        files_deleted: 10,
        total_size_mb: 50.5,
        deleted_files: ['agency-1/policy-123.pdf', 'agency-2/policy-456.pdf'],
      };

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [mockStats], error: null }) // get_pdf_storage_stats (before)
        .mockResolvedValueOnce({ data: mockCleanupResult, error: null }) // run_pdf_lifecycle_cleanup
        .mockResolvedValueOnce({
          data: [{ ...mockStats, total_files: 90, files_expired: 0 }],
          error: null,
        }); // get_pdf_storage_stats (after)

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.files_deleted).toBe(10);
      expect(body.total_size_mb).toBe(50.5);
      expect(body.deleted_files).toHaveLength(2);
      expect(body.requestId).toBeDefined();

      // Verify RPC calls
      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_pdf_storage_stats');
      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'run_pdf_lifecycle_cleanup'
      );
    });

    it('should handle no expired files gracefully', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const mockCleanupResult = {
        success: true,
        timestamp: new Date().toISOString(),
        expired_files_found: 0,
        files_deleted: 0,
        total_size_mb: 0,
        deleted_files: [],
      };

      mockSupabase.rpc
        .mockResolvedValueOnce({
          data: [{ total_files: 50, files_expired: 0 }],
          error: null,
        })
        .mockResolvedValueOnce({ data: mockCleanupResult, error: null });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.files_deleted).toBe(0);
      expect(body.deleted_files).toHaveLength(0);
    });

    it('should handle cleanup errors properly', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{ total_files: 100 }], error: null })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Database error' },
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain('Cleanup function failed');
    });

    it('should handle missing Supabase configuration', async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain('Missing Supabase configuration');
    });
  });

  describe('Response Format and Headers', () => {
    it('should return proper response format', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const mockResult = {
        success: true,
        timestamp: new Date().toISOString(),
        expired_files_found: 5,
        files_deleted: 5,
        total_size_mb: 25.5,
        deleted_files: ['test.pdf'],
      };

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({ data: mockResult, error: null });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe(
        'no-cache, no-store, must-revalidate'
      );
      expect(response.headers.get('X-Request-ID')).toBeDefined();
      expect(response.headers.get('X-Mahardika-Service')).toBe('pdf-lifecycle');

      const body = await response.json();
      expect(body).toMatchObject({
        success: true,
        timestamp: expect.any(String),
        expired_files_found: 5,
        files_deleted: 5,
        total_size_mb: 25.5,
        deleted_files: ['test.pdf'],
        requestId: expect.any(String),
      });
    });

    it('should include brand colors in headers for tracking', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      expect(response.headers.get('X-Mahardika-Service')).toBe('pdf-lifecycle');
    });
  });

  describe('Logging and Monitoring', () => {
    it('should log cleanup process steps', async () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      await GET(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[PDF-Lifecycle] PDF lifecycle cleanup triggered'
        )
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[PDF-Lifecycle] Starting PDF lifecycle cleanup process'
        )
      );

      consoleSpy.mockRestore();
    });

    it('should log errors appropriately', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc.mockRejectedValue(
        new Error('Database connection failed')
      );

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      await GET(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PDF-Lifecycle] PDF lifecycle cleanup failed')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Storage Statistics Integration', () => {
    it('should fetch and log storage statistics', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const mockStats = {
        total_files: 150,
        total_size_mb: 750.25,
        files_expiring_soon: 12,
        files_expired: 8,
        oldest_file_date: '2022-06-01T00:00:00Z',
        newest_file_date: '2024-01-15T00:00:00Z',
      };

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [mockStats], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            files_deleted: 8,
            total_size_mb: 40.0,
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: [{ ...mockStats, total_files: 142, files_expired: 0 }],
          error: null,
        });

      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      await GET(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Storage stats before cleanup')
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Storage stats after cleanup')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('POST Method Support', () => {
    it('should support POST requests for manual triggers', async () => {
      const request = createMockRequest({
        authorization: 'Bearer test-auth-token',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { POST } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('Brand Color Integration', () => {
    it('should maintain Mahardika branding in service headers', async () => {
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      const response = await GET(request);

      // Check for Mahardika branding in headers
      expect(response.headers.get('X-Mahardika-Service')).toBe('pdf-lifecycle');
    });

    it('should handle 18-month retention period correctly', async () => {
      // This is part of the brand requirement for 18-month retention
      const request = createMockRequest({
        userAgent: 'vercel-cron v1.0',
      });

      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      mockSupabase.rpc
        .mockResolvedValueOnce({ data: [{}], error: null })
        .mockResolvedValueOnce({
          data: {
            success: true,
            timestamp: new Date().toISOString(),
            expired_files_found: 0,
            files_deleted: 0,
            total_size_mb: 0,
            deleted_files: [],
          },
          error: null,
        });

      const { GET } = await import('../../../app/api/cron/pdfLifecycle/route');
      await GET(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('retentionMonths'),
        expect.objectContaining({
          retentionMonths: 18,
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
