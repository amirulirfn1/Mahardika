import React from 'react';
import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

const TermsOfServicePage = () => {
  const termsData = {
    lastUpdated: 'December 15, 2024',
    effectiveDate: 'January 1, 2024',
    companyName: 'Mahardika Insurance & Financial Services',
    contactEmail: 'legal@mahardika.com',
    contactPhone: '+1 (555) 123-4567',
    website: 'www.mahardika.com',
  };

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using Mahardika Insurance & Financial Services ("Mahardika," "we," "us," or "our") website, mobile applications, and services, you agree to be bound by these Terms of Service ("Terms").',
        'If you do not agree to these Terms, please do not use our services. These Terms constitute a legally binding agreement between you and Mahardika.',
        'We reserve the right to modify these Terms at any time. Your continued use of our services after changes indicates your acceptance of the modified Terms.',
      ],
    },
    {
      title: '2. Description of Services',
      content: [
        'Mahardika provides comprehensive insurance solutions, financial planning services, investment management, and related financial products.',
        'Our services include but are not limited to: health insurance, business liability protection, investment portfolio management, retirement planning, and financial consulting.',
        'All services are subject to applicable laws, regulations, and licensing requirements in your jurisdiction.',
        'We reserve the right to modify, suspend, or discontinue any service at any time with or without notice.',
      ],
    },
    {
      title: '3. User Responsibilities',
      content: [
        'You must provide accurate, current, and complete information when using our services.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to notify us immediately of any unauthorized use of your account.',
        'You must be at least 18 years old to use our services or have parental consent.',
        'You agree not to use our services for any unlawful or prohibited activities.',
      ],
    },
    {
      title: '4. Privacy and Data Protection',
      content: [
        'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.',
        'By using our services, you consent to the collection and use of information as described in our Privacy Policy.',
        'We implement industry-standard security measures to protect your personal and financial information.',
        'We may share information with third parties as necessary to provide services, comply with legal requirements, or protect our rights.',
      ],
    },
    {
      title: '5. Financial Services and Insurance',
      content: [
        'Our insurance products and financial services are subject to underwriting guidelines and regulatory approval.',
        'Premiums, deductibles, and coverage limits are specified in your policy documents.',
        'Claims must be reported promptly and in accordance with policy terms.',
        'We reserve the right to investigate claims and request additional documentation.',
      ],
    },
    {
      title: '6. Limitation of Liability',
      content: [
        'Our liability is limited to the maximum extent permitted by law.',
        'We are not liable for indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid by you for our services.',
        'Some jurisdictions do not allow limitations on liability, so these limitations may not apply to you.',
      ],
    },
  ];

  return (
    <div
      style={{
        backgroundColor: colors.gray[50],
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-delay-1 {
          animation-delay: 0.1s;
        }
        .animate-delay-2 {
          animation-delay: 0.2s;
        }
        .animate-delay-3 {
          animation-delay: 0.3s;
        }
        .animate-delay-4 {
          animation-delay: 0.4s;
        }
        .animate-delay-5 {
          animation-delay: 0.5s;
        }
        .animate-delay-6 {
          animation-delay: 0.6s;
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3);
        }

        .section-card {
          position: relative;
          overflow: hidden;
        }

        .section-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(244, 180, 0, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .section-card:hover::before {
          left: 100%;
        }

        .hero-background {
          background: linear-gradient(
            135deg,
            ${colors.navy} 0%,
            ${colors.gray[800]} 100%
          );
          position: relative;
          overflow: hidden;
        }

        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h60v60H0z' /%3E%3Cpath d='M30 30m-18 0a18 18 0 1 1 36 0a18 18 0 1 1-36 0' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.1;
        }

        .icon-container {
          background: linear-gradient(135deg, ${colors.gold} 0%, #ffd700 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(244, 180, 0, 0.3);
          transition: all 0.3s ease;
        }

        .icon-container:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 20px 40px rgba(244, 180, 0, 0.4);
        }

        .section-title {
          background: linear-gradient(
            135deg,
            ${colors.navy} 0%,
            ${colors.gray[700]} 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          position: relative;
          font-size: 1.5rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(135deg, ${colors.gold} 0%, #ffd700 100%);
          border-radius: 2px;
        }

        .text-content {
          line-height: 1.8;
          color: ${colors.gray[700]};
          font-size: 1.1rem;
        }

        .highlight-box {
          background: linear-gradient(
            135deg,
            ${colors.gold}15 0%,
            ${colors.gold}10 100%
          );
          border-left: 4px solid ${colors.gold};
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
          position: relative;
        }

        .highlight-box::before {
          content: '⚖️';
          position: absolute;
          top: -10px;
          left: -2px;
          font-size: 1.5rem;
          background: white;
          padding: 0 8px;
          border-radius: 50%;
        }

        .contact-card {
          background: linear-gradient(
            135deg,
            ${colors.navy}05 0%,
            ${colors.gold}05 100%
          );
          border: 2px solid ${colors.gold}30;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            ${colors.gold}10 0%,
            transparent 70%
          );
          animation: float 8s ease-in-out infinite;
        }

        .breadcrumb-item {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-item:hover {
          color: ${colors.gold};
        }

        .breadcrumb-item.active {
          color: white;
        }

        .content-list {
          list-style: none;
          padding: 0;
        }

        .content-list li {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
        }

        .content-list li::before {
          content: '•';
          color: ${colors.gold};
          font-size: 1.2rem;
          margin-right: 0.75rem;
          margin-top: 0.1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .info-item {
          background: linear-gradient(
            135deg,
            ${colors.navy}05 0%,
            ${colors.gold}05 100%
          );
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid ${colors.gold}20;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 180, 0, 0.15);
        }

        .info-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .info-title {
          font-weight: 700;
          color: ${colors.navy};
          margin-bottom: 0.5rem;
        }

        .info-text {
          color: ${colors.gray[600]};
          font-size: 0.9rem;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          opacity: 0.6,
          zIndex: 1,
        }}
      >
        <div
          className="floating-element"
          style={{
            width: '120px',
            height: '120px',
            background: `linear-gradient(135deg, ${colors.navy}15, ${colors.gold}15)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          opacity: 0.4,
          zIndex: 1,
        }}
      >
        <div
          className="floating-element"
          style={{
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${colors.gold}20, ${colors.navy}20)`,
            borderRadius: '50%',
            filter: 'blur(30px)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Header Section */}
      <div className="hero-background py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              {/* Breadcrumb */}
              <nav className="animate-fade-in-up mb-4">
                <Link href="/" className="breadcrumb-item">
                  Home
                </Link>
                <span className="mx-2 text-white-50">•</span>
                <span className="breadcrumb-item active">Terms of Service</span>
              </nav>

              {/* Icon */}
              <div className="animate-fade-in-up animate-delay-1 mb-4">
                <div
                  className="icon-container mx-auto"
                  style={{ width: '80px', height: '80px' }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.navy}
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </div>
              </div>

              <h1 className="animate-fade-in-up animate-delay-2 display-4 fw-bold text-white mb-3">
                Terms of Service
              </h1>
              <p className="animate-fade-in-up animate-delay-3 lead text-white-50 mb-4">
                Please read these terms carefully before using our services.
                Your use of our platform constitutes acceptance of these terms.
              </p>
              <div className="animate-fade-in-up animate-delay-4">
                <div
                  className="mx-auto"
                  style={{
                    width: '100px',
                    height: '4px',
                    background: `linear-gradient(135deg, ${colors.gold} 0%, #FFD700 100%)`,
                    borderRadius: '0.5rem',
                    boxShadow: `0 4px 15px ${colors.gold}40`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Last Updated */}
              <div className="animate-slide-in-up mb-5">
                <div className="glass-card p-4 rounded-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div
                          className="icon-container me-3"
                          style={{ width: '50px', height: '50px' }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={colors.navy}
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>
                        </div>
                        <div>
                          <h6
                            className="mb-1 fw-bold"
                            style={{ color: colors.navy }}
                          >
                            Last Updated
                          </h6>
                          <p className="mb-0 text-muted">
                            {termsData.lastUpdated}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div
                          className="icon-container me-3"
                          style={{ width: '50px', height: '50px' }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={colors.navy}
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div>
                          <h6
                            className="mb-1 fw-bold"
                            style={{ color: colors.navy }}
                          >
                            Effective Date
                          </h6>
                          <p className="mb-0 text-muted">
                            {termsData.effectiveDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="animate-slide-in-up animate-delay-1 mb-5">
                <div className="highlight-box">
                  <strong>Important Notice:</strong> By using our services, you
                  agree to these terms and conditions. If you do not agree to
                  these terms, please do not use our services.
                </div>
              </div>

              {/* Terms Sections */}
              {sections.map(section => (
                <div
                  key={section.title}
                  className={`animate-slide-in-up animate-delay-${sections.indexOf(section) + 2}`}
                >
                  <div className="glass-card section-card p-5 rounded-3 mb-5">
                    <h2 className="section-title mb-4">{section.title}</h2>
                    <div className="text-content">
                      <ul className="content-list">
                        {section.content.map(item => (
                          <li key={`${section.title}-${item.substring(0, 20)}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Company Information */}
              <div className="animate-slide-in-up animate-delay-6">
                <div className="glass-card p-5 rounded-3 mb-5">
                  <h2 className="section-title mb-4">Company Information</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">🏢</div>
                      <div className="info-title">Company Name</div>
                      <div className="info-text">{termsData.companyName}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">🌐</div>
                      <div className="info-title">Website</div>
                      <div className="info-text">{termsData.website}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">📧</div>
                      <div className="info-title">Legal Email</div>
                      <div className="info-text">{termsData.contactEmail}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">📞</div>
                      <div className="info-title">Contact Phone</div>
                      <div className="info-text">{termsData.contactPhone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="animate-slide-in-up animate-delay-6">
                <div className="contact-card mb-5">
                  <h3 className="fw-bold mb-3" style={{ color: colors.navy }}>
                    Questions About Our Terms?
                  </h3>
                  <p className="text-muted mb-4">
                    If you have any questions about these Terms of Service,
                    please contact our legal team.
                  </p>
                  <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <BrandButton
                      variant="navy"
                      size="lg"
                      onClick={() =>
                        (window.location.href = `mailto:${termsData.contactEmail}`)
                      }
                    >
                      📧 Email Legal Team
                    </BrandButton>
                    <BrandButton
                      variant="gold-outline"
                      size="lg"
                      onClick={() =>
                        (window.location.href = `tel:${termsData.contactPhone}`)
                      }
                    >
                      📞 Call Us
                    </BrandButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
