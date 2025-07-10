'use client';

import React, { useState, useEffect } from 'react';
import { colors } from '@mahardika/ui';

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
    title: 'Necessary Cookies',
    description: 'Essential for the website to function properly. These cannot be disabled.',
    examples: 'Authentication, security, basic site functionality',
  },
  functional: {
    title: 'Functional Cookies',
    description: 'Enhance your experience with personalized features.',
    examples: 'Language preferences, chat support, user interface customization',
  },
  analytics: {
    title: 'Analytics Cookies',
    description: 'Help us understand how you use our site to improve performance.',
    examples: 'Page views, user behavior, performance metrics (anonymized)',
  },
  marketing: {
    title: 'Marketing Cookies',
    description: 'Enable personalized advertising and marketing communications.',
    examples: 'Targeted ads, email campaigns, social media integration',
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
  const [showDetails, setShowDetails] = useState(showDetailedOptions);
  const [isLoading, setIsLoading] = useState(false);
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
    }
  }, [loading, isConsentRequired]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      if (event.key === 'Escape') {
        // Allow escape if user has already provided necessary consent
        if (hasConsent('necessary')) {
          setIsVisible(false);
        }
      }
    };

    if (focusTrapEnabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, focusTrapEnabled, hasConsent]);

  // Hide banner if not visible
  if (!isVisible) {
    return null;
  }

  const handleAcceptAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        grantConsent('necessary'), // 1 year
        grantConsent('functional'),
        grantConsent('analytics'), // 6 months
        grantConsent('marketing'), // 3 months
      ]);
      
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length === 0) {
        setIsVisible(false);
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
      setIsVisible(false);
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
        // No withdrawConsent function in useSimpleConsent, so we just remove it from state
        const newState = { ...consentState };
        delete newState[type];
        setConsentState(newState);
        localStorage.setItem('user-consent', JSON.stringify(newState));
      }
    } catch (error) {
      console.error(`Error ${granted ? 'granting' : 'withdrawing'} ${type} consent:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExpirationInfo = (type: ConsentType) => {
    // No getConsentExpiration function in useSimpleConsent
    return null;
  };

  const isThemeDark = theme === 'dark';
  const backgroundColor = isThemeDark ? colors.navy : colors.white;
  const textColor = isThemeDark ? colors.white : colors.navy;
  const borderColor = isThemeDark ? colors.gold : colors.navy;

  const bannerStyles: React.CSSProperties = {
    position: 'fixed',
    [position]: 0,
    left: 0,
    right: 0,
    backgroundColor,
    border: position === 'top' ? `2px solid ${borderColor}` : undefined,
    borderTop: position === 'bottom' ? `2px solid ${borderColor}` : undefined,
    boxShadow: position === 'bottom' 
      ? '0 -4px 16px rgba(13, 27, 42, 0.1)' 
      : '0 4px 16px rgba(13, 27, 42, 0.1)',
    padding: '1.5rem',
    zIndex: 1000,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '2px solid',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    opacity: isLoading ? 0.6 : 1,
    marginLeft: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    color: colors.white,
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: colors.gold,
    borderColor: colors.gold,
    color: colors.navy,
  };

  const outlineButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    borderColor: textColor,
    color: textColor,
  };

  const toggleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    padding: '1rem',
    backgroundColor: isThemeDark ? 'rgba(255, 255, 255, 0.05)' : colors.gray[50],
    borderRadius: '0.5rem',
    border: `1px solid ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : colors.gray[200]}`,
  };

  const switchStyles: React.CSSProperties = {
    position: 'relative',
    width: '44px',
    height: '24px',
    backgroundColor: colors.gray[300],
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginLeft: 'auto',
    outline: 'none',
    border: 'none',
  };

  const switchActiveStyles: React.CSSProperties = {
    ...switchStyles,
    backgroundColor: colors.navy,
  };

  const switchThumbStyles: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: colors.white,
    borderRadius: '50%',
    transition: 'transform 0.2s',
    transform: 'translateX(0)',
  };

  const switchThumbActiveStyles: React.CSSProperties = {
    ...switchThumbStyles,
    transform: 'translateX(20px)',
  };

  return (
    <div style={bannerStyles} role="dialog" aria-labelledby="consent-banner-title" aria-describedby="consent-banner-description">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Banner Content */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h2 id="consent-banner-title" style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: textColor
              }}>
                🍪 Cookie & Privacy Preferences
              </h2>
              <p id="consent-banner-description" style={{ 
                margin: '0 0 0.75rem 0', 
                fontSize: '0.875rem', 
                lineHeight: '1.5',
                color: isThemeDark ? colors.gray[300] : colors.gray[700]
              }}>
                We use cookies and similar technologies to enhance your experience, analyze site usage, 
                and assist with marketing efforts. You can manage your preferences below or accept all to continue.
              </p>
              <div style={{ fontSize: '0.75rem', color: isThemeDark ? colors.gray[400] : colors.gray[600] }}>
                By continuing, you agree to our{' '}
                <a 
                  href="/privacy" 
                  style={{ 
                    color: colors.gold, 
                    textDecoration: 'none',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.textDecoration = 'underline'}
                  onBlur={(e) => e.target.style.textDecoration = 'none'}
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a 
                  href="/cookies" 
                  style={{ 
                    color: colors.gold, 
                    textDecoration: 'none',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.textDecoration = 'underline'}
                  onBlur={(e) => e.target.style.textDecoration = 'none'}
                >
                  Cookie Policy
                </a>
              </div>
              
              {/* Rate Limit Status */}
              {/* No rateLimitStatus in useSimpleConsent */}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
              <button
                onClick={handleAcceptAll}
                disabled={isLoading}
                style={primaryButtonStyles}
                aria-label="Accept all cookies and close banner"
              >
                {isLoading ? 'Processing...' : 'Accept All'}
              </button>
              <button
                onClick={handleAcceptNecessary}
                disabled={isLoading}
                style={secondaryButtonStyles}
                aria-label="Accept only necessary cookies and close banner"
              >
                Necessary Only
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={outlineButtonStyles}
                aria-label={showDetails ? 'Hide detailed cookie options' : 'Show detailed cookie options'}
                aria-expanded={showDetails}
              >
                {showDetails ? 'Hide Details' : 'Customize'}
              </button>
            </div>
          </div>

          {/* Detailed Options */}
          {showDetails && (
            <div style={{ 
              borderTop: `1px solid ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : colors.gray[200]}`, 
              paddingTop: '1rem',
              marginTop: '0.5rem',
            }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: textColor
              }}>
                Cookie Preferences
              </h3>
              
              {(Object.keys(CONSENT_DESCRIPTIONS) as ConsentType[]).map((type) => {
                const consent = CONSENT_DESCRIPTIONS[type];
                const isGranted = consentState[type];
                const isNecessary = type === 'necessary';
                const expirationInfo = getExpirationInfo(type);
                
                return (
                  <div key={type} style={toggleContainerStyles}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '0.25rem',
                      }}>
                        <h4 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          margin: 0,
                          color: textColor
                        }}>
                          {consent.title}
                          {isNecessary && (
                            <span style={{ 
                              marginLeft: '0.5rem',
                              fontSize: '0.75rem',
                              color: colors.gold,
                              fontWeight: 'normal'
                            }}>
                              (Required)
                            </span>
                          )}
                        </h4>
                        {expirationInfo && isGranted && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            color: isThemeDark ? colors.gray[400] : colors.gray[600],
                            fontStyle: 'italic',
                          }}>
                            {expirationInfo}
                          </span>
                        )}
                      </div>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: isThemeDark ? colors.gray[300] : colors.gray[600],
                        margin: '0 0 0.25rem 0',
                        lineHeight: '1.3',
                      }}>
                        {consent.description}
                      </p>
                      <p style={{ 
                        fontSize: '0.625rem', 
                        color: isThemeDark ? colors.gray[400] : colors.gray[500],
                        margin: 0,
                        fontStyle: 'italic',
                      }}>
                        Examples: {consent.examples}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => !isNecessary && handleConsentToggle(type, !isGranted)}
                      disabled={isNecessary || isLoading}
                      style={isGranted ? switchActiveStyles : switchStyles}
                      aria-label={`${isGranted ? 'Disable' : 'Enable'} ${consent.title}`}
                      aria-checked={isGranted}
                      role="switch"
                    >
                      <div style={isGranted ? switchThumbActiveStyles : switchThumbStyles} />
                    </button>
                  </div>
                );
              })}
              
              <div style={{ 
                marginTop: '1rem', 
                textAlign: 'center',
                fontSize: '0.75rem',
                color: isThemeDark ? colors.gray[400] : colors.gray[600]
              }}>
                You can change these preferences at any time in your account settings or by clicking the cookie icon at the bottom of any page.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 