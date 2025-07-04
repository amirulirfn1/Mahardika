'use client';

import React, { useState, useCallback } from 'react';
import { colors } from '@mahardika/ui';
import { useCSRF } from '@/lib/hooks/useCSRF';

type RequestType = 'export' | 'delete' | 'rectify';

interface DSRFormData {
  type: RequestType;
  email: string;
  fullName: string;
  description: string;
  dataTypes: string[];
  verificationDocument?: File;
  confirmEmail: string;
  agreeToTerms: boolean;
  urgency: 'low' | 'normal' | 'high';
}

interface ValidationErrors {
  [key: string]: string;
}

const DATA_TYPES = [
  { id: 'profile', label: 'Profile Information', description: 'Name, email, phone number, address' },
  { id: 'policies', label: 'Insurance Policies', description: 'Policy details, documents, claims' },
  { id: 'payments', label: 'Payment Information', description: 'Transaction history, payment methods, billing' },
  { id: 'communications', label: 'Communications', description: 'Emails, messages, support tickets, call logs' },
  { id: 'analytics', label: 'Usage Analytics', description: 'Site usage, behavior data, preferences' },
  { id: 'documents', label: 'Uploaded Documents', description: 'Files, attachments, identity verification' },
  { id: 'consent', label: 'Consent Records', description: 'Cookie consents, privacy preferences, opt-ins' },
  { id: 'other', label: 'Other Data', description: 'Any other personal information we may hold' },
];

const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'application/pdf',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const REQUEST_TYPE_INFO = {
  export: {
    title: 'Data Export',
    description: 'Download a copy of your personal data',
    icon: '📦',
    timeline: '30 days',
    details: 'We will compile all your personal data into a downloadable file format (typically JSON or CSV). This includes all data types you select below.',
  },
  delete: {
    title: 'Data Deletion',
    description: 'Permanently remove your personal data',
    icon: '🗑️',
    timeline: '30 days',
    details: 'We will permanently delete the selected data types from our systems. Note: Some data may be retained for legal compliance purposes.',
  },
  rectify: {
    title: 'Data Rectification',
    description: 'Correct inaccurate personal data',
    icon: '✏️',
    timeline: '30 days',
    details: 'We will review and correct any inaccurate personal information. Please provide details about what needs to be corrected in the description field.',
  },
};

