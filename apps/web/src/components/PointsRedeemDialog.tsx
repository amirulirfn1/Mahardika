'use client';

import React, { useState } from 'react';

// Simple CSRF hook replacement
function useSimpleCSRF() {
  const [isLoading, setIsLoading] = useState(false);

  const addToFetchOptions = (options: any = {}) => {
    // Get CSRF token from cookie if available
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf-token='))
      ?.split('=')[1];

    return {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { 'X-CSRF-Token': token }),
      },
    };
  };

  return { addToFetchOptions, isLoading };
}

interface DialogProps {
  customerId: string;
  show: boolean;
  onClose: () => void;
  onRedeemed?: (newBalance: number) => void;
}

const PointsRedeemDialog: React.FC<DialogProps> = ({
  customerId,
  show,
  onClose,
  onRedeemed,
}) => {
  const [rmValue, setRmValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToFetchOptions, isLoading: csrfLoading } = useSimpleCSRF();

  const handleRedeem = async () => {
    if (rmValue <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        '/api/points/redeem',
        addToFetchOptions({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id: customerId, value_rm: rmValue }),
        })
      );
      const data = await res.json();
      if (!res.ok) {
        // Handle CSRF-specific errors with user-friendly messages
        if (
          data.code === 'CSRF_TOKEN_MISSING' ||
          data.code === 'CSRF_TOKEN_INVALID' ||
          data.code === 'CSRF_TOKEN_MISMATCH'
        ) {
          throw new Error(
            'Security verification failed. Please refresh the page and try again.'
          );
        }
        throw new Error(data.error || 'Redeem failed');
      }
      onRedeemed?.(data.newBalance);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || rmValue <= 0 || csrfLoading;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Redeem Points</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {csrfLoading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-700">
                Initializing security verification...
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="rmValue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Redeem Value (RM)
              </label>
              <input
                type="number"
                id="rmValue"
                min={1}
                value={rmValue}
                onChange={e => setRmValue(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">10 pts = RM 1</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeem}
            disabled={isButtonDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Redeem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsRedeemDialog;
