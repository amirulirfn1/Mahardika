import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mah/ui';

export default function NotFound() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <BrandCard
              variant="navy-outline"
              size="lg"
              className="text-center"
              style={{ backgroundColor: 'white' }}
            >
              {/* Error Number */}
              <div className="mb-4">
                <h1
                  className="display-1 fw-bold mb-0"
                  style={{
                    color: colors.gold,
                    fontSize: '8rem',
                    lineHeight: '1',
                  }}
                >
                  404
                </h1>
                <div
                  className="h-2 mx-auto"
                  style={{
                    width: '100px',
                    backgroundColor: colors.navy,
                    borderRadius: '0.5rem',
                  }}
                />
              </div>

              {/* Error Message */}
              <div className="mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: colors.navy }}>
                  Page Not Found
                </h2>
                <p className="lead mb-0" style={{ color: colors.gray[600] }}>
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved. Don&apos;t worry, you can find what you need from
                  our homepage.
                </p>
              </div>

              {/* Illustration */}
              <div className="mb-4">
                <div
                  className="mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: colors.gray[100],
                    borderRadius: '50%',
                  }}
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke={colors.navy}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke={colors.gold}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke={colors.gray[400]}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link href="/">
                  <BrandButton variant="navy" size="lg">
                    Go to Homepage
                  </BrandButton>
                </Link>
                <Link href="/shop">
                  <BrandButton variant="gold-outline" size="lg">
                    Browse Insurance
                  </BrandButton>
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-4 pt-4 border-top">
                <p className="small mb-0" style={{ color: colors.gray[500] }}>
                  Need help? Contact our support team at{' '}
                  <a
                    href="mailto:support@mahardika.com"
                    style={{ color: colors.navy }}
                    className="text-decoration-none"
                  >
                    support@mahardika.com
                  </a>
                </p>
              </div>
            </BrandCard>
          </div>
        </div>
      </div>
    </div>
  );
}
