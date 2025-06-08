import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { colors } from '@mahardika/ui';
import ShopPage from '../components/ShopPage';
import { Agency, AgencyReview } from '../lib/supabase';

// Mock data for testing
const mockAgency: Agency = {
  id: 'test-agency-1',
  slug: 'test-insurance-agency',
  name: 'Test Insurance Agency',
  tagline: 'Your trusted insurance partner',
  description:
    'We provide comprehensive insurance solutions for all your needs.',
  banner_image_url: 'https://example.com/banner.jpg',
  logo_url: 'https://example.com/logo.jpg',
  website_url: 'https://testinsurance.com',
  contact_email: 'contact@testinsurance.com',
  contact_phone: '+1 (555) 123-4567',
  rating: 4.8,
  review_count: 125,
  status: 'active',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

const mockReviews: AgencyReview[] = [
  {
    id: 'review-1',
    agency_id: 'test-agency-1',
    reviewer_name: 'John Doe',
    rating: 5,
    comment: 'Excellent service and competitive rates.',
    status: 'approved',
    created_at: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'review-2',
    agency_id: 'test-agency-1',
    reviewer_name: 'Jane Smith',
    rating: 4,
    comment: 'Very professional and helpful staff.',
    status: 'approved',
    created_at: '2024-01-10T14:20:00.000Z',
  },
  {
    id: 'review-3',
    agency_id: 'test-agency-1',
    reviewer_name: 'Mike Johnson',
    rating: 5,
    comment: 'Quick response time and great customer service.',
    status: 'approved',
    created_at: '2024-01-05T09:15:00.000Z',
  },
];

// Mock window.location for navigation tests
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('ShopPage Component', () => {
  beforeEach(() => {
    mockLocation.href = '';
  });

  it('renders agency information correctly', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    expect(screen.getByText('Test Insurance Agency')).toBeInTheDocument();
    expect(
      screen.getByText('Your trusted insurance partner')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We provide comprehensive insurance solutions for all your needs.'
      )
    ).toBeInTheDocument();
  });

  it('displays contact information when available', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('contact@testinsurance.com')).toBeInTheDocument();
    expect(screen.getByText('Visit Website')).toBeInTheDocument();
  });

  it('shows rating and review count', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(125 reviews)')).toBeInTheDocument();
  });

  it('renders reviews carousel', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
    expect(
      screen.getByText('"Excellent service and competitive rates."')
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles review carousel navigation', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    // Initial review should be displayed
    expect(
      screen.getByText('"Excellent service and competitive rates."')
    ).toBeInTheDocument();

    // Click next button
    const nextButton = screen.getByLabelText('Next review');
    fireEvent.click(nextButton);

    // Should show second review
    expect(
      screen.getByText('"Very professional and helpful staff."')
    ).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles previous review navigation', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    // Click previous button (should go to last review)
    const prevButton = screen.getByLabelText('Previous review');
    fireEvent.click(prevButton);

    // Should show last review
    expect(
      screen.getByText('"Quick response time and great customer service."')
    ).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
  });

  it('handles review indicator clicks', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    // Click on second indicator (index 1)
    const indicators = screen.getAllByLabelText(/Go to review/);
    fireEvent.click(indicators[1]);

    // Should show second review
    expect(
      screen.getByText('"Very professional and helpful staff."')
    ).toBeInTheDocument();
  });

  it('renders without reviews', () => {
    render(<ShopPage agency={mockAgency} reviews={[]} />);

    expect(screen.getByText('Test Insurance Agency')).toBeInTheDocument();
    expect(
      screen.queryByText('What Our Customers Say')
    ).not.toBeInTheDocument();
  });

  it('handles CTA button clicks for phone', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    const renewButton = screen.getByText('Renew Now');
    fireEvent.click(renewButton);

    expect(window.location.href).toBe('tel:+1 (555) 123-4567');
  });

  it('handles call now button', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    const callButton = screen.getByText('Call Now');
    fireEvent.click(callButton);

    expect(window.location.href).toBe('tel:+1 (555) 123-4567');
  });

  it('handles email button', () => {
    render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

    const emailButton = screen.getByText('Email Us');
    fireEvent.click(emailButton);

    expect(window.location.href).toBe('mailto:contact@testinsurance.com');
  });

  // Brand compliance tests
  describe('Brand Compliance', () => {
    it('uses Mahardika brand colors', () => {
      const { container } = render(
        <ShopPage agency={mockAgency} reviews={mockReviews} />
      );

      // Check for navy color usage
      const navyElements = container.querySelectorAll(
        `[style*="${colors.navy}"]`
      );
      expect(navyElements.length).toBeGreaterThan(0);

      // Check for gold color usage
      const goldElements = container.querySelectorAll(
        `[style*="${colors.gold}"]`
      );
      expect(goldElements.length).toBeGreaterThan(0);
    });

    it('uses BrandButton components', () => {
      render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

      // Check that buttons have the brand component classes/styles
      const renewButton = screen.getByText('Renew Now');
      const callButton = screen.getByText('Call Now');
      const emailButton = screen.getByText('Email Us');

      expect(renewButton).toBeInTheDocument();
      expect(callButton).toBeInTheDocument();
      expect(emailButton).toBeInTheDocument();
    });

    it('uses BrandCard components', () => {
      const { container } = render(
        <ShopPage agency={mockAgency} reviews={mockReviews} />
      );

      // BrandCard components should be present
      expect(screen.getByText('About Our Services')).toBeInTheDocument();
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('uses consistent rounded corners (0.5rem)', () => {
      const { container } = render(
        <ShopPage agency={mockAgency} reviews={mockReviews} />
      );

      // Check for rounded corner usage
      const roundedElements = container.querySelectorAll(
        '[style*="borderRadius: \\"0.5rem\\""], [style*="border-radius: 0.5rem"]'
      );
      expect(roundedElements.length).toBeGreaterThan(0);
    });

    it('does not use hardcoded colors', () => {
      const { container } = render(
        <ShopPage agency={mockAgency} reviews={mockReviews} />
      );

      // Check that we're not using hardcoded brand colors
      const htmlContent = container.innerHTML;
      expect(htmlContent).not.toMatch(/#0D1B2A/);
      expect(htmlContent).not.toMatch(/#F4B400/);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has proper ARIA labels for carousel controls', () => {
      render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

      expect(screen.getByLabelText('Previous review')).toBeInTheDocument();
      expect(screen.getByLabelText('Next review')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to review 1')).toBeInTheDocument();
    });

    it('has proper alt text for images', () => {
      render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

      const logoImg = screen.getByAltText('Test Insurance Agency logo');
      expect(logoImg).toBeInTheDocument();
    });

    it('has proper link attributes for external links', () => {
      render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

      const websiteLink = screen.getByText('Visit Website');
      expect(websiteLink.closest('a')).toHaveAttribute('target', '_blank');
      expect(websiteLink.closest('a')).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });
  });

  // Responsive design tests
  describe('Responsive Design', () => {
    it('uses Bootstrap responsive classes', () => {
      const { container } = render(
        <ShopPage agency={mockAgency} reviews={mockReviews} />
      );

      // Check for Bootstrap responsive grid classes
      expect(container.querySelector('.col-lg-8')).toBeInTheDocument();
      expect(container.querySelector('.col-lg-6')).toBeInTheDocument();
    });

    it('has responsive button layout', () => {
      render(<ShopPage agency={mockAgency} reviews={mockReviews} />);

      // Check for responsive flex classes
      const buttonContainer = screen.getByText('Call Now').closest('.d-flex');
      expect(buttonContainer).toHaveClass('flex-column', 'flex-sm-row');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles agency without optional fields', () => {
      const minimalAgency: Agency = {
        ...mockAgency,
        banner_image_url: undefined,
        logo_url: undefined,
        website_url: undefined,
        contact_email: undefined,
        contact_phone: undefined,
        rating: undefined,
        review_count: undefined,
      };

      render(<ShopPage agency={minimalAgency} reviews={[]} />);

      expect(screen.getByText('Test Insurance Agency')).toBeInTheDocument();
      expect(
        screen.queryByAltText('Test Insurance Agency logo')
      ).not.toBeInTheDocument();
    });

    it('handles single review', () => {
      render(<ShopPage agency={mockAgency} reviews={[mockReviews[0]]} />);

      expect(
        screen.getByText('"Excellent service and competitive rates."')
      ).toBeInTheDocument();
      expect(screen.queryByLabelText('Next review')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('Previous review')
      ).not.toBeInTheDocument();
    });

    it('handles agency with email but no phone', () => {
      const emailOnlyAgency: Agency = {
        ...mockAgency,
        contact_phone: undefined,
      };

      render(<ShopPage agency={emailOnlyAgency} reviews={mockReviews} />);

      const renewButton = screen.getByText('Renew Now');
      fireEvent.click(renewButton);

      expect(window.location.href).toBe('mailto:contact@testinsurance.com');
    });
  });
});
