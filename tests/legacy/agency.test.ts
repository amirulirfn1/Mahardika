/**
 * =============================================================================
 * Mahardika Platform - Agency Utility Tests
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import {
  validateAgencyData,
  validateSlugFormat,
  generateSlugFromName,
  formatAgencyForDisplay,
} from '@/lib/utils/agency';
import {
  AgencyValidationError,
  AGENCY_CONSTANTS,
  type CreateAgencyRequest,
  type Agency,
} from '@/lib/types/agency';

// Mock Supabase for tests that don't need actual database calls
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          limit: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  },
}));

describe('Agency Utilities', () => {
  describe('validateSlugFormat', () => {
    it('should accept valid slugs', () => {
      expect(validateSlugFormat('valid-slug')).toBe(true);
      expect(validateSlugFormat('agency-123')).toBe(true);
      expect(validateSlugFormat('test')).toBe(true);
      expect(validateSlugFormat('a-very-long-but-valid-slug-name')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(validateSlugFormat('')).toBe(false);
      expect(validateSlugFormat('a')).toBe(false); // Too short
      expect(validateSlugFormat('Invalid Slug')).toBe(false); // Spaces
      expect(validateSlugFormat('invalid_slug')).toBe(false); // Underscores
      expect(validateSlugFormat('invalid@slug')).toBe(false); // Special chars
      expect(validateSlugFormat('UPPERCASE')).toBe(false); // Uppercase
      expect(validateSlugFormat('-invalid')).toBe(false); // Starts with hyphen
      expect(validateSlugFormat('invalid-')).toBe(false); // Ends with hyphen
    });

    it('should reject slugs that are too long', () => {
      const longSlug = 'a'.repeat(AGENCY_CONSTANTS.MAX_SLUG_LENGTH + 1);
      expect(validateSlugFormat(longSlug)).toBe(false);
    });
  });

  describe('generateSlugFromName', () => {
    it('should generate valid slugs from names', () => {
      expect(generateSlugFromName('Golden Shield Insurance')).toBe(
        'golden-shield-insurance'
      );
      expect(generateSlugFromName('Navy Coast Protection')).toBe(
        'navy-coast-protection'
      );
      expect(generateSlugFromName('A & B Insurance Co.')).toBe(
        'a-b-insurance-co'
      );
      expect(generateSlugFromName('Test   Multiple   Spaces')).toBe(
        'test-multiple-spaces'
      );
    });

    it('should handle edge cases', () => {
      expect(generateSlugFromName('  Leading and trailing spaces  ')).toBe(
        'leading-and-trailing-spaces'
      );
      expect(generateSlugFromName('123 Numeric Agency')).toBe(
        '123-numeric-agency'
      );
      expect(generateSlugFromName('Special!@#$%Characters')).toBe(
        'special-characters'
      );
    });

    it('should truncate long names', () => {
      const longName =
        'Very Long Agency Name That Exceeds The Maximum Length Allowed For Slugs';
      const result = generateSlugFromName(longName);
      expect(result.length).toBeLessThanOrEqual(
        AGENCY_CONSTANTS.MAX_SLUG_LENGTH
      );
    });
  });

  describe('validateAgencyData', () => {
    const validAgencyData: CreateAgencyRequest = {
      name: 'Test Agency',
      email: 'test@agency.com',
      phone: '+1-555-123-4567',
      address: '123 Test St, Test City, TC 12345',
      slug: 'test-agency',
      tagline: 'Your trusted insurance partner',
      about_md: '# About Us\nWe provide excellent insurance services.',
      hero_image_url: 'https://example.com/hero.jpg',
      website: 'https://testagency.com',
      logo_url: 'https://example.com/logo.png',
    };

    it('should pass validation for valid data', () => {
      expect(() => validateAgencyData(validAgencyData)).not.toThrow();
    });

    it('should require name', () => {
      const invalidData = { ...validAgencyData, name: '' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );

      try {
        validateAgencyData(invalidData);
      } catch (error) {
        expect(error).toBeInstanceOf(AgencyValidationError);
        expect((error as AgencyValidationError).field).toBe('name');
        expect((error as AgencyValidationError).code).toBe('REQUIRED');
      }
    });

    it('should require email', () => {
      const invalidData = { ...validAgencyData, email: '' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );
    });

    it('should validate email format', () => {
      const invalidData = { ...validAgencyData, email: 'invalid-email' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );

      try {
        validateAgencyData(invalidData);
      } catch (error) {
        expect((error as AgencyValidationError).field).toBe('email');
        expect((error as AgencyValidationError).code).toBe('INVALID_FORMAT');
      }
    });

    it('should require phone', () => {
      const invalidData = { ...validAgencyData, phone: '' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );
    });

    it('should validate phone format', () => {
      const invalidData = { ...validAgencyData, phone: 'invalid-phone' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );
    });

    it('should validate slug format if provided', () => {
      const invalidData = { ...validAgencyData, slug: 'Invalid Slug!' };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );

      try {
        validateAgencyData(invalidData);
      } catch (error) {
        expect((error as AgencyValidationError).field).toBe('slug');
        expect((error as AgencyValidationError).code).toBe('INVALID_FORMAT');
      }
    });

    it('should validate tagline length', () => {
      const longTagline = 'a'.repeat(AGENCY_CONSTANTS.MAX_TAGLINE_LENGTH + 1);
      const invalidData = { ...validAgencyData, tagline: longTagline };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );

      try {
        validateAgencyData(invalidData);
      } catch (error) {
        expect((error as AgencyValidationError).field).toBe('tagline');
        expect((error as AgencyValidationError).code).toBe('MAX_LENGTH');
      }
    });

    it('should validate about_md length', () => {
      const longAbout = 'a'.repeat(AGENCY_CONSTANTS.MAX_ABOUT_LENGTH + 1);
      const invalidData = { ...validAgencyData, about_md: longAbout };
      expect(() => validateAgencyData(invalidData)).toThrow(
        AgencyValidationError
      );
    });

    it('should validate URL formats', () => {
      // Invalid hero image URL
      const invalidHero = { ...validAgencyData, hero_image_url: 'invalid-url' };
      expect(() => validateAgencyData(invalidHero)).toThrow(
        AgencyValidationError
      );

      // Invalid website URL
      const invalidWebsite = { ...validAgencyData, website: 'invalid-url' };
      expect(() => validateAgencyData(invalidWebsite)).toThrow(
        AgencyValidationError
      );

      // Invalid logo URL
      const invalidLogo = { ...validAgencyData, logo_url: 'invalid-url' };
      expect(() => validateAgencyData(invalidLogo)).toThrow(
        AgencyValidationError
      );
    });

    it('should allow optional fields to be undefined', () => {
      const minimalData = {
        name: 'Test Agency',
        email: 'test@agency.com',
        phone: '+1-555-123-4567',
        address: '123 Test St',
      };
      expect(() => validateAgencyData(minimalData)).not.toThrow();
    });
  });

  describe('formatAgencyForDisplay', () => {
    const mockAgency: Agency = {
      id: '123',
      name: 'Test Agency',
      slug: 'test-agency',
      email: 'test@agency.com',
      phone: '5551234567',
      address: '123 Test St',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      hero_image_url: 'https://example.com/hero.jpg',
      tagline: 'Test tagline',
      about_md: '# About us',
      website: 'https://test.com',
      logo_url: 'https://example.com/logo.png',
      business_hours: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed',
      },
    };

    it('should format agency data correctly', () => {
      const formatted = formatAgencyForDisplay(mockAgency);

      expect(formatted.display_name).toBe('Test Agency');
      expect(formatted.profile_url).toBe('/agencies/test-agency');
      expect(formatted.formatted_phone).toBe('(555) 123-4567');
      expect(formatted.business_hours_formatted).toHaveLength(7);
      expect(formatted.business_hours_formatted[0]).toBe(
        'Monday: 9:00 AM - 5:00 PM'
      );
      expect(formatted.business_hours_formatted[5]).toBe('Saturday: Closed');
    });

    it('should handle missing optional fields', () => {
      const minimalAgency = {
        ...mockAgency,
        logo_url: undefined,
        hero_image_url: undefined,
        business_hours: undefined,
      };

      const formatted = formatAgencyForDisplay(minimalAgency);

      expect(formatted.logo_url).toBe('/images/default-agency-logo.png');
      expect(formatted.hero_image_url).toBe('/images/default-hero.jpg');
      expect(formatted.business_hours_formatted).toEqual([]);
    });

    it('should format different phone number formats', () => {
      // 10-digit number
      const agency1 = { ...mockAgency, phone: '5551234567' };
      expect(formatAgencyForDisplay(agency1).formatted_phone).toBe(
        '(555) 123-4567'
      );

      // 11-digit number with country code
      const agency2 = { ...mockAgency, phone: '15551234567' };
      expect(formatAgencyForDisplay(agency2).formatted_phone).toBe(
        '+1 (555) 123-4567'
      );

      // Already formatted number
      const agency3 = { ...mockAgency, phone: '+1-555-123-4567' };
      expect(formatAgencyForDisplay(agency3).formatted_phone).toBe(
        '+1-555-123-4567'
      );
    });
  });

  describe('AGENCY_CONSTANTS', () => {
    it('should have valid regex patterns', () => {
      expect(AGENCY_CONSTANTS.SLUG_PATTERN.test('valid-slug')).toBe(true);
      expect(AGENCY_CONSTANTS.SLUG_PATTERN.test('invalid slug')).toBe(false);

      expect(AGENCY_CONSTANTS.EMAIL_PATTERN.test('test@example.com')).toBe(
        true
      );
      expect(AGENCY_CONSTANTS.EMAIL_PATTERN.test('invalid-email')).toBe(false);

      expect(AGENCY_CONSTANTS.PHONE_PATTERN.test('+1-555-123-4567')).toBe(true);
      expect(AGENCY_CONSTANTS.PHONE_PATTERN.test('abc')).toBe(false);

      expect(AGENCY_CONSTANTS.URL_PATTERN.test('https://example.com')).toBe(
        true
      );
      expect(AGENCY_CONSTANTS.URL_PATTERN.test('http://example.com')).toBe(
        true
      );
      expect(AGENCY_CONSTANTS.URL_PATTERN.test('invalid-url')).toBe(false);
    });

    it('should have reasonable length constraints', () => {
      expect(AGENCY_CONSTANTS.MAX_NAME_LENGTH).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MAX_SLUG_LENGTH).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MAX_TAGLINE_LENGTH).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MAX_ABOUT_LENGTH).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MIN_SLUG_LENGTH).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MIN_SLUG_LENGTH).toBeLessThan(
        AGENCY_CONSTANTS.MAX_SLUG_LENGTH
      );
    });

    it('should have reasonable pagination defaults', () => {
      expect(AGENCY_CONSTANTS.DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
      expect(AGENCY_CONSTANTS.MAX_PAGE_SIZE).toBeGreaterThan(
        AGENCY_CONSTANTS.DEFAULT_PAGE_SIZE
      );
    });
  });
});

// Integration tests would go here, but require actual Supabase connection
describe('Agency Integration Tests', () => {
  describe('when Supabase is available', () => {
    it.skip('should create agency with auto-generated slug', async () => {
      // This would test the actual database operations
      // Skipped for unit tests, would be enabled for integration tests
    });

    it.skip('should fetch agency by slug', async () => {
      // This would test actual database fetching
      // Skipped for unit tests
    });

    it.skip('should validate slug uniqueness', async () => {
      // This would test actual slug uniqueness validation
      // Skipped for unit tests
    });
  });
});
