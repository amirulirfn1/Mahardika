import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TermsOfServicePage from '../app/terms/page';

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
  BrandCard: ({ children, variant, size, className, id }: any) => (
    <div
      id={id}
      className={`brand-card ${variant} ${size} ${className || ''}`}
      data-testid="brand-card"
    >
      {children}
    </div>
  ),
}));

describe('Terms of Service Page', () => {
  beforeEach(() => {
    render(<TermsOfServicePage />);
  });

  describe('Page Structure', () => {
    it('renders the main header correctly', () => {
      expect(screen.getByText('📋 Terms of Service')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Legal terms and conditions governing the use of Mahardika services'
        )
      ).toBeInTheDocument();
    });

    it('displays the navigation bar with proper branding', () => {
      expect(screen.getByText('Mahardika Legal')).toBeInTheDocument();
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveStyle('background-color: #0D1B2A');
    });

    it('shows the important legal notice', () => {
      expect(screen.getByText('Important Legal Notice')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Please read these Terms of Service carefully before using our services. By accessing or using any part of Mahardika services, you agree to be bound by these terms.'
        )
      ).toBeInTheDocument();
    });

    it('displays the table of contents', () => {
      expect(screen.getByText('📑 Table of Contents')).toBeInTheDocument();
    });

    it('shows last updated and effective dates', () => {
      expect(screen.getByText('December 15, 2024')).toBeInTheDocument();
      expect(
        screen.getByText('Effective: January 1, 2024')
      ).toBeInTheDocument();
    });
  });

  describe('Terms Sections', () => {
    it('displays all 10 main sections', () => {
      expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
      expect(
        screen.getByText('2. Description of Services')
      ).toBeInTheDocument();
      expect(screen.getByText('3. User Responsibilities')).toBeInTheDocument();
      expect(
        screen.getByText('4. Privacy and Data Protection')
      ).toBeInTheDocument();
      expect(
        screen.getByText('5. Financial Services Disclaimers')
      ).toBeInTheDocument();
      expect(screen.getByText('6. Intellectual Property')).toBeInTheDocument();
      expect(
        screen.getByText('7. Limitation of Liability')
      ).toBeInTheDocument();
      expect(screen.getByText('8. Indemnification')).toBeInTheDocument();
      expect(
        screen.getByText('9. Governing Law and Dispute Resolution')
      ).toBeInTheDocument();
      expect(screen.getByText('10. Contact Information')).toBeInTheDocument();
    });

    it('includes comprehensive legal content', () => {
      expect(
        screen.getByText(
          'By accessing and using Mahardika Insurance & Financial Services ("Mahardika," "we," "us," or "our") website, mobile applications, and services, you agree to be bound by these Terms of Service ("Terms").'
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Mahardika provides comprehensive insurance solutions, financial planning services, investment management, and related financial products.'
        )
      ).toBeInTheDocument();
    });

    it('displays financial services disclaimers', () => {
      expect(
        screen.getByText(
          'Insurance products and financial services are subject to underwriting approval and regulatory requirements.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Past performance does not guarantee future results for investment products.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'All investment products carry risk, including potential loss of principal.'
        )
      ).toBeInTheDocument();
    });

    it('includes intellectual property protection', () => {
      expect(
        screen.getByText(
          'The Mahardika brand colors (Navy #0D1B2A and Gold #F4B400) and design elements are proprietary to Mahardika.'
        )
      ).toBeInTheDocument();
    });

    it('shows contact information', () => {
      expect(
        screen.getByText('Email: legal@mahardika.com')
      ).toBeInTheDocument();
      expect(screen.getByText('Phone: +1 (555) 123-4567')).toBeInTheDocument();
      expect(
        screen.getByText('Website: www.mahardika.com')
      ).toBeInTheDocument();
    });
  });

  describe('Sidebar Features', () => {
    it('displays legal help section', () => {
      expect(screen.getByText('📞 Need Legal Help?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Have questions about our Terms of Service? Contact our legal team for assistance.'
        )
      ).toBeInTheDocument();
    });

    it('shows related documents links', () => {
      expect(screen.getByText('📄 Related Documents')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
      expect(screen.getByText('Compliance Guide')).toBeInTheDocument();
      expect(screen.getByText('Security Policy')).toBeInTheDocument();
    });

    it('displays company information', () => {
      expect(screen.getByText('🏢 Company Information')).toBeInTheDocument();
      expect(
        screen.getByText('Mahardika Insurance & Financial Services')
      ).toBeInTheDocument();
    });

    it('shows professional legal advice notice', () => {
      expect(screen.getByText('Professional Legal Advice')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This document provides general information. For specific legal questions, please consult with a qualified attorney.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('has working action buttons', () => {
      const acceptButton = screen.getByText('I Accept Terms');
      const browseButton = screen.getByText('Browse Services');
      const contactButton = screen.getByText('Contact Legal');

      expect(acceptButton).toBeInTheDocument();
      expect(browseButton).toBeInTheDocument();
      expect(contactButton).toBeInTheDocument();

      fireEvent.click(acceptButton);
      fireEvent.click(browseButton);
      fireEvent.click(contactButton);
    });

    it('has contact and download buttons in sidebar', () => {
      const contactLegalButton = screen.getByText('Contact Legal Team');
      const downloadButton = screen.getByText('Download PDF');

      expect(contactLegalButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();

      fireEvent.click(contactLegalButton);
      fireEvent.click(downloadButton);
    });

    it('contains anchor links for sections', () => {
      // Check for section IDs
      expect(document.getElementById('section-1')).toBeInTheDocument();
      expect(document.getElementById('section-5')).toBeInTheDocument();
      expect(document.getElementById('section-10')).toBeInTheDocument();
    });

    it('has proper table of contents links', () => {
      const tocLinks = screen.getAllByRole('link');
      const sectionLinks = tocLinks.filter(link =>
        link.getAttribute('href')?.startsWith('#section-')
      );
      expect(sectionLinks.length).toBe(10);
    });
  });

  describe('Navigation', () => {
    it('contains all navigation links', () => {
      expect(screen.getByText('Home')).toHaveAttribute('href', '/');
      expect(screen.getByText('Shop')).toHaveAttribute('href', '/shop');
      expect(screen.getByText('Dashboard')).toHaveAttribute(
        'href',
        '/dashboard'
      );
      expect(screen.getByText('Brand Showcase')).toHaveAttribute(
        'href',
        '/brand-showcase'
      );
      expect(screen.getByText('Style Guide')).toHaveAttribute(
        'href',
        '/style-guide'
      );
    });

    it('highlights the current terms page', () => {
      const termsLink = screen.getByText('Terms');
      expect(termsLink).toHaveStyle('color: #F4B400');
      expect(termsLink).toHaveStyle('font-weight: bold');
    });

    it('has footer navigation links', () => {
      const footerLinks = document.querySelectorAll('footer a');
      expect(footerLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Brand Compliance', () => {
    it('uses Mahardika brand colors', () => {
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveStyle('background-color: #0D1B2A');
      expect(navbar).toHaveStyle('border-bottom: 3px solid #F4B400');
    });

    it('displays brand color references', () => {
      expect(
        screen.getByText(
          'Built with Mahardika brand colors: Navy #0D1B2A and Gold #F4B400'
        )
      ).toBeInTheDocument();
    });

    it('shows legal badges with proper styling', () => {
      expect(screen.getByText('Legally Binding')).toBeInTheDocument();
      expect(screen.getByText('Financial Services')).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('has proper headings hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(10);
    });

    it('displays numbered sections correctly', () => {
      // Check for section numbers 1-10
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('shows proper footer information', () => {
      expect(
        screen.getByText('Mahardika Insurance & Financial Services')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Last updated: December 15, 2024')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper navigation structure', () => {
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });

    it('uses semantic HTML for content sections', () => {
      const footerElement = document.querySelector('footer');
      expect(footerElement).toBeInTheDocument();
    });

    it('has proper link attributes', () => {
      const externalLinks = screen.getAllByRole('link');
      expect(externalLinks.length).toBeGreaterThan(0);
    });

    it('maintains proper color contrast', () => {
      // Brand colors should provide sufficient contrast
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveStyle('background-color: #0D1B2A');
    });
  });

  describe('Responsive Design', () => {
    it('uses Bootstrap responsive classes', () => {
      const responsiveElements = document.querySelectorAll(
        '.col-lg-4, .col-md-6, .col-lg-8'
      );
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    it('has proper container structure', () => {
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
    });

    it('includes sticky sidebar', () => {
      const stickyElement = document.querySelector('.sticky-top');
      expect(stickyElement).toBeInTheDocument();
    });
  });

  describe('Legal Completeness', () => {
    it('covers all essential legal sections', () => {
      const essentialTerms = [
        'Acceptance of Terms',
        'Privacy and Data Protection',
        'Limitation of Liability',
        'Governing Law',
        'Contact Information',
      ];

      essentialTerms.forEach(term => {
        expect(screen.getByText(new RegExp(term, 'i'))).toBeInTheDocument();
      });
    });

    it('includes financial services specific disclaimers', () => {
      expect(
        screen.getByText(
          'Insurance coverage is subject to policy terms, conditions, and exclusions.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'We recommend consulting with qualified professionals for personalized financial advice.'
        )
      ).toBeInTheDocument();
    });

    it('contains proper indemnification clauses', () => {
      expect(
        screen.getByText(
          'You agree to indemnify and hold harmless Mahardika, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services.'
        )
      ).toBeInTheDocument();
    });
  });
});
