/**
 * =============================================================================
 * Mahardika Platform - Consent Management Hook (Enhanced)
 * GDPR/CCPA compliance hook for managing user consent with security improvements
 * =============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabaseClient } from '../supabaseClient';
import { useCSRF } from './useCSRF';

// Consent types available in the system
export type ConsentType = 'marketing' | 'analytics' | 'functional' | 'necessary';

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  granted_at: string | null;
  withdrawn_at: string | null;
  version: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
}

export interface ConsentState {
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  necessary: boolean;
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

interface UseConsentReturn {
  consents: UserConsent[];
  consentState: ConsentState;
  loading: boolean;
  error: string | null;
  grantConsent: (type: ConsentType, version?: string, metadata?: Record<string, any>, expiresInDays?: number) => Promise<boolean>;
  withdrawConsent: (type: ConsentType, version?: string) => Promise<boolean>;
  hasConsent: (type: ConsentType, version?: string) => boolean;
  refreshConsents: () => Promise<void>;
  isConsentRequired: () => boolean;
  isConsentExpired: (type: ConsentType, version?: string) => boolean;
  getConsentExpiration: (type: ConsentType, version?: string) => Date | null;
  rateLimitStatus: { remaining: number; resetTime: number };
}

/**
 * Rate limiting tracker
 */
class RateLimiter {
  private requests: number[] = [];

  checkLimit(): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => time > windowStart);
    
    return this.requests.length < RATE_LIMIT_CONFIG.maxRequests;
  }

  addRequest(): void {
    this.requests.push(Date.now());
  }

  getStatus(): { remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
    const currentRequests = this.requests.filter(time => time > windowStart);
    
    return {
      remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - currentRequests.length),
      resetTime: currentRequests.length > 0 ? Math.max(...currentRequests) + RATE_LIMIT_CONFIG.windowMs : now,
    };
  }
}

/**
 * Custom hook for managing user consent with enhanced security and features
 * Handles GDPR/CCPA compliance for user data processing consent
 */
