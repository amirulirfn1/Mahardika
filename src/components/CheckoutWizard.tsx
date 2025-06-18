'use client';

import React, { useState } from 'react';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

interface CheckoutItem {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_sku?: string;
  unit_price: number;
  quantity: number;
}

interface CheckoutWizardProps {
  items: CheckoutItem[];
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

interface CustomerInfo {
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface PaymentInfo {
  payment_method: string;
  notes: string;
}

type WizardStep = 'customer' | 'review' | 'payment' | 'processing' | 'complete';

export default function CheckoutWizard({
  items,
  onComplete,
  onCancel,
}: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('customer');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    payment_method: 'cash',
    notes: '',
  });
  const [orderId, setOrderId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCustomerNext = () => {
    if (!customerInfo.customer_name || !customerInfo.customer_email) {
      setError('Please fill in all required customer information');
      return;
    }
    setError('');
    setCurrentStep('review');
  };

  const handleSubmitOrder = async () => {
    setCurrentStep('processing');
    setError('');

    try {
      const checkoutData = {
        customer_id: customerInfo.customer_id || '',
        customer_name: customerInfo.customer_name,
        customer_email: customerInfo.customer_email,
        customer_phone: customerInfo.customer_phone,
        items,
        payment_method: paymentInfo.payment_method,
        notes: paymentInfo.notes,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.order.id);
        setCurrentStep('complete');
        onComplete(result.order.id);
      } else {
        setError(result.error || 'Failed to create order');
        setCurrentStep('payment');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
      setCurrentStep('payment');
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'customer', label: 'Customer Info', icon: '👤' },
      { key: 'review', label: 'Review Order', icon: '📋' },
      { key: 'payment', label: 'Payment', icon: '💳' },
      { key: 'complete', label: 'Complete', icon: '✅' },
    ];

    const stepIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className="d-flex flex-column align-items-center flex-fill"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor:
                      index <= stepIndex ? colors.navy : colors.gray[300],
                    color: index <= stepIndex ? 'white' : colors.gray[600],
                    fontSize: '1.2rem',
                  }}
                >
                  {step.icon}
                </div>
                <small
                  style={{
                    color: index <= stepIndex ? colors.navy : colors.gray[600],
                    fontWeight: index === stepIndex ? 'bold' : 'normal',
                  }}
                >
                  {step.label}
                </small>
                {index < steps.length - 1 && (
                  <div
                    className="position-absolute"
                    style={{
                      width: '100px',
                      height: '2px',
                      backgroundColor:
                        index < stepIndex ? colors.gold : colors.gray[300],
                      top: '25px',
                      left: '75px',
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerStep = () => (
    <BrandCard variant="navy-outline" size="lg">
      <h3 className="h4 mb-4" style={{ color: colors.navy }}>
        Customer Information
      </h3>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label
            className="form-label"
            style={{ color: colors.navy, fontWeight: '600' }}
          >
            Full Name *
          </label>
          <input
            type="text"
            className="form-control"
            value={customerInfo.customer_name}
            onChange={e =>
              setCustomerInfo(prev => ({
                ...prev,
                customer_name: e.target.value,
              }))
            }
            style={{
              borderColor: colors.gray[300],
              borderRadius: '0.5rem',
            }}
            placeholder="Enter customer's full name"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label
            className="form-label"
            style={{ color: colors.navy, fontWeight: '600' }}
          >
            Email Address *
          </label>
          <input
            type="email"
            className="form-control"
            value={customerInfo.customer_email}
            onChange={e =>
              setCustomerInfo(prev => ({
                ...prev,
                customer_email: e.target.value,
              }))
            }
            style={{
              borderColor: colors.gray[300],
              borderRadius: '0.5rem',
            }}
            placeholder="customer@example.com"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label
            className="form-label"
            style={{ color: colors.navy, fontWeight: '600' }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            value={customerInfo.customer_phone}
            onChange={e =>
              setCustomerInfo(prev => ({
                ...prev,
                customer_phone: e.target.value,
              }))
            }
            style={{
              borderColor: colors.gray[300],
              borderRadius: '0.5rem',
            }}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      <div className="d-flex justify-content-between">
        <BrandButton variant="navy-outline" size="md" onClick={onCancel}>
          Cancel
        </BrandButton>
        <BrandButton variant="navy" size="md" onClick={handleCustomerNext}>
          Next Step
        </BrandButton>
      </div>
    </BrandCard>
  );

  const renderReviewStep = () => (
    <div className="row">
      <div className="col-lg-8 mb-4">
        <BrandCard variant="navy-outline" size="lg">
          <h3 className="h4 mb-4" style={{ color: colors.navy }}>
            Order Summary
          </h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center py-3 border-bottom"
            >
              <div className="flex-grow-1">
                <h6 className="mb-1" style={{ color: colors.navy }}>
                  {item.product_name}
                </h6>
                {item.product_description && (
                  <small className="text-muted">
                    {item.product_description}
                  </small>
                )}
                <div className="mt-1">
                  <small style={{ color: colors.gray[600] }}>
                    Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                  </small>
                </div>
              </div>
              <div className="text-end">
                <strong style={{ color: colors.gold }}>
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </strong>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong style={{ color: colors.navy }}>Total:</strong>
              <strong style={{ color: colors.gold, fontSize: '1.2rem' }}>
                ${total.toFixed(2)}
              </strong>
            </div>
          </div>
        </BrandCard>
      </div>

      <div className="col-lg-4">
        <BrandCard variant="gold-outline" size="lg">
          <h4 className="h5 mb-3" style={{ color: colors.navy }}>
            Customer Details
          </h4>
          <div className="mb-2">
            <strong>Name:</strong> {customerInfo.customer_name}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {customerInfo.customer_email}
          </div>
          {customerInfo.customer_phone && (
            <div className="mb-4">
              <strong>Phone:</strong> {customerInfo.customer_phone}
            </div>
          )}

          <div className="d-flex justify-content-between">
            <BrandButton
              variant="navy-outline"
              size="sm"
              onClick={() => setCurrentStep('customer')}
            >
              Edit
            </BrandButton>
            <BrandButton
              variant="gold"
              size="sm"
              onClick={() => setCurrentStep('payment')}
            >
              Continue
            </BrandButton>
          </div>
        </BrandCard>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <BrandCard variant="navy-outline" size="lg">
      <h3 className="h4 mb-4" style={{ color: colors.navy }}>
        Payment Information
      </h3>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label
            className="form-label"
            style={{ color: colors.navy, fontWeight: '600' }}
          >
            Payment Method
          </label>
          <select
            className="form-select"
            value={paymentInfo.payment_method}
            onChange={e =>
              setPaymentInfo(prev => ({
                ...prev,
                payment_method: e.target.value,
              }))
            }
            style={{
              borderColor: colors.gray[300],
              borderRadius: '0.5rem',
            }}
          >
            <option value="cash">Cash Payment</option>
            <option value="check">Check</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          className="form-label"
          style={{ color: colors.navy, fontWeight: '600' }}
        >
          Order Notes (Optional)
        </label>
        <textarea
          className="form-control"
          rows={3}
          value={paymentInfo.notes}
          onChange={e =>
            setPaymentInfo(prev => ({ ...prev, notes: e.target.value }))
          }
          style={{
            borderColor: colors.gray[300],
            borderRadius: '0.5rem',
          }}
          placeholder="Add any special instructions or notes..."
        />
      </div>

      {error && (
        <div className="alert alert-danger" style={{ borderRadius: '0.5rem' }}>
          {error}
        </div>
      )}

      <div className="d-flex justify-content-between">
        <BrandButton
          variant="navy-outline"
          size="md"
          onClick={() => setCurrentStep('review')}
        >
          Back
        </BrandButton>
        <BrandButton variant="gold" size="md" onClick={handleSubmitOrder}>
          Create Order
        </BrandButton>
      </div>
    </BrandCard>
  );

  const renderProcessingStep = () => (
    <BrandCard variant="navy-outline" size="lg" className="text-center">
      <div className="py-5">
        <div
          className="spinner-border mb-4"
          style={{ color: colors.gold, width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 style={{ color: colors.navy }}>Processing Your Order...</h3>
        <p style={{ color: colors.gray[600] }}>
          Please wait while we create your order and send notifications.
        </p>
      </div>
    </BrandCard>
  );

  const renderCompleteStep = () => (
    <BrandCard variant="gold-primary" size="lg" className="text-center">
      <div className="py-5">
        <div style={{ fontSize: '4rem', color: colors.navy }}>✅</div>
        <h2 style={{ color: colors.navy }} className="mb-3">
          Order Created Successfully!
        </h2>
        <p style={{ color: colors.navy }} className="mb-4">
          Your order has been created and notifications have been sent.
        </p>
        <div
          className="p-3 mb-4 rounded"
          style={{ backgroundColor: 'rgba(13, 27, 42, 0.1)' }}
        >
          <small style={{ color: colors.navy }}>Order ID: {orderId}</small>
        </div>
        <BrandButton
          variant="navy"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Create Another Order
        </BrandButton>
      </div>
    </BrandCard>
  );

  return (
    <div className="container-fluid">
      {renderStepIndicator()}

      {currentStep === 'customer' && renderCustomerStep()}
      {currentStep === 'review' && renderReviewStep()}
      {currentStep === 'payment' && renderPaymentStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
}
