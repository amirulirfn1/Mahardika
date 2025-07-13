import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';
import AgencyGrid from '../../components/AgencyGrid';

// Enhanced mock data for demonstration
const mockAgencies = [
  {
    id: '1',
    name: 'Premium Insurance Solutions',
    slug: 'premium-insurance',
    price: '$89/month',
    speed: '24 hours',
    reliability: 5,
    description: 'Comprehensive insurance coverage with personalized service and competitive rates for individuals and businesses.',
    logo_url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
    website_url: 'https://premiuminsurance.example.com',
    contact_phone: '+1 (555) 123-4567',
    specialties: ['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Business Insurance'],
    location: 'New York, NY',
    rating: 4.9,
    reviews: 234,
    yearsExperience: 15,
    clientsServed: '10K+',
    badge: 'Top Rated',
    badgeColor: colors.gold
  },
  {
    id: '2',
    name: 'SecureLife Insurance',
    slug: 'securelife-insurance',
    price: '$125/month',
    speed: '2-3 days',
    reliability: 4,
    description: 'Trusted insurance provider offering comprehensive life and health insurance solutions with excellent customer support.',
    logo_url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop',
    website_url: 'https://securelife.example.com',
    contact_phone: '+1 (555) 234-5678',
    specialties: ['Life Insurance', 'Health Insurance', 'Disability Insurance'],
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviews: 189,
    yearsExperience: 12,
    clientsServed: '8K+',
    badge: 'Premium',
    badgeColor: colors.navy
  },
  {
    id: '3',
    name: 'Guardian Auto & Home',
    slug: 'guardian-auto-home',
    price: '$76/month',
    speed: '1-2 days',
    reliability: 4,
    description: 'Specialized in auto and home insurance with fast claims processing and 24/7 customer service.',
    logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    website_url: 'https://guardianauto.example.com',
    contact_phone: '+1 (555) 345-6789',
    specialties: ['Auto Insurance', 'Home Insurance', 'Renters Insurance'],
    location: 'Chicago, IL',
    rating: 4.7,
    reviews: 156,
    yearsExperience: 10,
    clientsServed: '6K+',
    badge: 'Fast Response',
    badgeColor: '#10B981'
  },
  {
    id: '4',
    name: 'Alliance Business Insurance',
    slug: 'alliance-business',
    price: '$245/month',
    speed: '3-5 days',
    reliability: 5,
    description: 'Leading provider of commercial insurance solutions for small and medium businesses across the nation.',
    website_url: 'https://alliancebiz.example.com',
    contact_phone: '+1 (555) 456-7890',
    specialties: ['Business Insurance', 'Professional Liability', 'Workers Compensation', 'Cyber Insurance'],
    location: 'Houston, TX',
    rating: 4.9,
    reviews: 298,
    yearsExperience: 20,
    clientsServed: '15K+',
    badge: 'Enterprise',
    badgeColor: '#8B5CF6'
  },
  {
    id: '5',
    name: 'FamilyFirst Insurance',
    slug: 'familyfirst-insurance',
    price: '$95/month',
    speed: '24 hours',
    reliability: 4,
    description: 'Family-focused insurance agency providing personalized coverage options for all stages of life.',
    logo_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100&h=100&fit=crop',
    website_url: 'https://familyfirst.example.com',
    contact_phone: '+1 (555) 567-8901',
    specialties: ['Family Insurance', 'Child Insurance', 'Senior Insurance', 'Travel Insurance'],
    location: 'Miami, FL',
    rating: 4.6,
    reviews: 167,
    yearsExperience: 8,
    clientsServed: '5K+',
    badge: 'Family Focused',
    badgeColor: '#F59E0B'
  },
  {
    id: '6',
    name: 'TechGuard Insurance',
    slug: 'techguard-insurance',
    price: '$156/month',
    speed: '2-4 days',
    reliability: 3,
    description: 'Innovative insurance solutions for tech companies and digital businesses with comprehensive cyber coverage.',
    logo_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
    website_url: 'https://techguard.example.com',
    contact_phone: '+1 (555) 678-9012',
    specialties: ['Cyber Insurance', 'Tech E&O', 'Data Breach Coverage', 'IP Insurance'],
    location: 'San Francisco, CA',
    rating: 4.5,
    reviews: 134,
    yearsExperience: 6,
    clientsServed: '3K+',
    badge: 'Tech Specialist',
    badgeColor: '#06B6D4'
  },
];