export function useConsent(version: string = '1.0'): UseConsentReturn {
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rateLimiterRef = useRef(new RateLimiter());
  const { addCSRFToken } = useCSRF();

  // Derived state for easy access to current consent status
  const consentState: ConsentState = {
    marketing: hasActiveConsent('marketing'),
    analytics: hasActiveConsent('analytics'),
    functional: hasActiveConsent('functional'),
    necessary: hasActiveConsent('necessary'),
  };

  /**
   * Check if user has active consent for a specific type
   */
  function hasActiveConsent(type: ConsentType, checkVersion?: string): boolean {
    return consents.some(consent => 
      consent.consent_type === type &&
      consent.granted === true &&
      consent.withdrawn_at === null &&
      consent.version === (checkVersion || version) &&
      !isConsentExpiredInternal(consent)
    );
  }

  /**
   * Check if a specific consent is expired
   */
  function isConsentExpiredInternal(consent: UserConsent): boolean {
    if (!consent.expires_at) return false;
    return new Date(consent.expires_at) < new Date();
  }

  /**
   * Check if consent for a specific type is expired
   */
  const isConsentExpired = useCallback((type: ConsentType, checkVersion?: string): boolean => {
    const consent = consents.find(c => 
      c.consent_type === type &&
      c.granted === true &&
      c.withdrawn_at === null &&
      c.version === (checkVersion || version)
    );
    
    return consent ? isConsentExpiredInternal(consent) : false;
  }, [consents, version]);

  /**
   * Get consent expiration date
   */
  const getConsentExpiration = useCallback((type: ConsentType, checkVersion?: string): Date | null => {
    const consent = consents.find(c => 
      c.consent_type === type &&
      c.granted === true &&
      c.withdrawn_at === null &&
      c.version === (checkVersion || version)
    );
    
    return consent?.expires_at ? new Date(consent.expires_at) : null;
  }, [consents, version]);

  /**
   * Fetch user's current consents from database
   */
  const fetchConsents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabaseClient.auth.getUser();
      
      if (!userData.user) {
        setConsents([]);
        return;
      }

      const { data, error: fetchError } = await supabaseClient
        .from('user_consents')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setConsents(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch consents';
      setError(errorMessage);
      console.error('Error fetching consents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Grant consent for a specific type with enhanced security
   */
  const grantConsent = useCallback(async (
    type: ConsentType,
    consentVersion: string = version,
    metadata: Record<string, any> = {},
    expiresInDays?: number
  ): Promise<boolean> => {
    try {
      setError(null);

      // Check rate limit
      if (!rateLimiterRef.current.checkLimit()) {
        const status = rateLimiterRef.current.getStatus();
        const resetTime = new Date(status.resetTime);
        throw new Error(`Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`);
      }

      const { data: userData } = await supabaseClient.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Calculate expiration date if specified
      const expiresAt = expiresInDays 
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Add enhanced metadata with security context
      const enrichedMetadata = {
        ...metadata,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        expires_in_days: expiresInDays || null,
        version: consentVersion,
      };

      // Use CSRF protection for API call
      const requestOptions = addCSRFToken({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consent_type: type,
          version: consentVersion,
          metadata: enrichedMetadata,
          expires_at: expiresAt,
        }),
      });

      const response = await fetch('/api/consent/grant', requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to grant consent');
      }

      // Add request to rate limiter
      rateLimiterRef.current.addRequest();

      // Refresh consents after granting
      await fetchConsents();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to grant consent';
      setError(errorMessage);
      console.error('Error granting consent:', err);
      return false;
    }
  }, [version, fetchConsents, addCSRFToken]);

  /**
   * Withdraw consent for a specific type with enhanced security
   */
  const withdrawConsent = useCallback(async (
    type: ConsentType,
    consentVersion: string = version
  ): Promise<boolean> => {
    try {
      setError(null);

      // Check rate limit
      if (!rateLimiterRef.current.checkLimit()) {
        const status = rateLimiterRef.current.getStatus();
        const resetTime = new Date(status.resetTime);
        throw new Error(`Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`);
      }

      const { data: userData } = await supabaseClient.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Use CSRF protection for API call
      const requestOptions = addCSRFToken({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consent_type: type,
          version: consentVersion,
        }),
      });

      const response = await fetch('/api/consent/withdraw', requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw consent');
      }

      // Add request to rate limiter
      rateLimiterRef.current.addRequest();

      // Refresh consents after withdrawing
      await fetchConsents();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw consent';
      setError(errorMessage);
      console.error('Error withdrawing consent:', err);
      return false;
    }
  }, [version, fetchConsents, addCSRFToken]);

  /**
   * Check if user has consent for a specific type
   */
  const hasConsent = useCallback((
    type: ConsentType,
    checkVersion: string = version
  ): boolean => {
    return hasActiveConsent(type, checkVersion);
  }, [consents, version]);

  /**
   * Check if consent is required (no necessary consent granted)
   */
  const isConsentRequired = useCallback((): boolean => {
    return !hasActiveConsent('necessary');
  }, [consents, version]);

  /**
   * Refresh consents manually
   */
  const refreshConsents = useCallback(async (): Promise<void> => {
    await fetchConsents();
  }, [fetchConsents]);

  // Initial fetch
  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  // Auto-refresh expired consents
  useEffect(() => {
    const interval = setInterval(() => {
      const hasExpiredConsents = consents.some(consent => 
        consent.granted && !consent.withdrawn_at && isConsentExpiredInternal(consent)
      );
      
      if (hasExpiredConsents) {
        fetchConsents();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [consents, fetchConsents]);

  return {
    consents,
    consentState,
    loading,
    error,
    grantConsent,
    withdrawConsent,
    hasConsent,
    refreshConsents,
    isConsentRequired,
    isConsentExpired,
    getConsentExpiration,
    rateLimitStatus: rateLimiterRef.current.getStatus(),
  };
} 