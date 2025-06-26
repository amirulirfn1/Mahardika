'use client';

import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { colors } from '@mahardika/ui';

interface AiMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  userId?: string;
  className?: string;
}

interface AiResponse {
  text: string;
  language: string;
  tokensUsed: number;
  usage: {
    current: number;
    limit: number;
    remaining: number;
  };
}

const brandColors = {
  navy: colors.navy,
  gold: colors.gold,
};

const AiMessageModal: React.FC<AiMessageModalProps> = ({
  isOpen,
  onClose,
  agencyId,
  userId,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState<'en' | 'ms'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AiResponse | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (responseTextareaRef.current) {
      responseTextareaRef.current.style.height = 'auto';
      responseTextareaRef.current.style.height = `${responseTextareaRef.current.scrollHeight}px`;
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          lang: language,
          agencyId,
          userId,
        }),
      });

      if (!res.ok) {
        if (res.status === 402) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Token limit exceeded');
        }
        throw new Error(`API Error: ${res.status}`);
      }

      const data: AiResponse = await res.json();
      setResponse(data.text);
      setLastResponse(data);
    } catch (err) {
      console.error('AI Message Error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to get AI response'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'ms' : 'en';
    setLanguage(newLanguage);

    // If we have a current message and response, re-call the API with new language
    if (message.trim() && response) {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/ai/msg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim(),
            lang: newLanguage,
            agencyId,
            userId,
          }),
        });

        if (!res.ok) {
          if (res.status === 402) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Token limit exceeded');
          }
          throw new Error(`API Error: ${res.status}`);
        }

        const data: AiResponse = await res.json();
        setResponse(data.text);
        setLastResponse(data);
      } catch (err) {
        console.error('Language toggle error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to translate response'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setMessage('');
    setResponse('');
    setError(null);
    setLastResponse(null);
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className={`modal-dialog modal-lg ${className}`}>
        <div
          className="modal-content"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${brandColors.gold}`,
            boxShadow: '0 10px 30px rgba(13, 27, 42, 0.3)',
          }}
        >
          {/* Header */}
          <div
            className="modal-header"
            style={{
              backgroundColor: brandColors.navy,
              color: 'white',
              borderRadius: '0.5rem 0.5rem 0 0',
            }}
          >
            <div>
              <h5 className="modal-title mb-0 fw-bold">
                <i className="bi bi-robot me-2" />
                Mahardika AI Assistant
              </h5>
              <small className="opacity-75">Powered by DeepSeek AI</small>
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* Language Toggle */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="languageToggle"
                  checked={language === 'ms'}
                  onChange={handleLanguageToggle}
                  style={{
                    backgroundColor:
                      language === 'ms' ? brandColors.gold : '#6c757d',
                  }}
                />
                <label
                  className="form-check-label text-white fw-bold"
                  htmlFor="languageToggle"
                >
                  {language === 'en' ? 'EN' : 'BM'}
                </label>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Input Section */}
              <div className="mb-3">
                <label
                  htmlFor="aiMessage"
                  className="form-label fw-bold"
                  style={{ color: brandColors.navy }}
                >
                  {language === 'en' ? 'Your Message' : 'Mesej Anda'}
                </label>
                <textarea
                  ref={textareaRef}
                  id="aiMessage"
                  className="form-control"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Ask me anything about insurance, policies, or how I can help...'
                      : 'Tanya saya tentang insurans, polisi, atau bagaimana saya boleh membantu...'
                  }
                  rows={3}
                  style={{
                    borderRadius: '0.5rem',
                    border: `2px solid ${brandColors.gold}40`,
                    resize: 'none',
                    minHeight: '80px',
                  }}
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-3">
                <button
                  type="submit"
                  className="btn fw-bold"
                  disabled={!message.trim() || loading}
                  style={{
                    backgroundColor: brandColors.navy,
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      {language === 'en' ? 'Thinking...' : 'Berfikir...'}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2" />
                      {language === 'en' ? 'Send Message' : 'Hantar Mesej'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClear}
                  disabled={loading}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <i className="bi bi-trash me-2" />
                  {language === 'en' ? 'Clear' : 'Padam'}
                </button>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div
                className="alert alert-danger"
                style={{ borderRadius: '0.5rem' }}
              >
                <i className="bi bi-exclamation-triangle-fill me-2" />
                {error}
              </div>
            )}

            {/* Response Section */}
            {response && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label
                    className="form-label fw-bold mb-0"
                    style={{ color: brandColors.navy }}
                  >
                    {language === 'en' ? 'AI Response' : 'Jawapan AI'}
                  </label>
                  <div className="d-flex gap-2">
                    {lastResponse && (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: brandColors.gold,
                          color: brandColors.navy,
                        }}
                      >
                        {lastResponse.tokensUsed} tokens
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={copyToClipboard}
                      style={{ borderRadius: '0.5rem' }}
                    >
                      <i className="bi bi-clipboard me-1" />
                      {language === 'en' ? 'Copy' : 'Salin'}
                    </button>
                  </div>
                </div>
                <textarea
                  ref={responseTextareaRef}
                  className="form-control"
                  value={response}
                  readOnly
                  style={{
                    borderRadius: '0.5rem',
                    border: `2px solid ${brandColors.navy}40`,
                    backgroundColor: `${brandColors.navy}05`,
                    resize: 'none',
                    minHeight: '100px',
                  }}
                />
              </div>
            )}

            {/* Usage Info */}
            {lastResponse?.usage && (
              <div className="mt-3">
                <div
                  className="alert alert-info py-2"
                  style={{
                    borderRadius: '0.5rem',
                    backgroundColor: `${brandColors.gold}10`,
                    border: `1px solid ${brandColors.gold}40`,
                    color: brandColors.navy,
                  }}
                >
                  <small>
                    <i className="bi bi-info-circle me-2" />
                    {language === 'en'
                      ? `Usage: ${lastResponse.usage.current.toLocaleString()} / ${lastResponse.usage.limit.toLocaleString()} tokens (${lastResponse.usage.remaining.toLocaleString()} remaining)`
                      : `Penggunaan: ${lastResponse.usage.current.toLocaleString()} / ${lastResponse.usage.limit.toLocaleString()} token (${lastResponse.usage.remaining.toLocaleString()} baki)`}
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="modal-footer"
            style={{
              backgroundColor: `${brandColors.gold}10`,
              borderRadius: '0 0 0.5rem 0.5rem',
            }}
          >
            <small className="text-muted">
              {language === 'en'
                ? 'Powered by Mahardika Platform • DeepSeek AI Technology'
                : 'Dikuasakan oleh Platform Mahardika • Teknologi AI DeepSeek'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMessageModal;
