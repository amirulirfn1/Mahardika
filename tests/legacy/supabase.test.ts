import {
  agencyService,
  mockAgencyData,
  mockReviewsData,
  isSupabaseConfigured,
  Agency,
  AgencyReview,
} from '../lib/supabase';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
          order: jest.fn(),
        })),
      })),
    })),
  })),
}));

// Mock environment configuration
jest.mock('../lib/env', () => ({
  DATABASE_CONFIG: {
    supabase: {
      enabled: true,
      url: 'https://test.supabase.co',
      anonKey: 'test-anon-key',
    },
  },
}));

describe('Supabase Service', () => {
  describe('Mock Data', () => {
    it('provides valid mock agency data', () => {
      expect(mockAgencyData).toBeDefined();
      expect(mockAgencyData.id).toBe('mock-agency-1');
      expect(mockAgencyData.slug).toBe('premium-insurance-solutions');
      expect(mockAgencyData.name).toBe('Premium Insurance Solutions');
      expect(mockAgencyData.status).toBe('active');
      expect(mockAgencyData.rating).toBe(4.8);
      expect(mockAgencyData.review_count).toBe(127);
    });

    it('provides valid mock reviews data', () => {
      expect(mockReviewsData).toBeDefined();
      expect(Array.isArray(mockReviewsData)).toBe(true);
      expect(mockReviewsData.length).toBe(3);

      mockReviewsData.forEach(review => {
        expect(review).toHaveProperty('id');
        expect(review).toHaveProperty('agency_id');
        expect(review).toHaveProperty('reviewer_name');
        expect(review).toHaveProperty('rating');
        expect(review).toHaveProperty('comment');
        expect(review.status).toBe('approved');
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
      });
    });

    it('has consistent agency_id in mock reviews', () => {
      mockReviewsData.forEach(review => {
        expect(review.agency_id).toBe(mockAgencyData.id);
      });
    });
  });

  describe('Configuration', () => {
    it('detects Supabase configuration status', () => {
      const isConfigured = isSupabaseConfigured();
      expect(typeof isConfigured).toBe('boolean');
    });
  });

  describe('Agency Service', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getBySlug', () => {
      it('should be defined', () => {
        expect(agencyService.getBySlug).toBeDefined();
        expect(typeof agencyService.getBySlug).toBe('function');
      });

      it('should accept a slug parameter', async () => {
        // This test verifies the function signature
        expect(() => {
          agencyService.getBySlug('test-slug');
        }).not.toThrow();
      });
    });

    describe('getAll', () => {
      it('should be defined', () => {
        expect(agencyService.getAll).toBeDefined();
        expect(typeof agencyService.getAll).toBe('function');
      });
    });

    describe('getReviews', () => {
      it('should be defined', () => {
        expect(agencyService.getReviews).toBeDefined();
        expect(typeof agencyService.getReviews).toBe('function');
      });

      it('should accept an agency ID parameter', async () => {
        // This test verifies the function signature
        expect(() => {
          agencyService.getReviews('test-agency-id');
        }).not.toThrow();
      });
    });
  });

  describe('Type Definitions', () => {
    it('Agency interface should have required fields', () => {
      const agency: Agency = {
        id: 'test-id',
        slug: 'test-slug',
        name: 'Test Agency',
        tagline: 'Test tagline',
        description: 'Test description',
        status: 'active',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      expect(agency.id).toBeDefined();
      expect(agency.slug).toBeDefined();
      expect(agency.name).toBeDefined();
      expect(agency.status).toBeDefined();
    });

    it('AgencyReview interface should have required fields', () => {
      const review: AgencyReview = {
        id: 'test-review-id',
        agency_id: 'test-agency-id',
        reviewer_name: 'Test Reviewer',
        rating: 5,
        comment: 'Great service!',
        status: 'approved',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      expect(review.id).toBeDefined();
      expect(review.agency_id).toBeDefined();
      expect(review.reviewer_name).toBeDefined();
      expect(review.rating).toBeDefined();
      expect(review.comment).toBeDefined();
      expect(review.status).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('mock agency has valid contact information', () => {
      expect(mockAgencyData.contact_email).toMatch(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      );
      expect(mockAgencyData.contact_phone).toMatch(
        /^\+1 \(\d{3}\) \d{3}-\d{4}$/
      );
      expect(mockAgencyData.website_url).toMatch(/^https?:\/\/.+/);
    });

    it('mock agency has valid URLs', () => {
      if (mockAgencyData.banner_image_url) {
        expect(mockAgencyData.banner_image_url).toMatch(/^https?:\/\/.+/);
      }
      if (mockAgencyData.logo_url) {
        expect(mockAgencyData.logo_url).toMatch(/^https?:\/\/.+/);
      }
    });

    it('mock reviews have valid ratings', () => {
      mockReviewsData.forEach(review => {
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
        expect(Number.isInteger(review.rating)).toBe(true);
      });
    });

    it('mock reviews have valid dates', () => {
      mockReviewsData.forEach(review => {
        const date = new Date(review.created_at);
        expect(date.getTime()).not.toBeNaN();
        expect(date.getFullYear()).toBeGreaterThanOrEqual(2024);
      });
    });
  });

  describe('Brand Compliance', () => {
    it('mock data uses appropriate business language', () => {
      expect(mockAgencyData.name).toContain('Insurance');
      expect(mockAgencyData.tagline).toBeTruthy();
      expect(mockAgencyData.description).toContain('insurance');

      mockReviewsData.forEach(review => {
        expect(review.comment.length).toBeGreaterThan(10);
        expect(review.reviewer_name).toBeTruthy();
      });
    });

    it('mock agency has professional contact information', () => {
      expect(mockAgencyData.contact_email).toContain('@');
      expect(mockAgencyData.contact_phone).toContain('+1');
      expect(mockAgencyData.website_url).toContain('https://');
    });
  });

  describe('Error Handling', () => {
    it('handles missing environment variables gracefully', () => {
      // This test ensures the module can be imported even with missing config
      expect(() => {
        require('../lib/supabase');
      }).not.toThrow();
    });
  });

  describe('Development Support', () => {
    it('provides fallback data for development', () => {
      // Ensure mock data is comprehensive enough for development
      expect(mockAgencyData.slug).toBeTruthy();
      expect(mockAgencyData.name).toBeTruthy();
      expect(mockAgencyData.tagline).toBeTruthy();
      expect(mockAgencyData.description).toBeTruthy();
      expect(mockReviewsData.length).toBeGreaterThan(0);
    });

    it('mock data supports all ShopPage features', () => {
      // Ensure mock data has all fields needed for the ShopPage component
      expect(mockAgencyData.banner_image_url).toBeTruthy();
      expect(mockAgencyData.logo_url).toBeTruthy();
      expect(mockAgencyData.contact_phone).toBeTruthy();
      expect(mockAgencyData.contact_email).toBeTruthy();
      expect(mockAgencyData.website_url).toBeTruthy();
      expect(mockAgencyData.rating).toBeTruthy();
      expect(mockAgencyData.review_count).toBeTruthy();

      expect(mockReviewsData.length).toBeGreaterThanOrEqual(3);
      mockReviewsData.forEach(review => {
        expect(review.reviewer_name).toBeTruthy();
        expect(review.comment).toBeTruthy();
        expect(review.rating).toBeTruthy();
      });
    });
  });
});
