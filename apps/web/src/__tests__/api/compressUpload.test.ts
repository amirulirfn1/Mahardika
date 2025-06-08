/**
 * =============================================================================
 * Tests for PDF Compress & Upload Edge Function - Mahardika Platform
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/compressUpload/route';

// Mock dependencies
jest.mock('@/lib/rateLimit', () => ({
  withRateLimit: jest.fn((limiter, handler) => handler),
  uploadRateLimit: jest.fn(),
}));

const mockSupabaseClient = {
  auth: { getUser: jest.fn() },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      createSignedUrl: jest.fn(),
    })),
  },
  rpc: jest.fn(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

Object.defineProperty(global, 'crypto', {
  value: { randomUUID: jest.fn(() => 'test-uuid-123') },
});

describe('/api/compressUpload', () => {
  beforeEach(() => {
    process.env = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
      ENABLE_VIRUS_SCAN: 'true',
      ENABLE_PDF_COMPRESSION: 'true',
    };
    jest.clearAllMocks();
  });

  test('should reject unauthenticated requests', async () => {
    const formData = new FormData();
    formData.append(
      'file',
      new File(['test'], 'test.pdf', { type: 'application/pdf' })
    );

    const request = new NextRequest('http://localhost/api/compressUpload', {
      method: 'POST',
      body: formData,
    });

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('No user'),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.success).toBe(false);
  });

  test('should successfully upload valid PDF', async () => {
    const formData = new FormData();
    formData.append(
      'file',
      new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' })
    );

    const request = new NextRequest('http://localhost/api/compressUpload', {
      method: 'POST',
      body: formData,
      headers: { Authorization: 'Bearer test-token' },
    });

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockSupabaseClient
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: { agency_id: 'agency-123' },
        error: null,
      });

    mockSupabaseClient.storage.from().upload.mockResolvedValue({
      data: { path: 'test-file.pdf' },
      error: null,
    });

    mockSupabaseClient.storage.from().createSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://signed-url.com/file.pdf' },
      error: null,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.url).toBe('https://signed-url.com/file.pdf');
  });

  test('GET should return service info', async () => {
    const request = new NextRequest('http://localhost/api/compressUpload');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.service).toBe('Mahardika PDF Compress & Upload');
    expect(result.colors.navy).toBe('#0D1B2A');
    expect(result.colors.gold).toBe('#F4B400');
  });
});
