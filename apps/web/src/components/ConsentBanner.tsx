'use client';

import React, { useState, useEffect } from 'react';
import { colors, BrandButton } from '@mahardika/ui';

// Simple consent types without complex hook
type ConsentType = 'necessary' | 'functional' | 'analytics' | 'marketing';

interface ConsentBannerProps {
  version?: string;
  showDetailedOptions?: boolean;
  position?: 'bottom' | 'top';
  theme?: 'light' | 'dark';
}

const CONSENT_DESCRIPTIONS = {
  necessary: {
    title: 'Essential Cookies',
    description: 'Required for core website functionality and security.',
    examples: 'Authentication, security tokens, basic site features',
    icon: '🔒',
  },
  functional: {
    title: 'Functional Cookies',
    description: 'Enhance your experience with personalized features.',
    examples: 'Language preferences, chat support, user settings',
    icon: '⚙️',
  },
  analytics: {
    title: 'Analytics Cookies',
    description: 'Help us understand usage patterns to improve our service.',
    examples: 'Page views, user behavior, performance metrics',
    icon: '📊',
  },
  marketing: {
    title: 'Marketing Cookies',
    description: 'Enable personalized advertising and communications.',
    examples: 'Targeted ads, email campaigns, social media integration',
    icon: '🎯',
  },
};

