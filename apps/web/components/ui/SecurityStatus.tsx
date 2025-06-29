import React from 'react';
import { colors } from './colors';

export interface SecurityStatusProps {
  isSecure: boolean;
  environment: string;
  className?: string;
  onSecurityClick?: () => void;
}

/**
 * SecurityStatus Component
 * Displays the security status of environment variables and secrets
 * Uses Mahardika brand colors: navy colors.navy and gold colors.gold
 */
export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  isSecure,
  environment,
  className = '',
  onSecurityClick,
}) => {
  const statusColor = isSecure ? colors.gold : '#FF6B6B';
  const backgroundColor = isSecure ? colors.navy : colors.gray[800];
  const borderColor = isSecure ? colors.gold : colors.gray[600];

  return (
    <div
      className={className}
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor,
        border: `2px solid ${borderColor}`,
        color: colors.text.primary,
        cursor: onSecurityClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      onClick={onSecurityClick}
      onMouseEnter={e => {
        if (onSecurityClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 4px 12px rgba(244, 180, 0, 0.2)`;
        }
      }}
      onMouseLeave={e => {
        if (onSecurityClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Header with icon and status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{isSecure ? '🔒' : '⚠️'}</span>
          <span
            style={{
              color: statusColor,
              fontWeight: '600',
              fontSize: '1.1rem',
            }}
          >
            {isSecure ? 'Secure' : 'Attention Required'}
          </span>
        </div>
        <div
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isSecure
              ? 'rgba(244, 180, 0, 0.1)'
              : 'rgba(255, 107, 107, 0.1)',
            border: `1px solid ${statusColor}`,
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: statusColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {environment}
        </div>
      </div>

      {/* Environment details */}
      <div style={{ marginBottom: '0.75rem' }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: '1.4',
          }}
        >
          Environment:{' '}
          <strong style={{ color: colors.text.primary }}>{environment}</strong>
        </p>
      </div>

      {/* Security status message */}
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: isSecure
            ? 'rgba(244, 180, 0, 0.05)'
            : 'rgba(255, 107, 107, 0.05)',
          borderLeft: `4px solid ${statusColor}`,
          borderRadius: '0.25rem',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: colors.text.secondary,
            lineHeight: '1.4',
          }}
        >
          {isSecure
            ? 'All secrets properly configured and protected. Environment variables are secure and .gitignore rules are in place.'
            : 'Security configuration requires attention. Please verify environment variables and secrets protection.'}
        </p>
      </div>

      {/* Security indicators */}
      <div
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: '.env protected', status: isSecure },
          { label: 'Secrets secured', status: isSecure },
          { label: 'API keys safe', status: isSecure },
        ].map(({ label, status }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: status
                ? 'rgba(244, 180, 0, 0.1)'
                : 'rgba(148, 163, 184, 0.1)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.75rem' }}>{status ? '✅' : '❌'}</span>
            <span
              style={{
                color: status ? colors.gold : colors.gray[400],
                fontWeight: '500',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Mahardika branding footer */}
      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: `1px solid ${colors.gray[700]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: colors.gray[400],
            fontWeight: '500',
          }}
        >
          Mahardika Security
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: colors.gray[500],
            fontFamily: 'monospace',
          }}
        >
          Navy colors.navy • Gold colors.gold
        </div>
      </div>
    </div>
  );
};

export default SecurityStatus;
