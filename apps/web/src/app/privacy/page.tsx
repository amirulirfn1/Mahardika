import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

export default function PrivacyPolicy() {
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
                Privacy Policy
              </h1>
              <p className="lead text-white-50 mb-4">
                Your privacy is important to us. This policy explains how
                Mahardika collects, uses, and protects your personal
                information.
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

      {/* Content Section */}
      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Last Updated */}
              <div className="mb-4">
                <BrandCard variant="gold-outline" size="sm">
                  <div className="d-flex align-items-center">
                    <div
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: colors.gold,
                        borderRadius: '50%',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <polyline
                          points="12,6 12,12 16,14"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h6 className="mb-0" style={{ color: colors.navy }}>
                        Last Updated
                      </h6>
                      <p
                        className="mb-0 small"
                        style={{ color: colors.gray[600] }}
                      >
                        January 15, 2024
                      </p>
                    </div>
                  </div>
                </BrandCard>
              </div>

              {/* Introduction */}
              <BrandCard
                variant="navy-outline"
                size="lg"
                className="mb-4"
                style={{ backgroundColor: 'white' }}
              >
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  Introduction
                </h2>
                <p style={{ color: colors.gray[700] }}>
                  At Mahardika Insurance Services, we are committed to
                  protecting your privacy and ensuring the security of your
                  personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you use our services or visit our website.
                </p>
                <p style={{ color: colors.gray[700] }}>
                  By using our services, you consent to the collection and use
                  of your information as described in this policy.
                </p>
              </BrandCard>

              {/* Information We Collect */}
              <BrandCard
                variant="navy-outline"
                size="lg"
                className="mb-4"
                style={{ backgroundColor: 'white' }}
              >
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  Information We Collect
                </h2>

                <h5 className="fw-semibold mb-2" style={{ color: colors.navy }}>
                  Personal Information
                </h5>
                <ul className="mb-3" style={{ color: colors.gray[700] }}>
                  <li>Name, address, phone number, and email address</li>
                  <li>Date of birth and Social Security number</li>
                  <li>Driver's license information</li>
                  <li>Financial information for premium payments</li>
                  <li>Insurance history and claims information</li>
                </ul>

                <h5 className="fw-semibold mb-2" style={{ color: colors.navy }}>
                  Usage Information
                </h5>
                <ul className="mb-0" style={{ color: colors.gray[700] }}>
                  <li>Website usage patterns and preferences</li>
                  <li>Device information and IP addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Communication preferences and history</li>
                </ul>
              </BrandCard>

              {/* How We Use Information */}
              <BrandCard
                variant="navy-outline"
                size="lg"
                className="mb-4"
                style={{ backgroundColor: 'white' }}
              >
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  How We Use Your Information
                </h2>

                <div className="row">
                  <div className="col-md-6">
                    <h6
                      className="fw-semibold mb-2"
                      style={{ color: colors.gold }}
                    >
                      Service Provision
                    </h6>
                    <ul
                      className="small mb-3"
                      style={{ color: colors.gray[700] }}
                    >
                      <li>Process insurance applications</li>
                      <li>Provide quotes and recommendations</li>
                      <li>Handle claims and customer service</li>
                      <li>Manage policy renewals</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6
                      className="fw-semibold mb-2"
                      style={{ color: colors.gold }}
                    >
                      Communication
                    </h6>
                    <ul
                      className="small mb-3"
                      style={{ color: colors.gray[700] }}
                    >
                      <li>Send policy updates and notices</li>
                      <li>Provide customer support</li>
                      <li>Share important account information</li>
                      <li>Marketing communications (with consent)</li>
                    </ul>
                  </div>
                </div>
              </BrandCard>

              {/* Data Protection */}
              <BrandCard variant="navy-outline" size="lg" className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  Data Protection & Security
                </h2>
                <p className="mb-3" style={{ color: colors.gray[700] }}>
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <div
                      className="d-flex align-items-center p-3"
                      style={{
                        backgroundColor: colors.gray[50],
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: colors.navy,
                          borderRadius: '50%',
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke={colors.gold}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h6
                          className="mb-0 small fw-semibold"
                          style={{ color: colors.navy }}
                        >
                          SSL Encryption
                        </h6>
                        <p
                          className="mb-0 small"
                          style={{ color: colors.gray[600] }}
                        >
                          All data transmission is encrypted
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div
                      className="d-flex align-items-center p-3"
                      style={{
                        backgroundColor: colors.gray[50],
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: colors.navy,
                          borderRadius: '50%',
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                            stroke={colors.gold}
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="16" r="1" fill={colors.gold} />
                          <path
                            d="M7 11V7a5 5 0 0 1 10 0v4"
                            stroke={colors.gold}
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h6
                          className="mb-0 small fw-semibold"
                          style={{ color: colors.navy }}
                        >
                          Secure Storage
                        </h6>
                        <p
                          className="mb-0 small"
                          style={{ color: colors.gray[600] }}
                        >
                          Protected data centers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </BrandCard>

              {/* Your Rights */}
              <BrandCard
                variant="navy-outline"
                size="lg"
                className="mb-4"
                style={{ backgroundColor: 'white' }}
              >
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  Your Rights
                </h2>
                <p className="mb-3" style={{ color: colors.gray[700] }}>
                  You have certain rights regarding your personal information:
                </p>

                <div className="row g-3">
                  {[
                    {
                      title: 'Access',
                      desc: 'Request copies of your personal data',
                    },
                    {
                      title: 'Correction',
                      desc: 'Request correction of inaccurate data',
                    },
                    {
                      title: 'Deletion',
                      desc: 'Request deletion of your data',
                    },
                    {
                      title: 'Portability',
                      desc: 'Request transfer of your data',
                    },
                  ].map((right, index) => (
                    <div key={index} className="col-sm-6">
                      <div
                        className="d-flex align-items-start p-3"
                        style={{
                          backgroundColor: colors.gray[50],
                          borderRadius: '0.5rem',
                          border: `1px solid ${colors.gray[200]}`,
                        }}
                      >
                        <div
                          className="me-3 mt-1 d-flex align-items-center justify-content-center"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: colors.gold,
                            borderRadius: '50%',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h6
                            className="mb-1 small fw-semibold"
                            style={{ color: colors.navy }}
                          >
                            {right.title}
                          </h6>
                          <p
                            className="mb-0 small"
                            style={{ color: colors.gray[600] }}
                          >
                            {right.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </BrandCard>

              {/* Contact Information */}
              <BrandCard variant="gold-outline" size="lg" className="mb-4">
                <h2 className="h4 fw-bold mb-3" style={{ color: colors.navy }}>
                  Contact Us
                </h2>
                <p className="mb-3" style={{ color: colors.gray[700] }}>
                  If you have questions about this Privacy Policy or wish to
                  exercise your rights, please contact us:
                </p>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: colors.navy,
                          borderRadius: '50%',
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                            stroke={colors.gold}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <polyline
                            points="22,6 12,13 2,6"
                            stroke={colors.gold}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <h6
                        className="fw-semibold mb-1"
                        style={{ color: colors.navy }}
                      >
                        Email
                      </h6>
                      <p
                        className="small mb-0"
                        style={{ color: colors.gray[600] }}
                      >
                        privacy@mahardika.com
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: colors.navy,
                          borderRadius: '50%',
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.44 4.08 6 5.92C6.2 6.4 6.04 6.96 5.64 7.32L4.12 8.84C5.32 11.84 7.76 14.28 10.76 15.48L12.28 13.96C12.64 13.6 13.2 13.44 13.68 13.64C15.52 14.2 17.52 14.48 19.52 14.48C20.12 14.48 20.6 14.96 20.6 15.56V18.56C20.6 19.16 20.12 19.64 19.52 19.64Z"
                            stroke={colors.gold}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <h6
                        className="fw-semibold mb-1"
                        style={{ color: colors.navy }}
                      >
                        Phone
                      </h6>
                      <p
                        className="small mb-0"
                        style={{ color: colors.gray[600] }}
                      >
                        1-800-MAHARDIKA
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: colors.navy,
                          borderRadius: '50%',
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
                            stroke={colors.gold}
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="10"
                            r="3"
                            stroke={colors.gold}
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h6
                        className="fw-semibold mb-1"
                        style={{ color: colors.navy }}
                      >
                        Address
                      </h6>
                      <p
                        className="small mb-0"
                        style={{ color: colors.gray[600] }}
                      >
                        123 Insurance Plaza
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </BrandCard>

              {/* Back to Home */}
              <div className="text-center">
                <Link href="/">
                  <BrandButton variant="navy" size="lg">
                    Back to Homepage
                  </BrandButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