export default function DataSubjectRightsPage() {
  const [formData, setFormData] = useState<DSRFormData>({
    type: 'export',
    email: '',
    fullName: '',
    description: '',
    dataTypes: [],
    confirmEmail: '',
    agreeToTerms: false,
    urgency: 'normal',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  
  const { addCSRFToken } = useCSRF();

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Email confirmation validation
    if (!formData.confirmEmail) {
      errors.confirmEmail = 'Please confirm your email address';
    } else if (formData.email !== formData.confirmEmail) {
      errors.confirmEmail = 'Email addresses do not match';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Data types validation
    if (formData.dataTypes.length === 0) {
      errors.dataTypes = 'Please select at least one data type';
    }

    // Description validation for certain request types
    if ((formData.type === 'rectify' || formData.type === 'delete') && !formData.description.trim()) {
      errors.description = formData.type === 'rectify' 
        ? 'Please describe what data needs to be corrected'
        : 'Please provide a reason for data deletion';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    // File validation
    if (formData.verificationDocument) {
      if (!ACCEPTED_FILE_TYPES.includes(formData.verificationDocument.type)) {
        errors.verificationDocument = 'File type not supported. Please upload JPG, PNG, GIF, WebP, or PDF files only.';
      } else if (formData.verificationDocument.size > MAX_FILE_SIZE) {
        errors.verificationDocument = 'File size must be less than 5MB';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, verificationDocument: file }));
      
      // Clear previous file validation errors
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.verificationDocument;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dataTypes', JSON.stringify(formData.dataTypes));
      formDataToSend.append('urgency', formData.urgency);
      
      if (formData.verificationDocument) {
        formDataToSend.append('verificationDocument', formData.verificationDocument);
      }

      const requestOptions = addCSRFToken({
        method: 'POST',
        body: formDataToSend,
      });

      const response = await fetch('/api/dsr/request', requestOptions);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit request');
      }

      const result = await response.json();
      setSubmitStatus('success');
      setShowEmailVerification(true);
      
      // Reset form
      setFormData({
        type: 'export',
        email: '',
        fullName: '',
        description: '',
        dataTypes: [],
        confirmEmail: '',
        agreeToTerms: false,
        urgency: 'normal',
      });
      
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${colors.gray[300]}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const inputErrorStyles: React.CSSProperties = {
    ...inputStyles,
    borderColor: '#EF4444',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: colors.navy,
    marginBottom: '0.5rem',
  };

  const errorTextStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#EF4444',
    marginTop: '0.25rem',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.gray[50],
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: colors.white,
        borderRadius: '0.75rem',
        padding: '2.5rem',
        boxShadow: '0 4px 16px rgba(13, 27, 42, 0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: colors.navy,
            marginBottom: '0.5rem',
          }}>
            🛡️ Data Subject Rights Portal
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: colors.gray[600],
            marginBottom: '1rem',
            lineHeight: '1.6',
          }}>
            Exercise your rights under GDPR, CCPA, and other privacy regulations.
          </p>

          <div style={{
            display: 'inline-flex',
            padding: '0.5rem 1rem',
            backgroundColor: `${colors.gold}20`,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: colors.navy,
          }}>
            🔒 Your request will be processed securely and confidentially
          </div>
        </div>

        {submitStatus === 'success' && showEmailVerification && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#D1FAE5',
            border: `2px solid #10B981`,
            color: '#047857',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Request Submitted Successfully!
            </h3>
            <p style={{ margin: 0 }}>
              We&apos;ve sent a confirmation email to verify your identity. Please check your inbox and follow the instructions to complete your request.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#FEE2E2',
            border: `2px solid #EF4444`,
            color: '#DC2626',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            ❌ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Request Type Selection */}
          <div>
            <label style={labelStyles}>
              Type of Request *
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {Object.entries(REQUEST_TYPE_INFO).map(([value, info]) => (
                <div
                  key={value}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    border: `3px solid ${formData.type === value ? colors.navy : colors.gray[300]}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    backgroundColor: formData.type === value ? colors.gray[50] : 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, type: value as RequestType }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{info.icon}</span>
                    <h3 style={{ margin: 0, fontWeight: '600', color: colors.navy }}>{info.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: colors.gray[600], margin: '0 0 0.5rem 0' }}>
                    {info.description}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: colors.gray[500], margin: 0, lineHeight: '1.4' }}>
                    {info.details}
                  </p>
                  <div style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: `${colors.gold}20`,
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    color: colors.navy,
                    alignSelf: 'flex-start',
                  }}>
                    ⏱️ Timeline: {info.timeline}
                  </div>
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={formData.type === value}
                    onChange={() => setFormData(prev => ({ ...prev, type: value as RequestType }))}
                    style={{ display: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            <div>
              <label style={labelStyles}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                style={validationErrors.fullName ? inputErrorStyles : inputStyles}
                placeholder="Enter your full legal name"
                required
              />
              {validationErrors.fullName && (
                <div style={errorTextStyles}>{validationErrors.fullName}</div>
              )}
            </div>

            <div>
              <label style={labelStyles}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={validationErrors.email ? inputErrorStyles : inputStyles}
                placeholder="your.email@example.com"
                required
              />
              {validationErrors.email && (
                <div style={errorTextStyles}>{validationErrors.email}</div>
              )}
            </div>

            <div>
              <label style={labelStyles}>
                Confirm Email Address *
              </label>
              <input
                type="email"
                value={formData.confirmEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmEmail: e.target.value }))}
                style={validationErrors.confirmEmail ? inputErrorStyles : inputStyles}
                placeholder="Confirm your email address"
                required
              />
              {validationErrors.confirmEmail && (
                <div style={errorTextStyles}>{validationErrors.confirmEmail}</div>
              )}
            </div>

            <div>
              <label style={labelStyles}>
                Request Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as 'low' | 'normal' | 'high' }))}
                style={inputStyles}
              >
                <option value="low">Low - Standard processing</option>
                <option value="normal">Normal - Within 30 days</option>
                <option value="high">High - Urgent (explain why below)</option>
              </select>
            </div>
          </div>

          {/* Data Types */}
          <div>
            <label style={labelStyles}>
              Data Types to Include *
            </label>
            <p style={{ fontSize: '0.875rem', color: colors.gray[600], marginBottom: '1rem' }}>
              Select all types of personal data that apply to your request:
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              {DATA_TYPES.map((dataType) => (
                <label
                  key={dataType.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    border: `2px solid ${formData.dataTypes.includes(dataType.id) ? colors.navy : colors.gray[300]}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: formData.dataTypes.includes(dataType.id) ? colors.gray[50] : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.dataTypes.includes(dataType.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, dataTypes: [...prev.dataTypes, dataType.id] }));
                      } else {
                        setFormData(prev => ({ ...prev, dataTypes: prev.dataTypes.filter(id => id !== dataType.id) }));
                      }
                    }}
                    style={{ marginRight: '0.75rem', marginTop: '0.125rem' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: colors.navy, fontSize: '0.875rem' }}>
                      {dataType.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.gray[600], lineHeight: '1.3' }}>
                      {dataType.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            {validationErrors.dataTypes && (
              <div style={errorTextStyles}>{validationErrors.dataTypes}</div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyles}>
              Description {(formData.type === 'rectify' || formData.type === 'delete') && '*'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                ...inputStyles,
                minHeight: '120px',
                resize: 'vertical',
                ...(validationErrors.description ? { borderColor: '#EF4444' } : {}),
              }}
              placeholder={
                formData.type === 'export' 
                  ? 'Optional: Specify any particular data or time period you&apos;re interested in...'
                  : formData.type === 'delete'
                  ? 'Required: Please explain why you want your data deleted...'
                  : 'Required: Please describe what information needs to be corrected and provide the correct information...'
              }
            />
            {validationErrors.description && (
              <div style={errorTextStyles}>{validationErrors.description}</div>
            )}
          </div>

          {/* Verification Document */}
          <div>
            <label style={labelStyles}>
              Identity Verification Document (Optional)
            </label>
            <p style={{ fontSize: '0.875rem', color: colors.gray[600], marginBottom: '0.75rem' }}>
              Upload a document to verify your identity (driver&apos;s license, passport, etc.). This helps us process your request faster.
            </p>
            
            <div style={{
              border: `2px dashed ${validationErrors.verificationDocument ? '#EF4444' : colors.gray[300]}`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              backgroundColor: colors.gray[50],
            }}>
              <input
                type="file"
                id="verificationDocument"
                accept={ACCEPTED_FILE_TYPES.join(',')}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="verificationDocument"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: colors.navy,
                  color: colors.white,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                }}
              >
                📎 Choose File
              </label>
              <p style={{ 
                fontSize: '0.75rem', 
                color: colors.gray[600], 
                margin: '0.5rem 0 0 0',
              }}>
                Supported: JPG, PNG, GIF, WebP, PDF (max 5MB)
              </p>
              {formData.verificationDocument && (
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: colors.navy, 
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600',
                }}>
                  📄 {formData.verificationDocument.name}
                </p>
              )}
            </div>
            
            {validationErrors.verificationDocument && (
              <div style={errorTextStyles}>{validationErrors.verificationDocument}</div>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}>
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                style={{ marginTop: '0.125rem' }}
                required
              />
              <span style={{ color: colors.gray[700] }}>
                I confirm that the information provided is accurate and that I am the data subject or have been authorized to act on behalf of the data subject. I understand that providing false information may delay or prevent processing of this request. *
              </span>
            </label>
            {validationErrors.agreeToTerms && (
              <div style={errorTextStyles}>{validationErrors.agreeToTerms}</div>
            )}
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '1rem 2rem',
                backgroundColor: isSubmitting ? colors.gray[400] : colors.navy,
                color: colors.white,
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                minWidth: '200px',
              }}
            >
              {isSubmitting ? '🔄 Submitting...' : `🚀 Submit ${REQUEST_TYPE_INFO[formData.type].title} Request`}
            </button>
            
            <p style={{ 
              fontSize: '0.75rem', 
              color: colors.gray[600], 
              margin: '1rem 0 0 0',
              lineHeight: '1.4',
            }}>
              By submitting this form, you agree to our{' '}
              <a href="/privacy" style={{ color: colors.navy, textDecoration: 'underline' }}>
                Privacy Policy
              </a>{' '}
              and understand that we will contact you at the provided email address to verify your identity and process your request.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 