'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

interface AgencySignUpFormData {
  agencyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  licenseNumber: string;
  yearsInBusiness: string;
}

export default function AgencySignUpPage() {
  const [formData, setFormData] = useState<AgencySignUpFormData>({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    licenseNumber: '',
    yearsInBusiness: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would be a real API call to register the agency
      console.log('Agency sign-up data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to success page or dashboard
      window.location.href = '/agency/dashboard';
    } catch (err) {
      setError('Failed to create agency account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="mb-4">
      <h4 className="mb-3" style={{ color: colors.navy }}>
        Basic Information
      </h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="agencyName" className="form-label fw-semibold">
            Agency Name *
          </label>
          <input
            type="text"
            className="form-control"
            id="agencyName"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="contactName" className="form-label fw-semibold">
            Contact Person *
          </label>
          <input
            type="text"
            className="form-control"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email Address *
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="phone" className="form-label fw-semibold">
            Phone Number *
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="mb-4">
      <h4 className="mb-3" style={{ color: colors.navy }}>
        Business Details
      </h4>
      <div className="mb-3">
        <label htmlFor="website" className="form-label fw-semibold">
          Website URL
        </label>
        <input
          type="url"
          className="form-control"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://your-agency.com"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Agency Description
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Tell us about your agency and the services you provide..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="mb-4">
      <h4 className="mb-3" style={{ color: colors.navy }}>
        Professional Information
      </h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="licenseNumber" className="form-label fw-semibold">
            License Number *
          </label>
          <input
            type="text"
            className="form-control"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="yearsInBusiness" className="form-label fw-semibold">
            Years in Business *
          </label>
          <select
            className="form-select"
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleInputChange}
            required
          >
            <option value="">Select years</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-15">11-15 years</option>
            <option value="16-20">16-20 years</option>
            <option value="20+">20+ years</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
        padding: '2rem 0',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <BrandCard
              variant="navy-outline"
              size="lg"
              className="p-4"
              style={{ backgroundColor: 'white' }}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: colors.gold,
                    borderRadius: '50%',
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21"
                      stroke={colors.navy}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke={colors.navy}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="h3 fw-bold mb-2" style={{ color: colors.navy }}>
                  Agency Registration
                </h2>
                <p className="text-muted mb-0">
                  Join our platform and start offering your services to customers
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-semibold" style={{ color: colors.navy }}>
                    Step {currentStep} of 3
                  </span>
                  <span className="small text-muted">
                    {Math.round((currentStep / 3) * 100)}% Complete
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ height: '8px', borderRadius: '0.5rem' }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(currentStep / 3) * 100}%`,
                      backgroundColor: colors.gold,
                      borderRadius: '0.5rem',
                    }}
                  />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {error && (
                  <div className="alert alert-danger mb-3">
                    <i className="bi bi-exclamation-triangle me-2" />
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between">
                  <BrandButton
                    type="button"
                    variant="navy-outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <i className="bi bi-arrow-left me-2" />
                    Previous
                  </BrandButton>

                  {currentStep < 3 ? (
                    <BrandButton
                      type="button"
                      variant="gold"
                      onClick={nextStep}
                      disabled={!formData.agencyName || !formData.contactName || !formData.email || !formData.phone}
                    >
                      Next
                      <i className="bi bi-arrow-right ms-2" />
                    </BrandButton>
                  ) : (
                    <BrandButton
                      type="submit"
                      variant="gold"
                      disabled={isLoading || !formData.licenseNumber || !formData.yearsInBusiness}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2" />
                          Create Agency Account
                        </>
                      )}
                    </BrandButton>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="text-center mt-4 pt-4 border-top">
                <p className="small mb-2" style={{ color: colors.gray[600] }}>
                  Already have an account?
                </p>
                <Link
                  href="/auth/sign-in"
                  style={{ color: colors.navy }}
                  className="text-decoration-none fw-semibold"
                >
                  Sign In
                </Link>
              </div>
            </BrandCard>
          </div>
        </div>
      </div>
    </div>
  );
}
