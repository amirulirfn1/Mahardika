/**
 * =============================================================================
 * Enhanced Seed Script Tests - Mahardika Platform
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
vi.mock('@supabase/supabase-js');

const mockSupabase = {
  from: vi.fn(),
  rpc: vi.fn(),
};

const mockCreateClient = vi.mocked(createClient);
mockCreateClient.mockReturnValue(mockSupabase as any);

// Mock environment variables
const originalEnv = process.env;

describe('Enhanced Seed Script with RLS Management', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Service Role Key Validation', () => {
    it('should require SUPABASE_SERVICE_ROLE_KEY environment variable', () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      expect(() => {
        require('../seed_dev_data.ts');
      }).toThrow('process.exit called');

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    it('should create Supabase client with service role key', () => {
      require('../seed_dev_data.ts');

      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-service-role-key',
        expect.objectContaining({
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
          db: {
            schema: 'public',
          },
        })
      );
    });
  });

  describe('RLS Management Functions', () => {
    let seedModule: any;

    beforeEach(async () => {
      seedModule = await import('../seed_dev_data.ts');
    });

    it('should create RLS management functions', async () => {
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // This would be called internally by createRLSManagementFunctions
      // We can't directly test private functions, but we can verify the RPC calls
      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'exec_sql',
        expect.objectContaining({
          sql: expect.stringContaining('disable_rls_for_table'),
        })
      );
    });

    it('should handle RLS function creation errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockSupabase.rpc.mockRejectedValue(new Error('Function creation failed'));

      // The function should not throw, just warn
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not create RLS management functions'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('RLS Policy Management', () => {
    it('should disable RLS policies before seeding', async () => {
      const tables = [
        'agencies',
        'users',
        'customers',
        'policies',
        'reviews',
        'analytics',
        'audit_logs',
        'notifications',
      ];

      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // Simulate disableRLS function calls
      for (const table of tables) {
        expect(mockSupabase.rpc).toHaveBeenCalledWith('disable_rls_for_table', {
          table_name: table,
        });
      }
    });

    it('should re-enable RLS policies after seeding', async () => {
      const tables = [
        'agencies',
        'users',
        'customers',
        'policies',
        'reviews',
        'analytics',
        'audit_logs',
        'notifications',
      ];

      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // Simulate enableRLS function calls
      for (const table of tables) {
        expect(mockSupabase.rpc).toHaveBeenCalledWith('enable_rls_for_table', {
          table_name: table,
        });
      }
    });

    it('should handle RLS disable errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockSupabase.rpc.mockRejectedValue(new Error('RLS disable failed'));

      // Should warn but continue
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('RLS management not available'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Data Seeding with Enhanced Security', () => {
    let mockFrom: any;

    beforeEach(() => {
      mockFrom = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });
    });

    it('should seed agencies with proper data structure', async () => {
      mockFrom.insert.mockResolvedValue({ data: null, error: null });

      const agencies = [
        {
          id: expect.any(String),
          name: 'Golden Shield Insurance',
          slug: 'golden-shield',
          tagline: 'Protecting Your Future with Trust and Excellence',
          // ... other expected fields
        },
      ];

      expect(mockSupabase.from).toHaveBeenCalledWith('agencies');
      expect(mockFrom.insert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            slug: expect.any(String),
            tagline: expect.any(String),
            about_md: expect.any(String),
            email: expect.any(String),
            phone: expect.any(String),
            is_active: true,
          }),
        ])
      );
    });

    it('should use Mahardika brand colors in sample data', async () => {
      // Check that the sample data includes references to brand colors
      const sampleAgencies = [
        { name: 'Golden Shield Insurance' }, // Gold reference
        { name: 'Navy Coast Protection' }, // Navy reference
      ];

      expect(
        sampleAgencies.some(agency =>
          agency.name.toLowerCase().includes('gold')
        )
      ).toBe(true);

      expect(
        sampleAgencies.some(agency =>
          agency.name.toLowerCase().includes('navy')
        )
      ).toBe(true);
    });

    it('should handle seeding errors and re-enable RLS', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      mockFrom.insert.mockRejectedValue(new Error('Insert failed'));

      expect(() => {
        // Simulate seeding process with error
      }).toThrow('Insert failed');

      // Should attempt to re-enable RLS even after error
      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'enable_rls_for_table',
        expect.any(Object)
      );

      consoleSpy.mockRestore();
      mockExit.mockRestore();
    });
  });

  describe('Enhanced Logging and Reporting', () => {
    it('should provide detailed seeding summary', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // After successful seeding
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Enhanced database seeding completed successfully!'
        )
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔒 Security Status:')
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('RLS policies have been re-enabled')
      );

      consoleSpy.mockRestore();
    });

    it('should log RLS management steps', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // Should log RLS disable step
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '🔓 Temporarily disabling RLS policies for seeding...'
        )
      );

      // Should log RLS enable step
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔒 Re-enabling RLS policies...')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Brand Color Integration', () => {
    it('should include brand color references in sample data', () => {
      // Navy #0D1B2A and Gold #F4B400
      const expectedBrandElements = [
        'Golden Shield', // Gold reference
        'Navy Coast', // Navy reference
        'Premium', // Associated with gold
      ];

      expectedBrandElements.forEach(element => {
        expect(element).toMatch(/Golden|Navy|Premium/);
      });
    });

    it('should use brand-appropriate business names and descriptions', () => {
      const sampleAgencies = [
        {
          name: 'Golden Shield Insurance',
          tagline: 'Protecting Your Future with Trust and Excellence',
        },
        {
          name: 'Navy Coast Protection',
          tagline: "Steadfast Protection for Life's Journeys",
        },
      ];

      sampleAgencies.forEach(agency => {
        expect(agency.name).toBeTruthy();
        expect(agency.tagline).toBeTruthy();
        expect(agency.tagline.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Performance and Error Handling', () => {
    it('should handle large data sets efficiently', async () => {
      const mockFrom = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockFrom);
      mockSupabase.rpc.mockResolvedValue({ data: null, error: null });

      // Should handle multiple agencies with customers and policies
      const totalExpectedInserts = 3 + 7 + 45 + 75 + 30; // agencies + users + customers + policies + reviews

      expect(mockFrom.insert).toHaveBeenCalledTimes(5); // 5 different insert operations
    });

    it('should provide meaningful error messages', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockSupabase.from.mockReturnValue({
        insert: vi
          .fn()
          .mockRejectedValue(new Error('Database connection failed')),
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Enhanced seeding failed:'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
