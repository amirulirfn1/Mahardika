/**
 * =============================================================================
 * Mahardika Platform - CSRF Hook
 * React hook for managing CSRF tokens in client-side components
 * =============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { getCSRFTokenForClient, CSRF_HEADER_NAME } from '../csrf';

interface CSRFRequestOptions {
  headers?: Record<string, string>;
  body?: string | FormData;
  method?: string;
  [key: string]: any;
}

interface UseCSRFReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  addCSRFToken: (options?: CSRFRequestOptions) => CSRFRequestOptions;
  refetchToken: () => void;
}

/**
 * Custom hook for CSRF token management
 * Automatically fetches CSRF token and provides utilities for API calls
 */
export function useCSRF(): UseCSRFReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      const csrfToken = getCSRFTokenForClient();
      
      if (!csrfToken) {
        setError('CSRF token not found. Please refresh the page.');
        setToken(null);
      } else {
        setToken(csrfToken);
      }
    } catch (err) {
      setError('Failed to retrieve CSRF token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const addCSRFToken = useCallback((options: CSRFRequestOptions = {}): CSRFRequestOptions => {
    if (!token) {
      console.warn('CSRF token not available. Request may be blocked.');
      return options;
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        [CSRF_HEADER_NAME]: token,
      },
    };
  }, [token]);

  const refetchToken = useCallback(() => {
    fetchToken();
  }, [fetchToken]);

  return {
    token,
    loading,
    error,
    addCSRFToken,
    refetchToken,
  };
} 