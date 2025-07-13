import { colors, theme } from '@mahardika/ui';

/**
 * Loading Skeleton Component - Mahardika Platform
 * Modern loading states with Fiverr-inspired design
 */

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'text',
  animation = 'pulse',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return { borderRadius: '50%' };
      case 'rounded':
        return { borderRadius: theme.borderRadius.lg };
      case 'rectangular':
        return { borderRadius: theme.borderRadius.md };
      case 'text':
      default:
        return { borderRadius: theme.borderRadius.sm };
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'wave':
        return 'skeleton-wave';
      case 'none':
        return '';
      case 'pulse':
      default:
        return 'skeleton-pulse';
    }
  };

  return (
    <>
      <style jsx>{`
        .skeleton-base {
          background-color: ${theme.colors.gray[200]};
          position: relative;
          overflow: hidden;
        }

        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-wave {
          background: linear-gradient(
            90deg,
            ${theme.colors.gray[200]} 25%,
            ${theme.colors.gray[100]} 50%,
            ${theme.colors.gray[200]} 75%
          );
          background-size: 200% 100%;
          animation: wave 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes wave {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      <div
        className={`skeleton-base ${getAnimationClass()} ${className}`}
        style={{
          width,
          height,
          ...getVariantStyles(),
        }}
      />
    </>
  );
};

// Specific skeleton components for common use cases

export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`p-4 ${className}`}
    style={{
      backgroundColor: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.colors.shadow.sm,
    }}
  >
    <Skeleton variant="rectangular" height={200} className="mb-4" />
    <Skeleton variant="text" height={24} width="60%" className="mb-2" />
    <Skeleton variant="text" height={16} className="mb-2" />
    <Skeleton variant="text" height={16} width="80%" className="mb-4" />
    <div className="d-flex justify-content-between align-items-center">
      <Skeleton variant="text" height={20} width={100} />
      <Skeleton variant="rounded" height={36} width={100} />
    </div>
  </div>
);

export const ProductCardSkeleton: React.FC = () => (
  <div
    style={{
      backgroundColor: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      boxShadow: theme.colors.shadow.sm,
    }}
  >
    <Skeleton variant="rectangular" height={240} />
    <div className="p-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={120} height={16} />
      </div>
      <Skeleton variant="text" height={20} className="mb-2" />
      <Skeleton variant="text" height={16} width="90%" className="mb-3" />
      <div className="d-flex justify-content-between align-items-center">
        <Skeleton variant="text" width={80} height={24} />
        <div className="d-flex gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
    </div>
  </div>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="d-flex align-items-center gap-3 p-3">
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-grow-1">
      <Skeleton variant="text" height={20} width="40%" className="mb-1" />
      <Skeleton variant="text" height={16} width="60%" />
    </div>
    <Skeleton variant="rounded" width={80} height={32} />
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({
  columns = 5,
}) => (
  <tr>
    {Array.from(
      { length: columns },
      (_, index) => `table-col-${columns}-${Date.now()}-${Math.random()}`
    ).map(key => (
      <td key={key} className="p-3">
        <Skeleton variant="text" height={16} />
      </td>
    ))}
  </tr>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="text-center p-4">
    <Skeleton
      variant="circular"
      width={120}
      height={120}
      className="mx-auto mb-4"
    />
    <Skeleton variant="text" height={24} width={200} className="mx-auto mb-2" />
    <Skeleton variant="text" height={16} width={150} className="mx-auto mb-4" />
    <div className="d-flex justify-content-center gap-3">
      <Skeleton variant="rounded" width={100} height={36} />
      <Skeleton variant="rounded" width={100} height={36} />
    </div>
  </div>
);

export const HomeSkeleton: React.FC = () => (
  <div style={{ backgroundColor: theme.colors.background.primary }}>
    {/* Hero Section Skeleton */}
    <section style={{ padding: `${theme.spacing[20]} ${theme.spacing[4]}` }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <Skeleton variant="text" height={60} width="80%" className="mb-4" />
            <Skeleton variant="text" height={24} className="mb-2" />
            <Skeleton variant="text" height={24} width="90%" className="mb-4" />
            <div className="d-flex gap-3 mb-4">
              <Skeleton variant="rounded" width={200} height={48} />
              <Skeleton variant="rounded" width={200} height={48} />
            </div>
          </div>
          <div className="col-lg-6">
            <Skeleton variant="rounded" height={400} />
          </div>
        </div>
      </div>
    </section>

    {/* Services Section Skeleton */}
    <section style={{ padding: `${theme.spacing[16]} ${theme.spacing[4]}` }}>
      <div className="container">
        <Skeleton
          variant="text"
          height={48}
          width={300}
          className="mx-auto mb-4"
        />
        <Skeleton
          variant="text"
          height={20}
          width={500}
          className="mx-auto mb-5"
        />
        <div className="row g-4">
          {Array.from(
            { length: 6 },
            (_, index) => `home-card-${Date.now()}-${Math.random()}`
          ).map(key => (
            <div key={key} className="col-md-6 col-lg-4">
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="container-fluid p-4">
    <div className="row g-4">
      {/* Stats Cards */}
      {Array.from(
        { length: 4 },
        (_, index) => `dashboard-stat-${Date.now()}-${Math.random()}`
      ).map(key => (
        <div key={key} className="col-md-6 col-lg-3">
          <div
            className="p-4"
            style={{
              backgroundColor: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.xl,
            }}
          >
            <Skeleton variant="text" height={16} width="60%" className="mb-2" />
            <Skeleton variant="text" height={32} width="40%" />
          </div>
        </div>
      ))}
    </div>

    <div className="row g-4 mt-4">
      {/* Chart */}
      <div className="col-lg-8">
        <div
          className="p-4"
          style={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: theme.borderRadius.xl,
          }}
        >
          <Skeleton variant="text" height={24} width={200} className="mb-4" />
          <Skeleton variant="rectangular" height={300} />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="col-lg-4">
        <div
          className="p-4"
          style={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: theme.borderRadius.xl,
          }}
        >
          <Skeleton variant="text" height={24} width={150} className="mb-4" />
          {Array.from(
            { length: 5 },
            (_, index) => `dashboard-activity-${Date.now()}-${Math.random()}`
          ).map(key => (
            <ListItemSkeleton key={key} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
