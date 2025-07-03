/**
 * =============================================================================
 * Mahardika Platform - CSRF React Hook
 * Client-side hook for CSRF token management
 * =============================================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { getCSRFTokenForClient, addCSRFToken } from '../csrf';

interface CSRFHook {
  token: string | null;
  isLoading: boolean;
  addToFetchOptions: (options?: RequestInit) => RequestInit;
  refreshToken: () => void;
}

/**
 * React hook for CSRF token management
 */
export function useCSRF(): CSRFHook {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = useCallback(() => {
    const newToken = getCSRFTokenForClient();
    setToken(newToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshToken();
    
    // Listen for token changes (e.g., after page navigation)
    const handleFocus = () => refreshToken();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshToken]);

  const addToFetchOptions = useCallback((options: RequestInit = {}): RequestInit => {
    return addCSRFToken(options);
  }, []);

  return {
    token,
    isLoading,
    addToFetchOptions,
    refreshToken,
  };
} 