export default function AgenciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [animatedCards, setAnimatedCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimatedCards(true), 500);
  }, []);

  const filteredAgencies = mockAgencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'top-rated') return matchesSearch && agency.rating >= 4.8;
    if (selectedFilter === 'fast-response') return matchesSearch && agency.speed.includes('24 hours');
    if (selectedFilter === 'business') return matchesSearch && agency.specialties.some(spec => spec.includes('Business'));
    
    return matchesSearch;
  });

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .hero-animate {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .card-animate {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .card-animate-delay-1 { animation-delay: 0.1s; }
        .card-animate-delay-2 { animation-delay: 0.2s; }
        .card-animate-delay-3 { animation-delay: 0.3s; }
        .card-animate-delay-4 { animation-delay: 0.4s; }
        .card-animate-delay-5 { animation-delay: 0.5s; }
        .card-animate-delay-6 { animation-delay: 0.6s; }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .pulse-element {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .agency-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .agency-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(244,180,0,0.1), transparent);
          transition: left 0.6s;
        }
        
        .agency-card:hover::before {
          left: 100%;
        }
        
        .agency-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .filter-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, ${colors.navy}, ${colors.gold});
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13,27,42,0.3);
        }
        
        .search-container {
          position: relative;
          overflow: hidden;
        }
        
        .search-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .search-container.focused::before {
          left: 100%;
        }
      `}</style>

      <div style={{ backgroundColor: colors.gray[50], minHeight: '100vh', position: 'relative' }}>
        {/* Floating Background Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '8%', opacity: 0.6, zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '120px', 
            height: '120px', 
            background: `linear-gradient(135deg, ${colors.navy}15, ${colors.gold}15)`,
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', opacity: 0.6, zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '80px', 
            height: '80px', 
            background: `linear-gradient(45deg, ${colors.gold}20, ${colors.navy}20)`,
            borderRadius: '30px',
            filter: 'blur(30px)',
            animationDelay: '3s'
          }} />
        </div>

        {/* Enhanced Hero Section */}
        <div
          className="hero-animate"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, ${colors.navy} 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, ${colors.gold}20 0%, transparent 50%),
              linear-gradient(135deg, ${colors.navy} 0%, #1e3a8a 100%)
            `,
            color: 'white',
            padding: '80px 0 100px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Elements */}
          <div style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.3 }}>
            <div className="pulse-element" style={{ fontSize: '4rem' }}>🏢</div>
          </div>
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.3 }}>
            <div className="pulse-element" style={{ fontSize: '3rem', animationDelay: '1s' }}>🛡️</div>
          </div>

          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                {/* Badge */}
                <div className="mb-4">
                  <span style={{
                    background: `linear-gradient(135deg, ${colors.gold}, #FFD700)`,
                    color: colors.navy,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(244,180,0,0.3)'
                  }}>
                    🏆 Trusted by 50,000+ Customers
                  </span>
                </div>

                <h1 
                  className="display-3 fw-bold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, white 0%, #f0f9ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Find Your Perfect Insurance Partner
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.3rem',
                  opacity: 0.9,
                  maxWidth: '600px',
                  margin: '0 auto 2rem'
                }}>
                  Compare trusted insurance agencies, read real reviews, and get personalized quotes. 
                  Your financial security is our priority.
                </p>

                {/* Enhanced Search & Filter Section */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div 
                    className="search-container"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      padding: '12px',
                      borderRadius: '20px',
                      marginBottom: '24px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ 
                          position: 'absolute', 
                          left: '20px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: colors.gray[400],
                          fontSize: '20px'
                        }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search by agency name, location, or specialty..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            padding: '16px 20px 16px 55px',
                            borderRadius: '16px',
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: colors.navy
                          }}
                        />
                      </div>
                      <BrandButton variant="navy" size="lg" style={{ minWidth: '140px' }}>
                        Search
                      </BrandButton>
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    {[
                      { key: 'all', label: 'All Agencies', icon: '🏢' },
                      { key: 'top-rated', label: 'Top Rated', icon: '⭐' },
                      { key: 'fast-response', label: 'Fast Response', icon: '⚡' },
                      { key: 'business', label: 'Business Focus', icon: '💼' }
                    ].map(filter => (
                      <button
                        key={filter.key}
                        className={`filter-btn ${selectedFilter === filter.key ? 'active' : ''}`}
                        onClick={() => setSelectedFilter(filter.key)}
                        style={{
                          background: selectedFilter === filter.key 
                            ? `linear-gradient(135deg, ${colors.navy}, ${colors.gold})`
                            : 'rgba(255,255,255,0.9)',
                          color: selectedFilter === filter.key ? 'white' : colors.navy,
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: selectedFilter === filter.key 
                            ? '0 8px 25px rgba(13,27,42,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span>{filter.icon}</span>
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    width: '100px',
                    height: '4px',
                    backgroundColor: colors.gold,
                    borderRadius: '0.5rem',
                    margin: '2rem auto'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results Section */}
        <div className="container py-5">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 style={{ color: colors.navy, fontWeight: 'bold' }}>
                  {filteredAgencies.length} {filteredAgencies.length === 1 ? 'Agency' : 'Agencies'} Found
                </h2>
                <div className="d-flex align-items-center gap-3">
                  <span style={{ color: colors.gray[600], fontSize: '14px' }}>Sort by:</span>
                  <select 
                    style={{
                      border: `2px solid ${colors.gray[200]}`,
                      borderRadius: '12px',
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: colors.navy,
                      fontWeight: 'medium'
                    }}
                  >
                    <option>Highest Rated</option>
                    <option>Lowest Price</option>
                    <option>Fastest Response</option>
                    <option>Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Agency Grid */}
          <div className="row g-4">
            {filteredAgencies.map((agency, index) => (
              <div key={agency.id} className={`col-lg-6 col-xl-4 ${animatedCards ? `card-animate card-animate-delay-${(index % 6) + 1}` : ''}`}>
                <div className="agency-card h-100">
                  <BrandCard
                    variant="navy-outline"
                    size="lg"
                    style={{
                      height: '100%',
                      border: `2px solid ${colors.gray[200]}`,
                      borderRadius: '20px',
                      position: 'relative',
                      background: 'white'
                    }}
                  >
                    {/* Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: agency.badgeColor,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        zIndex: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {agency.badge}
                    </div>

                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          backgroundImage: agency.logo_url ? `url(${agency.logo_url})` : 'none',
                          backgroundColor: agency.logo_url ? 'transparent' : colors.gray[100],
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          marginRight: '16px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}
                      >
                        {!agency.logo_url && '🏢'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1.3rem', 
                          fontWeight: 'bold', 
                          color: colors.navy,
                          marginBottom: '4px'
                        }}>
                          {agency.name}
                        </h3>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: colors.gray[600], fontSize: '14px' }}>📍 {agency.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Stats */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="d-flex align-items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <span
                            key={star}
                            style={{
                              color: star <= Math.floor(agency.rating) ? colors.gold : colors.gray[300],
                              fontSize: '16px'
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                        <span style={{ marginLeft: '8px', fontWeight: 'bold', color: colors.navy }}>
                          {agency.rating} ({agency.reviews} reviews)
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: colors.gray[600] }}>
                        {agency.yearsExperience} years • {agency.clientsServed} clients
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ 
                      color: colors.gray[700], 
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontSize: '15px'
                    }}>
                      {agency.description}
                    </p>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.navy, marginBottom: '8px' }}>
                        Specialties:
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {agency.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            style={{
                              background: `${colors.navy}10`,
                              color: colors.navy,
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'medium'
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                        {agency.specialties.length > 3 && (
                          <span style={{ fontSize: '12px', color: colors.gray[600] }}>
                            +{agency.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ 
                      marginTop: 'auto', 
                      paddingTop: '20px', 
                      borderTop: `1px solid ${colors.gray[200]}` 
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.navy }}>
                            {agency.price}
                          </div>
                          <div style={{ fontSize: '12px', color: colors.gray[600] }}>
                            Response: {agency.speed}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <BrandButton variant="outline-navy" size="sm">
                            View Details
                          </BrandButton>
                          <BrandButton variant="gold" size="sm">
                            Get Quote
                          </BrandButton>
                        </div>
                      </div>
                    </div>
                  </BrandCard>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div 
          style={{ 
            background: `linear-gradient(135deg, ${colors.navy} 0%, #1e3a8a 100%)`,
            color: 'white',
            padding: '80px 0',
            position: 'relative'
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
                <h2 className="h3 fw-bold mb-3">
                  Need Expert Guidance?
                </h2>
                <p className="mb-4" style={{ fontSize: '18px', opacity: 0.9 }}>
                  Our insurance experts are here to help you find the perfect coverage. 
                  Get personalized recommendations based on your specific needs.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <BrandButton
                    variant="gold"
                    size="lg"
                    style={{
                      minWidth: '200px',
                      fontSize: '16px',
                      padding: '16px 24px'
                    }}
                  >
                    📞 Call an Expert
                  </BrandButton>
                  <BrandButton
                    variant="outline-navy"
                    size="lg"
                    style={{
                      minWidth: '200px',
                      fontSize: '16px',
                      padding: '16px 24px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white',
                      color: 'white'
                    }}
                  >
                    💬 Live Chat
                  </BrandButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
