/**
 * =============================================================================
 * Mahardika Platform - CSRF Test Component
 * Component for testing CSRF protection implementation
 * This component is for development/testing purposes only
 * =============================================================================
 */

'use client';

import React, { useState } from 'react';
import { BrandButton } from '@mahardika/ui';
import { useCSRF } from '@/lib/hooks/useCSRF';

export default function CSRFTestComponent() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToFetchOptions, token, isLoading: csrfLoading } = useCSRF();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCSRFProtection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Valid request with CSRF token
      addResult('🧪 Testing valid request with CSRF token...');
      const validResponse = await fetch('/api/points/redeem', addToFetchOptions({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: 'test-id', value_rm: 1 }),
      }));
      
      if (validResponse.status === 403) {
        const data = await validResponse.json();
        if (data.code?.startsWith('CSRF_TOKEN')) {
          addResult('❌ Valid request was blocked by CSRF protection');
        } else {
          addResult('✅ CSRF protection is working - valid request processed');
        }
      } else {
        addResult(`✅ Valid request succeeded (status: ${validResponse.status})`);
      }

      // Test 2: Request without CSRF token
      addResult('🧪 Testing request without CSRF token...');
      const invalidResponse = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: 'test-id', value_rm: 1 }),
      });
      
      if (invalidResponse.status === 403) {
        const data = await invalidResponse.json();
        if (data.code === 'CSRF_TOKEN_MISSING') {
          addResult('✅ CSRF protection working - request without token was blocked');
        } else {
          addResult(`⚠️ Request blocked but unexpected reason: ${data.code}`);
        }
      } else {
        addResult('❌ CSRF protection failed - request without token was allowed');
      }

      // Test 3: Request with invalid CSRF token
      addResult('🧪 Testing request with invalid CSRF token...');
      const invalidTokenResponse = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': 'invalid-token-12345'
        },
        body: JSON.stringify({ customer_id: 'test-id', value_rm: 1 }),
      });
      
      if (invalidTokenResponse.status === 403) {
        const data = await invalidTokenResponse.json();
        if (data.code === 'CSRF_TOKEN_INVALID' || data.code === 'CSRF_TOKEN_MISMATCH') {
          addResult('✅ CSRF protection working - invalid token was rejected');
        } else {
          addResult(`⚠️ Request blocked but unexpected reason: ${data.code}`);
        }
      } else {
        addResult('❌ CSRF protection failed - invalid token was accepted');
      }

    } catch (error) {
      addResult(`❌ Test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <div className="card-header bg-warning">
        <h5 className="mb-0">🔒 CSRF Protection Test Panel</h5>
        <small className="text-muted">Development/Testing Tool - Remove in Production</small>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Current CSRF Token Status:</strong>
          <div className="mt-2">
            {csrfLoading ? (
              <span className="badge bg-warning">Loading...</span>
            ) : token ? (
              <span className="badge bg-success">Token Available</span>
            ) : (
              <span className="badge bg-danger">No Token</span>
            )}
          </div>
          {token && (
            <div className="mt-2">
              <small className="text-muted">
                Token: <code>{token.substring(0, 20)}...</code>
              </small>
            </div>
          )}
        </div>

        <div className="mb-3">
          <BrandButton 
            onClick={testCSRFProtection} 
            disabled={loading || csrfLoading}
            variant="primary"
          >
            {loading ? 'Running Tests...' : 'Run CSRF Tests'}
          </BrandButton>
          {testResults.length > 0 && (
            <BrandButton 
              onClick={clearResults} 
              disabled={loading}
              variant="secondary"
              className="ms-2"
            >
              Clear Results
            </BrandButton>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="mt-3">
            <h6>Test Results:</h6>
            <div 
              className="bg-light p-3 rounded" 
              style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}
            >
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h6>Expected Results:</h6>
          <ul className="small text-muted">
            <li>✅ Valid requests with CSRF tokens should succeed or fail with business logic errors</li>
            <li>✅ Requests without CSRF tokens should be blocked with 403 status</li>
            <li>✅ Requests with invalid CSRF tokens should be blocked with 403 status</li>
            <li>❌ If any test shows unexpected behavior, CSRF protection needs fixing</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 