// Simple consent management without the complex hook
function useSimpleConsent() {
  const [consentState, setConsentState] = useState<Record<ConsentType, boolean>>({
    necessary: false,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing consent from localStorage
    try {
      const stored = localStorage.getItem('user-consent');
      if (stored) {
        setConsentState(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Error loading consent state:', error);
    }
    setLoading(false);
  }, []);

  const grantConsent = async (type: ConsentType) => {
    const newState = { ...consentState, [type]: true };
    setConsentState(newState);
    localStorage.setItem('user-consent', JSON.stringify(newState));
  };

  const isConsentRequired = () => {
    return !consentState.necessary;
  };

  const hasConsent = (type: ConsentType) => {
    return consentState[type];
  };

  return {
    consentState,
    loading,
    grantConsent,
    isConsentRequired,
    hasConsent,
  };
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  version = '1.0',
  showDetailedOptions = false,
  position = 'bottom',
  theme = 'light',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [focusTrapEnabled, setFocusTrapEnabled] = useState(false);
  
  const {
    consentState,
    loading,
    grantConsent,
    isConsentRequired,
    hasConsent,
  } = useSimpleConsent();

  // Show banner if consent is required and not loading
  useEffect(() => {
    if (!loading) {
      const shouldShow = isConsentRequired();
      setIsVisible(shouldShow);
      setFocusTrapEnabled(shouldShow);
      if (shouldShow) {
        // Add entrance animation
        setTimeout(() => setIsAnimating(true), 100);
      }
    }
  }, [loading, isConsentRequired]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isVisible) {
        if (event.key === 'Escape') {
          // Allow escape if user has already provided necessary consent
          if (hasConsent('necessary')) {
            setIsVisible(false);
          }
        }
      }
    };

    if (focusTrapEnabled) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, focusTrapEnabled, hasConsent]);

  // Hide banner if not visible
  if (!isVisible) {
    return null;
  }

  const handleAcceptAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        grantConsent('necessary'),
        grantConsent('functional'),
        grantConsent('analytics'),
        grantConsent('marketing'),
      ]);
      
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length === 0) {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
      } else {
        console.error('Some consents failed:', failures);
      }
    } catch (error) {
      console.error('Error accepting all consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptNecessary = async () => {
    setIsLoading(true);
    try {
      await grantConsent('necessary');
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    } catch (error) {
      console.error('Error accepting necessary consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentToggle = async (type: ConsentType, granted: boolean) => {
    if (type === 'necessary' && !granted) {
      // Prevent disabling necessary cookies
      return;
    }

    setIsLoading(true);
    try {
      if (granted) {
        await grantConsent(type);
      } else {
        // Simple withdrawal by updating state
        const newState = { ...consentState, [type]: false };
        setConsentState(newState);
        localStorage.setItem('user-consent', JSON.stringify(newState));
      }
    } catch (error) {
      console.error(`Error ${granted ? 'granting' : 'withdrawing'} ${type} consent:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const isThemeDark = theme === 'dark';
  const backgroundColor = isThemeDark ? colors.navy : colors.white;
  const textColor = isThemeDark ? colors.white : colors.navy;
  const borderColor = isThemeDark ? colors.gold : colors.navy;

  return (
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .consent-banner {
          position: fixed;
          ${position}: 0;
          left: 0;
          right: 0;
          background: ${backgroundColor};
          backdrop-filter: blur(20px);
          border-${position === 'bottom' ? 'top' : 'bottom'}: 2px solid ${borderColor};
          box-shadow: ${position === 'bottom' 
            ? '0 -8px 32px rgba(13, 27, 42, 0.15), 0 -2px 8px rgba(13, 27, 42, 0.1)' 
            : '0 8px 32px rgba(13, 27, 42, 0.15), 0 2px 8px rgba(13, 27, 42, 0.1)'};
          z-index: 1000;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          max-height: 90vh;
          overflow-y: auto;
          animation: ${(() => {
            if (!isAnimating) return 'none';
            return position === 'bottom' ? 'slideInUp' : 'slideInDown';
          })()} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .consent-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .consent-header {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .consent-text {
          flex: 1;
          min-width: 0;
        }
        
        .consent-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${textColor};
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .consent-description {
          font-size: 1rem;
          line-height: 1.6;
          color: ${isThemeDark ? colors.gray[300] : colors.gray[600]};
          margin: 0 0 1rem 0;
        }
        
        .consent-links {
          font-size: 0.875rem;
          color: ${isThemeDark ? colors.gray[400] : colors.gray[500]};
          line-height: 1.5;
        }
        
        .consent-link {
          color: ${colors.gold};
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          border-bottom: 1px solid transparent;
        }
        
        .consent-link:hover {
          color: ${colors.gold};
          border-bottom-color: ${colors.gold};
          transform: translateY(-1px);
        }
        
        .consent-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 220px;
        }
        
        .consent-button {
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          border: 2px solid;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          position: relative;
          overflow: hidden;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        
        .consent-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .consent-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 27, 42, 0.2);
        }
        
        .consent-button:not(:disabled):active {
          transform: translateY(0);
        }
        
        .consent-button.primary {
          background: linear-gradient(135deg, ${colors.navy} 0%, ${colors.navy}E6 100%);
          border-color: ${colors.navy};
          color: ${colors.white};
        }
        
        .consent-button.secondary {
          background: linear-gradient(135deg, ${colors.gold} 0%, ${colors.gold}E6 100%);
          border-color: ${colors.gold};
          color: ${colors.navy};
        }
        
        .consent-button.outline {
          background: transparent;
          border-color: ${textColor};
          color: ${textColor};
        }
        
        .consent-button.outline:hover {
          background: ${colors.gold}10;
          border-color: ${colors.gold};
          color: ${colors.gold};
        }
        
        .consent-details {
          border-top: 1px solid ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : colors.gray[200]};
          padding-top: 1.5rem;
          margin-top: 1.5rem;
          animation: fadeIn 0.3s ease-out;
        }
        
        .consent-details h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          color: ${textColor};
        }
        
        .consent-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          margin-bottom: 1rem;
          background: ${isThemeDark ? 'rgba(255, 255, 255, 0.03)' : colors.gray[50]};
          border: 1px solid ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : colors.gray[200]};
          border-radius: 0.75rem;
          transition: all 0.2s ease;
        }
        
        .consent-option:hover {
          border-color: ${colors.gold};
          background: ${isThemeDark ? 'rgba(244, 180, 0, 0.05)' : 'rgba(244, 180, 0, 0.05)'};
        }
        
        .consent-option-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .consent-option-content {
          flex: 1;
          min-width: 0;
        }
        
        .consent-option-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: ${textColor};
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .consent-option-description {
          font-size: 0.75rem;
          line-height: 1.4;
          color: ${isThemeDark ? colors.gray[300] : colors.gray[600]};
          margin: 0 0 0.25rem 0;
        }
        
        .consent-option-examples {
          font-size: 0.625rem;
          color: ${isThemeDark ? colors.gray[400] : colors.gray[500]};
          font-style: italic;
          margin: 0;
        }
        
        .consent-toggle {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid ${colors.gold};
          background: ${hasConsent('necessary') ? colors.gold : 'transparent'};
          color: ${hasConsent('necessary') ? colors.navy : colors.gold};
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .consent-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(244, 180, 0, 0.3);
        }
        
        .consent-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .consent-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: ${isThemeDark ? colors.gray[400] : colors.gray[500]};
          line-height: 1.5;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: currentColor;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .consent-content {
            padding: 1.5rem;
          }
          
          .consent-header {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .consent-actions {
            width: 100%;
          }
          
          .consent-button {
            width: 100%;
          }
          
          .consent-option {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .consent-toggle {
            align-self: flex-end;
          }
        }
      `}</style>
      
      <div className="consent-banner" role="dialog" aria-labelledby="consent-banner-title" aria-describedby="consent-banner-description">
        <div className="consent-content">
          <div className="consent-header">
            <div className="consent-text">
              <h2 id="consent-banner-title" className="consent-title">
                🍪 Cookie Preferences
              </h2>
              <p id="consent-banner-description" className="consent-description">
                We use cookies to enhance your experience, analyze site usage, and deliver personalized content. 
                Choose your preferences below or accept all to continue with optimal experience.
              </p>
              <div className="consent-links">
                By continuing, you agree to our{' '}
                <a href="/privacy" className="consent-link">Privacy Policy</a>{' '}
                and{' '}
                <a href="/terms" className="consent-link">Terms of Service</a>
              </div>
            </div>
            
            <div className="consent-actions">
              <button
                className="consent-button primary"
                onClick={handleAcceptAll}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading-spinner" /> : null}
                Accept All Cookies
              </button>

              <button
                className="consent-button secondary"
                onClick={handleAcceptNecessary}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading-spinner" /> : null}
                Essential Only
              </button>

              <button
                className="consent-button outline"
                onClick={toggleDetails}
                disabled={isLoading}
              >
                {showDetails ? 'Hide' : 'Customize'} Preferences
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="consent-details">
              <h3>Cookie Preferences</h3>
              
              {(Object.keys(CONSENT_DESCRIPTIONS) as ConsentType[]).map((type) => {
                const consent = CONSENT_DESCRIPTIONS[type];
                const isGranted = hasConsent(type);
                const isNecessary = type === 'necessary';
                
                return (
                  <div key={type} className="consent-option">
                    <div className="consent-option-icon">
                      {consent.icon}
                    </div>
                    <div className="consent-option-content">
                      <div className="consent-option-title">
                        {consent.title}
                        {isNecessary && (
                          <span style={{ 
                            fontSize: '0.625rem',
                            color: colors.gold,
                            fontWeight: 'normal',
                            background: `${colors.gold}20`,
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.25rem',
                          }}>
                            Required
                          </span>
                        )}
                      </div>
                      <p className="consent-option-description">
                        {consent.description}
                      </p>
                      <p className="consent-option-examples">
                        Examples: {consent.examples}
                      </p>
                    </div>
                    
                    <button
                      className="consent-toggle"
                      onClick={() => handleConsentToggle(type, !isGranted)}
                      disabled={isNecessary || isLoading}
                      style={{
                        background: isGranted ? colors.gold : 'transparent',
                        color: isGranted ? colors.navy : colors.gold,
                      }}
                    >
                      {isGranted ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
              
              <div className="consent-footer">
                💡 You can change these preferences anytime in your account settings or by clearing your browser cookies.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 