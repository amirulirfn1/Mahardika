import { colors } from '@mahardika/ui';
import AgencyGrid from '../../components/AgencyGrid';

// Mock data for demonstration
const mockAgencies = [
  {
    id: '1',
    name: 'Premium Insurance Solutions',
    slug: 'premium-insurance',
    price: '$89/month',
    speed: '24 hours',
    reliability: 5,
    description:
      'Comprehensive insurance coverage with personalized service and competitive rates for individuals and businesses.',
    logo_url:
      'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
    website_url: 'https://premiuminsurance.example.com',
    contact_phone: '+1 (555) 123-4567',
    specialties: [
      'Auto Insurance',
      'Home Insurance',
      'Life Insurance',
      'Business Insurance',
    ],
    location: 'New York, NY',
  },
  {
    id: '2',
    name: 'SecureLife Insurance',
    slug: 'securelife-insurance',
    price: '$125/month',
    speed: '2-3 days',
    reliability: 4,
    description:
      'Trusted insurance provider offering comprehensive life and health insurance solutions with excellent customer support.',
    logo_url:
      'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop',
    website_url: 'https://securelife.example.com',
    contact_phone: '+1 (555) 234-5678',
    specialties: ['Life Insurance', 'Health Insurance', 'Disability Insurance'],
    location: 'Los Angeles, CA',
  },
  {
    id: '3',
    name: 'Guardian Auto & Home',
    slug: 'guardian-auto-home',
    price: '$76/month',
    speed: '1-2 days',
    reliability: 4,
    description:
      'Specialized in auto and home insurance with fast claims processing and 24/7 customer service.',
    logo_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    website_url: 'https://guardianauto.example.com',
    contact_phone: '+1 (555) 345-6789',
    specialties: ['Auto Insurance', 'Home Insurance', 'Renters Insurance'],
    location: 'Chicago, IL',
  },
  {
    id: '4',
    name: 'Alliance Business Insurance',
    slug: 'alliance-business',
    price: '$245/month',
    speed: '3-5 days',
    reliability: 5,
    description:
      'Leading provider of commercial insurance solutions for small and medium businesses across the nation.',
    website_url: 'https://alliancebiz.example.com',
    contact_phone: '+1 (555) 456-7890',
    specialties: [
      'Business Insurance',
      'Professional Liability',
      'Workers Compensation',
      'Cyber Insurance',
    ],
    location: 'Houston, TX',
  },
  {
    id: '5',
    name: 'FamilyFirst Insurance',
    slug: 'familyfirst-insurance',
    price: '$95/month',
    speed: '24 hours',
    reliability: 4,
    description:
      'Family-focused insurance agency providing personalized coverage options for all stages of life.',
    logo_url:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100&h=100&fit=crop',
    website_url: 'https://familyfirst.example.com',
    contact_phone: '+1 (555) 567-8901',
    specialties: [
      'Family Insurance',
      'Child Insurance',
      'Senior Insurance',
      'Travel Insurance',
    ],
    location: 'Miami, FL',
  },
  {
    id: '6',
    name: 'TechGuard Insurance',
    slug: 'techguard-insurance',
    price: '$156/month',
    speed: '2-4 days',
    reliability: 3,
    description:
      'Innovative insurance solutions for tech companies and digital businesses with comprehensive cyber coverage.',
    logo_url:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
    website_url: 'https://techguard.example.com',
    contact_phone: '+1 (555) 678-9012',
    specialties: [
      'Cyber Insurance',
      'Tech E&O',
      'Data Breach Coverage',
      'IP Insurance',
    ],
    location: 'San Francisco, CA',
  },
];

export default function AgenciesPage() {
  return (
    <div style={{ backgroundColor: colors.gray[50], minHeight: '100vh' }}>
      {/* Header Section */}
      <div
        className="py-5"
        style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold text-white mb-3">
                Insurance Agencies
              </h1>
              <p className="lead text-white-50 mb-4">
                Compare and choose from our network of trusted insurance
                providers. Find the perfect coverage for your needs with
                competitive rates and excellent service.
              </p>
              <div
                className="mx-auto"
                style={{
                  width: '100px',
                  height: '4px',
                  backgroundColor: colors.gold,
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="py-5">
        <div className="container">
          <AgencyGrid agencies={mockAgencies} />
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-5" style={{ backgroundColor: colors.navy }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="h3 fw-bold text-white mb-3">
                Need Help Choosing?
              </h2>
              <p className="text-white-50 mb-4">
                Our insurance experts are here to help you find the perfect
                coverage. Get personalized recommendations based on your
                specific needs.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a
                  href="tel:+1-800-MAHARDIKA"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: colors.gold,
                    color: colors.navy,
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: 'none',
                    textDecoration: 'none',
                  }}
                >
                  📞 Call an Expert
                </a>
                <a
                  href="/contact"
                  className="btn btn-lg btn-outline-light"
                  style={{
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  💬 Live Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
