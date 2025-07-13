/**
 * =============================================================================
 * Mahardika Platform - CSRF Test Component
 * Development component for testing CSRF protection implementation
 * =============================================================================
 *
 * ⚠️  DEVELOPMENT ONLY - Remove before production deployment
 */

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

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export default function CSRFTestComponent() {
  const { addToFetchOptions, isLoading } = useSimpleCSRF();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test 1: Valid CSRF Request
  const testValidCSRFRequest = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        ...addToFetchOptions({
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        body: JSON.stringify({
          make: 'Test',
          model: 'CSRF Test Vehicle',
          year: 2024,
          plateNumber: 'CSRF-TEST-001',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addTestResult({
          test: 'Valid CSRF Request',
          status: 'success',
          message: 'CSRF protection working - valid request accepted',
          details: data,
        });
      } else {
        addTestResult({
          test: 'Valid CSRF Request',
          status: 'error',
          message: `Request failed: ${data.message}`,
          details: data,
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Valid CSRF Request',
        status: 'error',
        message: `Network error: ${error}`,
        details: error,
      });
    }
  };

  // Test 2: Missing CSRF Token
  const testMissingCSRFToken = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: 'Test',
          model: 'No CSRF Token Vehicle',
          year: 2024,
          plateNumber: 'NO-CSRF-001',
        }),
      });

      const data = await response.json();

      if (response.status === 403 && data.code === 'CSRF_TOKEN_MISSING') {
        addTestResult({
          test: 'Missing CSRF Token',
          status: 'success',
          message: 'CSRF protection working - missing token rejected',
          details: data,
        });
      } else {
        addTestResult({
          test: 'Missing CSRF Token',
          status: 'error',
          message: `Expected 403 CSRF_TOKEN_MISSING, got: ${response.status}`,
          details: data,
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Missing CSRF Token',
        status: 'error',
        message: `Network error: ${error}`,
        details: error,
      });
    }
  };

  // Test 3: Invalid CSRF Token
  const testInvalidCSRFToken = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'invalid-token-12345',
        },
        body: JSON.stringify({
          make: 'Test',
          model: 'Invalid CSRF Token Vehicle',
          year: 2024,
          plateNumber: 'INVALID-CSRF-001',
        }),
      });

      const data = await response.json();

      if (response.status === 403) {
        const isExpectedError =
          data.code === 'CSRF_TOKEN_INVALID' ||
          data.code === 'CSRF_TOKEN_MISMATCH';

        if (isExpectedError) {
          addTestResult({
            test: 'Invalid CSRF Token',
            status: 'success',
            message: 'CSRF protection working - invalid token rejected',
            details: data,
          });
        } else {
          addTestResult({
            test: 'Invalid CSRF Token',
            status: 'error',
            message: `Expected CSRF error, got: ${data.code}`,
            details: data,
          });
        }
      } else {
        addTestResult({
          test: 'Invalid CSRF Token',
          status: 'error',
          message: `Expected 403 error, got: ${response.status}`,
          details: data,
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Invalid CSRF Token',
        status: 'error',
        message: `Network error: ${error}`,
        details: error,
      });
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    clearResults();

    addTestResult({
      test: 'Test Suite Started',
      status: 'pending',
      message: 'Running CSRF protection tests...',
    });

    await testValidCSRFRequest();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between tests

    await testMissingCSRFToken();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testInvalidCSRFToken();

    addTestResult({
      test: 'Test Suite Completed',
      status: 'success',
      message: 'All CSRF tests completed',
    });

    setIsRunningTests(false);
  };

  const getStatusBadgeClass = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔒 CSRF Protection Test Suite
        </h2>
        <p className="text-gray-600">
          Development tool for testing CSRF protection implementation.
          <span className="block text-red-600 font-semibold">
            ⚠️ Remove this component before production deployment
          </span>
        </p>
      </div>

      {/* CSRF Token Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">CSRF Token Status</h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Token:</span>{' '}
            {isLoading && <span className="text-yellow-600">Loading...</span>}
            {/* The original code had 'error' here, but 'error' is not defined in the new useSimpleCSRF hook.
                 Assuming 'error' should be removed or replaced with a placeholder if needed.
                 For now, removing it as it's not part of the new useSimpleCSRF hook's return. */}
            {!isLoading && (
              <span className="text-green-600 font-mono text-sm break-all">
                Token not available (requires cookie)
              </span>
            )}
          </div>
          <div>
            <span className="font-medium">Status:</span>{' '}
            {isLoading && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                Loading
              </span>
            )}
            {/* The original code had 'error' here, but 'error' is not defined in the new useSimpleCSRF hook.
                 Assuming 'error' should be removed or replaced with a placeholder if needed.
                 For now, removing it as it's not part of the new useSimpleCSRF hook's return. */}
            {!isLoading && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Ready
              </span>
            )}
          </div>
        </div>
        {/* The original code had 'refetchToken' here, but 'refetchToken' is not defined in the new useSimpleCSRF hook.
            Assuming 'refetchToken' should be removed or replaced with a placeholder if needed.
            For now, removing it as it's not part of the new useSimpleCSRF hook's return. */}
      </div>

      {/* Test Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Test Controls</h3>
        <div className="flex gap-3">
          <button
            onClick={runAllTests}
            disabled={isRunningTests || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Test Results</h3>
          <div className="space-y-3">
            {testResults.map(result => (
              <div
                key={result.test}
                className="p-3 bg-white rounded border-l-4 border-l-gray-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{result.test}</h4>
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusBadgeClass(result.status)}`}
                  >
                    {result.status}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 text-sm">
                      Show Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Instructions
        </h3>
        <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
          <li>Ensure CSRF_SECRET_KEY is set in your environment variables</li>
          <li>The first test should succeed (valid CSRF token)</li>
          <li>The second test should fail with CSRF_TOKEN_MISSING error</li>
          <li>
            The third test should fail with CSRF_TOKEN_INVALID or
            CSRF_TOKEN_MISMATCH error
          </li>
          <li>All tests use the /api/vehicles endpoint for demonstration</li>
          <li>Remove this component before deploying to production</li>
        </ul>
      </div>
    </div>
  );
}
