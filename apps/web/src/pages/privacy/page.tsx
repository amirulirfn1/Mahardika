import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mah/ui';

export default function PrivacyPolicy() {
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
          content: '💡';
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
                <span className="breadcrumb-item active">Privacy Policy</span>
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>

              <h1 className="animate-fade-in-up animate-delay-2 display-4 fw-bold text-white mb-3">
                Privacy Policy
              </h1>
              <p className="animate-fade-in-up animate-delay-3 lead text-white-50 mb-4">
                Your privacy is important to us. This policy explains how
                Mahardika collects, uses, and protects your personal
                information.
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
                      <p className="mb-0 text-muted">December 15, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Sections */}
              <div className="animate-slide-in-up animate-delay-1">
                <div className="glass-card section-card p-5 rounded-3 mb-5">
                  <h2 className="section-title mb-4">Information We Collect</h2>
                  <div className="text-content">
                    <p className="mb-4">
                      We collect information you provide directly to us, such as
                      when you create an account, make a purchase, or contact us
                      for support.
                    </p>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-start">
                        <span
                          className="me-3"
                          style={{ color: colors.gold, fontSize: '1.2rem' }}
                        >
                          •
                        </span>
                        <span>
                          Personal identification information (name, email,
                          phone number)
                        </span>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <span
                          className="me-3"
                          style={{ color: colors.gold, fontSize: '1.2rem' }}
                        >
                          •
                        </span>
                        <span>
                          Financial information for policy applications
                        </span>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <span
                          className="me-3"
                          style={{ color: colors.gold, fontSize: '1.2rem' }}
                        >
                          •
                        </span>
                        <span>Usage data and preferences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="animate-slide-in-up animate-delay-2">
                <div className="glass-card section-card p-5 rounded-3 mb-5">
                  <h2 className="section-title mb-4">
                    How We Use Your Information
                  </h2>
                  <div className="text-content">
                    <p className="mb-4">
                      We use the information we collect to provide, maintain,
                      and improve our services, process transactions, and
                      communicate with you.
                    </p>
                    <div className="highlight-box">
                      <strong>Important:</strong> We never sell your personal
                      information to third parties. Your data is used solely to
                      provide you with better insurance services.
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-slide-in-up animate-delay-3">
                <div className="glass-card section-card p-5 rounded-3 mb-5">
                  <h2 className="section-title mb-4">Data Security</h2>
                  <div className="text-content">
                    <p className="mb-4">
                      We implement industry-standard security measures to
                      protect your personal information against unauthorized
                      access, alteration, disclosure, or destruction.
                    </p>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start">
                          <span
                            className="me-3"
                            style={{ color: colors.gold, fontSize: '1.5rem' }}
                          >
                            🔒
                          </span>
                          <div>
                            <h6
                              className="fw-bold mb-2"
                              style={{ color: colors.navy }}
                            >
                              Encryption
                            </h6>
                            <p className="mb-0 small text-muted">
                              All data is encrypted in transit and at rest
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start">
                          <span
                            className="me-3"
                            style={{ color: colors.gold, fontSize: '1.5rem' }}
                          >
                            🛡️
                          </span>
                          <div>
                            <h6
                              className="fw-bold mb-2"
                              style={{ color: colors.navy }}
                            >
                              Protection
                            </h6>
                            <p className="mb-0 small text-muted">
                              Advanced security protocols and monitoring
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-slide-in-up animate-delay-4">
                <div className="glass-card section-card p-5 rounded-3 mb-5">
                  <h2 className="section-title mb-4">Your Rights</h2>
                  <div className="text-content">
                    <p className="mb-4">
                      You have the right to access, update, or delete your
                      personal information. Contact us if you would like to
                      exercise these rights.
                    </p>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div
                          className="text-center p-3 rounded-3"
                          style={{ background: `${colors.navy}05` }}
                        >
                          <span style={{ fontSize: '2rem' }}>📋</span>
                          <h6
                            className="mt-2 fw-bold"
                            style={{ color: colors.navy }}
                          >
                            Access
                          </h6>
                          <p className="small text-muted mb-0">
                            Request your data
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div
                          className="text-center p-3 rounded-3"
                          style={{ background: `${colors.navy}05` }}
                        >
                          <span style={{ fontSize: '2rem' }}>✏️</span>
                          <h6
                            className="mt-2 fw-bold"
                            style={{ color: colors.navy }}
                          >
                            Update
                          </h6>
                          <p className="small text-muted mb-0">
                            Modify your information
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div
                          className="text-center p-3 rounded-3"
                          style={{ background: `${colors.navy}05` }}
                        >
                          <span style={{ fontSize: '2rem' }}>🗑️</span>
                          <h6
                            className="mt-2 fw-bold"
                            style={{ color: colors.navy }}
                          >
                            Delete
                          </h6>
                          <p className="small text-muted mb-0">
                            Remove your data
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="animate-slide-in-up animate-delay-4">
                <div className="contact-card mb-5">
                  <h3 className="fw-bold mb-3" style={{ color: colors.navy }}>
                    Questions About Privacy?
                  </h3>
                  <p className="text-muted mb-4">
                    If you have any questions about this Privacy Policy, please
                    contact us.
                  </p>
                  <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <BrandButton
                      variant="navy"
                      size="lg"
                      onClick={() =>
                        (window.location.href = 'mailto:privacy@mahardika.com')
                      }
                    >
                      📧 Email Us
                    </BrandButton>
                    <BrandButton
                      variant="gold-outline"
                      size="lg"
                      onClick={() =>
                        (window.location.href = 'tel:+1-555-123-4567')
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
}
