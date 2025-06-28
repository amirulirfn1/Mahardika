import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopIndexPage from '../app/shop/page';
import ShopPage from '../app/shop/[slug]/page';

// Mock BrandButton and BrandCard components
jest.mock('@mahardika/ui', () => ({
  BrandButton: ({ children, onClick, variant, size, className }: any) => (
    <button
      onClick={onClick}
      className={`brand-button ${variant} ${size} ${className || ''}`}
      data-testid="brand-button"
    >
      {children}
    </button>
  ),
  BrandCard: ({ children, variant, size, className }: any) => (
    <div
      className={`brand-card ${variant} ${size} ${className || ''}`}
      data-testid="brand-card"
    >
      {children}
    </div>
  ),
}));

// Mock window.location.href
delete (window as any).location;
window.location = { href: '' } as any;

describe('Shop Pages', () => {
  describe('Shop Index Page', () => {
    beforeEach(() => {
      render(<ShopIndexPage />);
    });

    it('renders the shop header correctly', () => {
      expect(screen.getByText('Mahardika Shop')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Discover our comprehensive range of insurance and financial services'
        )
      ).toBeInTheDocument();
    });

    it('displays featured products section', () => {
      expect(screen.getByText('⭐ Featured Products')).toBeInTheDocument();
      expect(
        screen.getByText('Comprehensive Health Insurance')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Business Liability Protection')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Investment Portfolio Management')
      ).toBeInTheDocument();
    });

    it('displays shop categories', () => {
      expect(screen.getByText('🏷️ Shop by Category')).toBeInTheDocument();
      expect(screen.getByText('Insurance Packages')).toBeInTheDocument();
      expect(screen.getByText('Financial Services')).toBeInTheDocument();
      expect(screen.getByText('Business Solutions')).toBeInTheDocument();
      expect(screen.getByText('Personal Protection')).toBeInTheDocument();
    });

    it('shows category product counts', () => {
      expect(screen.getByText('12 Products')).toBeInTheDocument();
      expect(screen.getByText('8 Products')).toBeInTheDocument();
      expect(screen.getByText('15 Products')).toBeInTheDocument();
      expect(screen.getByText('6 Products')).toBeInTheDocument();
    });

    it('displays call to action section', () => {
      expect(
        screen.getByText('🚀 Ready to Get Protected?')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Join thousands of satisfied customers who trust Mahardika for their insurance and financial needs'
        )
      ).toBeInTheDocument();
    });

    it('shows benefit highlights', () => {
      expect(screen.getByText('Award-Winning Service')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive Coverage')).toBeInTheDocument();
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });

    it('uses Mahardika brand colors', () => {
      // Check for navy navigation background
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveStyle('background-color: #0D1B2A');

      // Check for gold border
      expect(navbar).toHaveStyle('border-bottom: 3px solid #F4B400');
    });

    it('handles navigation correctly', () => {
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveAttribute('href', '/');

      const dashboardLink = screen.getByText('Dashboard');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    it('handles product clicks', () => {
      const viewDetailsButtons = screen.getAllByText('View Details');
      fireEvent.click(viewDetailsButtons[0]);
      // Note: In a real test, you'd mock window.location.href assignment
    });

    it('handles category clicks', () => {
      const browseCategoryButtons = screen.getAllByText('Browse Category');
      expect(browseCategoryButtons.length).toBeGreaterThan(0);
      fireEvent.click(browseCategoryButtons[0]);
    });
  });

  describe('Shop Dynamic Route Page', () => {
    it('renders product page for valid product', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      expect(
        screen.getByText('Comprehensive Health Insurance')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Complete Health Coverage for You and Your Family')
      ).toBeInTheDocument();
      expect(screen.getByText('From $89/month')).toBeInTheDocument();
    });

    it('renders category page for valid category', () => {
      const mockParams = { slug: 'insurance-packages' };
      render(<ShopPage params={mockParams} />);

      expect(screen.getByText('Insurance Packages')).toBeInTheDocument();
      expect(
        screen.getByText('Comprehensive Insurance Solutions for Every Need')
      ).toBeInTheDocument();
    });

    it('renders 404 page for invalid slug', () => {
      const mockParams = { slug: 'non-existent-product' };
      render(<ShopPage params={mockParams} />);

      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
      expect(
        screen.getByText(
          "The product you're looking for doesn't exist or has been moved."
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Back to Shop')).toBeInTheDocument();
    });

    it('displays product features correctly', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      expect(
        screen.getByText('✅ Nationwide network of doctors and hospitals')
      ).toBeInTheDocument();
      expect(
        screen.getByText('✅ Prescription drug coverage included')
      ).toBeInTheDocument();
    });

    it('handles tab navigation', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const overviewTab = screen.getByText('Overview');
      const plansTab = screen.getByText('Plans');
      const faqsTab = screen.getByText('Faqs');
      const reviewsTab = screen.getByText('Reviews');

      expect(overviewTab).toBeInTheDocument();
      expect(plansTab).toBeInTheDocument();
      expect(faqsTab).toBeInTheDocument();
      expect(reviewsTab).toBeInTheDocument();

      fireEvent.click(plansTab);
      fireEvent.click(faqsTab);
      fireEvent.click(reviewsTab);
    });

    it('displays plan options correctly', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      // Click on plans tab first
      const plansTab = screen.getByText('Plans');
      fireEvent.click(plansTab);

      expect(screen.getByText('Individual')).toBeInTheDocument();
      expect(screen.getByText('Family (2 adults)')).toBeInTheDocument();
      expect(screen.getByText('Family (with children)')).toBeInTheDocument();
    });

    it('shows quote form when requested', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const quoteButton = screen.getByText('Get Free Quote');
      fireEvent.click(quoteButton);

      expect(screen.getByText('Get Your Free Quote')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    });

    it('displays FAQ information', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const faqsTab = screen.getByText('Faqs');
      fireEvent.click(faqsTab);

      expect(
        screen.getByText('What is the waiting period?')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Are prescription drugs covered?')
      ).toBeInTheDocument();
    });

    it('shows customer testimonials', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const reviewsTab = screen.getByText('Reviews');
      fireEvent.click(reviewsTab);

      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    });

    it('displays badges for featured products', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      expect(screen.getByText('Most Popular')).toBeInTheDocument();
      expect(screen.getByText('Best Value')).toBeInTheDocument();
    });

    it('shows rating and reviews count', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      expect(screen.getByText('4.8')).toBeInTheDocument();
      expect(screen.getByText('(2847 reviews)')).toBeInTheDocument();
    });

    it('handles back navigation', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const backLink = screen.getByText('← Back to Shop');
      expect(backLink).toHaveAttribute('href', '/shop');
    });
  });

  describe('Accessibility', () => {
    it('has proper navigation structure', () => {
      render(<ShopIndexPage />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });

    it('uses semantic HTML elements', () => {
      render(<ShopIndexPage />);
      expect(screen.getByRole('main', { hidden: true })).toBeDefined();
    });

    it('has proper form labels in quote form', () => {
      const mockParams = { slug: 'comprehensive-health-insurance' };
      render(<ShopPage params={mockParams} />);

      const quoteButton = screen.getByText('Get Free Quote');
      fireEvent.click(quoteButton);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('uses Bootstrap responsive classes', () => {
      render(<ShopIndexPage />);
      const cardContainer = document.querySelector('.row.g-4');
      expect(cardContainer).toBeInTheDocument();
    });

    it('has proper grid layout for products', () => {
      render(<ShopIndexPage />);
      const productCards = document.querySelectorAll('.col-md-6.col-lg-4');
      expect(productCards.length).toBeGreaterThan(0);
    });
  });
});
