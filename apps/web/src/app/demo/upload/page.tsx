'use client';

import React, { useState } from 'react';
import BossUploadForm from '@/components/BossUploadForm';
import { MAHARDIKA_COLORS } from '@/lib/env';

interface UploadResult {
  success: boolean;
  url?: string;
  size_kb?: number;
  fileName?: string;
  originalSize?: number;
  compressionRatio?: number;
  error?: string;
  scanResults?: {
    infected: boolean;
    threats?: string[];
    scanTime: number;
  };
}

export default function UploadDemoPage() {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [demoMode, setDemoMode] = useState<'compress' | 'legacy'>('compress');
  const [showStats, setShowStats] = useState(true);

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResults(prev => [result, ...prev]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setUploadResults(prev => [
      {
        success: false,
        error,
      },
      ...prev,
    ]);
  };

  const clearResults = () => {
    setUploadResults([]);
  };

  const getEndpoint = () => {
    return demoMode === 'compress' ? '/api/compressUpload' : '/api/uploadPDF';
  };

  return (
    <div className="upload-demo-page">
      <style jsx>{`
        .upload-demo-page {
          --mahardika-navy: ${MAHARDIKA_COLORS.navy};
          --mahardika-gold: ${MAHARDIKA_COLORS.gold};
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(13, 27, 42, 0.05) 0%,
            rgba(244, 180, 0, 0.05) 100%
          );
          padding: 2rem 0;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 0 1rem;
        }

        .demo-title {
          color: var(--mahardika-navy);
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(13, 27, 42, 0.1);
        }

        .demo-subtitle {
          color: #6c757d;
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .demo-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .demo-toggle {
          display: flex;
          background: white;
          border-radius: 0.75rem;
          padding: 0.25rem;
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.1);
          border: 2px solid transparent;
        }

        .toggle-option {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          color: #6c757d;
          font-weight: 500;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-option.active {
          background: linear-gradient(
            135deg,
            var(--mahardika-navy) 0%,
            rgba(13, 27, 42, 0.9) 100%
          );
          color: white;
          box-shadow: 0 2px 8px rgba(13, 27, 42, 0.3);
        }

        .demo-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .demo-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .upload-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(13, 27, 42, 0.1);
          border: 2px solid rgba(244, 180, 0, 0.1);
        }

        .section-title {
          color: var(--mahardika-navy);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          color: var(--mahardika-gold);
          font-size: 1.75rem;
        }

        .results-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(13, 27, 42, 0.1);
          border: 2px solid rgba(13, 27, 42, 0.1);
          max-height: 600px;
          overflow-y: auto;
        }

        .results-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .results-count {
          background: linear-gradient(
            135deg,
            var(--mahardika-gold) 0%,
            rgba(244, 180, 0, 0.9) 100%
          );
          color: var(--mahardika-navy);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .clear-results {
          background: none;
          border: 2px solid #dc3545;
          color: #dc3545;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .clear-results:hover {
          background: #dc3545;
          color: white;
        }

        .result-item {
          background: rgba(13, 27, 42, 0.02);
          border: 1px solid rgba(13, 27, 42, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .result-item:hover {
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.1);
          transform: translateY(-1px);
        }

        .result-success {
          border-left: 4px solid #28a745;
        }

        .result-error {
          border-left: 4px solid #dc3545;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .result-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .result-status.success {
          color: #28a745;
        }

        .result-status.error {
          color: #dc3545;
        }

        .result-timestamp {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .result-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          text-align: center;
          padding: 0.75rem;
          background: rgba(244, 180, 0, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(244, 180, 0, 0.2);
        }

        .detail-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--mahardika-navy);
          margin-bottom: 0.25rem;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .scan-results {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid rgba(40, 167, 69, 0.3);
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-top: 1rem;
        }

        .scan-results.infected {
          background: rgba(220, 53, 69, 0.1);
          border-color: rgba(220, 53, 69, 0.3);
        }

        .scan-status {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .scan-status.clean {
          color: #28a745;
        }

        .scan-status.infected {
          color: #dc3545;
        }

        .feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: linear-gradient(
            135deg,
            var(--mahardika-navy) 0%,
            rgba(13, 27, 42, 0.9) 100%
          );
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.1);
          border: 2px solid rgba(244, 180, 0, 0.1);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--mahardika-navy);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6c757d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.875rem;
        }

        .no-results {
          text-align: center;
          color: #6c757d;
          font-style: italic;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .demo-title {
            font-size: 2rem;
          }

          .demo-content {
            grid-template-columns: 1fr;
          }

          .result-details {
            grid-template-columns: 1fr 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="demo-header">
        <h1 className="demo-title">
          <i
            className="bi bi-cloud-arrow-up me-3"
            style={{ color: MAHARDIKA_COLORS.gold }}
          />
          Mahardika Upload Demo
        </h1>
        <p className="demo-subtitle">
          Experience our advanced PDF upload system with compression, virus
          scanning, and secure storage. Ready for Sprint 3 demo!
        </p>

        {/* Demo Controls */}
        <div className="demo-controls">
          <div className="demo-toggle">
            <button
              className={`toggle-option ${demoMode === 'compress' ? 'active' : ''}`}
              onClick={() => setDemoMode('compress')}
            >
              <i className="bi bi-gear-fill me-2" />
              Compress & Scan
            </button>
            <button
              className={`toggle-option ${demoMode === 'legacy' ? 'active' : ''}`}
              onClick={() => setDemoMode('legacy')}
            >
              <i className="bi bi-upload me-2" />
              Legacy Upload
            </button>
          </div>

          <button
            className="toggle-option"
            onClick={() => setShowStats(!showStats)}
            style={{
              background: showStats ? MAHARDIKA_COLORS.gold : 'white',
              color: showStats ? MAHARDIKA_COLORS.navy : '#6c757d',
              border: `2px solid ${showStats ? MAHARDIKA_COLORS.gold : '#e9ecef'}`,
              borderRadius: '0.75rem',
            }}
          >
            <i
              className={`bi ${showStats ? 'bi-eye-fill' : 'bi-eye-slash-fill'} me-2`}
            />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>

        {/* Feature Badges */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="feature-badge">
            <i className="bi bi-shield-check" />
            Virus Scanning
          </span>
          <span className="feature-badge">
            <i className="bi bi-arrow-down-circle" />
            PDF Compression
          </span>
          <span className="feature-badge">
            <i className="bi bi-lock" />
            Signed URLs
          </span>
          <span className="feature-badge">
            <i className="bi bi-speedometer2" />
            Progress Tracking
          </span>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <div
          className="stats-grid"
          style={{
            maxWidth: '1200px',
            margin: '0 auto 2rem',
            padding: '0 1rem',
          }}
        >
          <div className="stat-card">
            <div className="stat-value">
              {uploadResults.filter(r => r.success).length}
            </div>
            <div className="stat-label">Successful Uploads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {uploadResults.filter(r => !r.success).length}
            </div>
            <div className="stat-label">Failed Uploads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {uploadResults
                .filter(r => r.compressionRatio)
                .reduce(
                  (avg, r, _, arr) => avg + r.compressionRatio! / arr.length,
                  0
                )
                .toFixed(1)}
              %
            </div>
            <div className="stat-label">Avg Compression</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {
                uploadResults
                  .filter(r => r.scanResults)
                  .filter(r => !r.scanResults!.infected).length
              }
            </div>
            <div className="stat-label">Clean Files</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="demo-content">
        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="section-title">
            <i className="section-icon bi bi-cloud-upload-fill" />
            {demoMode === 'compress' ? 'Advanced Upload' : 'Legacy Upload'}
          </h2>

          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'rgba(244, 180, 0, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(244, 180, 0, 0.3)',
            }}
          >
            <strong style={{ color: MAHARDIKA_COLORS.navy }}>
              {demoMode === 'compress' ? 'NEW:' : 'LEGACY:'}
            </strong>
            <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>
              {demoMode === 'compress'
                ? 'Includes compression, virus scanning, and signed URLs'
                : 'Basic upload with file validation only'}
            </span>
          </div>

          <BossUploadForm
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <h2 className="section-title">
              <i className="section-icon bi bi-list-check" />
              Upload Results
              <span className="results-count">{uploadResults.length}</span>
            </h2>
            {uploadResults.length > 0 && (
              <button className="clear-results" onClick={clearResults}>
                <i className="bi bi-trash me-1" />
                Clear
              </button>
            )}
          </div>

          {uploadResults.length === 0 ? (
            <div className="no-results">
              <i
                className="bi bi-inbox"
                style={{
                  fontSize: '3rem',
                  color: '#e9ecef',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              />
              No uploads yet. Try uploading a PDF file to see the results!
            </div>
          ) : (
            uploadResults.map((result, index) => (
              <div
                key={index}
                className={`result-item ${result.success ? 'result-success' : 'result-error'}`}
              >
                <div className="result-header">
                  <div
                    className={`result-status ${result.success ? 'success' : 'error'}`}
                  >
                    <i
                      className={`bi ${result.success ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
                    />
                    {result.success ? 'Upload Successful' : 'Upload Failed'}
                  </div>
                  <div className="result-timestamp">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {result.success && (
                  <>
                    <div className="result-details">
                      <div className="detail-item">
                        <div className="detail-value">{result.size_kb}KB</div>
                        <div className="detail-label">Final Size</div>
                      </div>
                      {result.compressionRatio !== undefined && (
                        <div className="detail-item">
                          <div className="detail-value">
                            {result.compressionRatio.toFixed(1)}%
                          </div>
                          <div className="detail-label">Compressed</div>
                        </div>
                      )}
                      {result.originalSize && (
                        <div className="detail-item">
                          <div className="detail-value">
                            {Math.round(result.originalSize / 1024)}KB
                          </div>
                          <div className="detail-label">Original Size</div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: MAHARDIKA_COLORS.navy }}>
                        File:
                      </strong>
                      <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>
                        {result.fileName}
                      </span>
                    </div>

                    {result.scanResults && (
                      <div
                        className={`scan-results ${result.scanResults.infected ? 'infected' : ''}`}
                      >
                        <div
                          className={`scan-status ${result.scanResults.infected ? 'infected' : 'clean'}`}
                        >
                          <i
                            className={`bi ${result.scanResults.infected ? 'bi-shield-x' : 'bi-shield-check'} me-2`}
                          />
                          Virus Scan:{' '}
                          {result.scanResults.infected ? 'INFECTED' : 'CLEAN'}
                        </div>
                        <small style={{ color: '#6c757d' }}>
                          Scan completed in {result.scanResults.scanTime}ms
                          {result.scanResults.threats &&
                            result.scanResults.threats.length > 0 && (
                              <span>
                                {' '}
                                • {result.scanResults.threats.length} threats
                                detected
                              </span>
                            )}
                        </small>
                      </div>
                    )}
                  </>
                )}

                {!result.success && result.error && (
                  <div style={{ color: '#dc3545', marginTop: '0.5rem' }}>
                    <i className="bi bi-exclamation-triangle me-2" />
                    {result.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
