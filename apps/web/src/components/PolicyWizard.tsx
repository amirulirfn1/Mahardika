'use client';

import React, { useState, useEffect } from 'react';
import { BrandButton, colors } from '@mahardika/ui';
import { z } from 'zod';

// --- schemas
const customerSchema = z.object({ id: z.string().uuid(), name: z.string() });
const vehicleSchema = z.object({ id: z.string().uuid(), plate_no: z.string() });

export type PolicyWizardResult = {
  id?: string;
  customer_id: string;
  vehicle_id: string;
  policy_type: string;
  product_name: string;
  start_date: string; // ISO
  end_date: string;
  premium_amount: number;
  coverage_amount: number;
  pdf_url?: string;
};

type Props = {
  onComplete: (data: PolicyWizardResult) => void;
  defaultValues?: Partial<PolicyWizardResult>;
};

export default function PolicyWizard({
  onComplete,
  defaultValues = {},
}: Props) {
  type Step = 'customer' | 'vehicle' | 'details' | 'pdf';
  const [step, setStep] = useState<Step>('customer');
  const [customers, setCustomers] = useState<
    Array<z.infer<typeof customerSchema>>
  >([]);
  const [vehicles, setVehicles] = useState<
    Array<z.infer<typeof vehicleSchema>>
  >([]);

  const [form, setForm] = useState<PolicyWizardResult>({
    customer_id: defaultValues.customer_id || '',
    vehicle_id: defaultValues.vehicle_id || '',
    policy_type: defaultValues.policy_type || '',
    product_name: defaultValues.product_name || '',
    start_date: defaultValues.start_date || '',
    end_date: defaultValues.end_date || '',
    premium_amount: defaultValues.premium_amount || 0,
    coverage_amount: defaultValues.coverage_amount || 0,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // fetch customers & vehicles lists
    (async () => {
      const resC = await fetch('/api/customers');
      if (resC.ok) {
        setCustomers(await resC.json());
      }
      const resV = await fetch('/api/vehicles');
      if (resV.ok) {
        setVehicles(await resV.json());
      }
    })();
  }, []);

  const isDetailsValid = () =>
    form.policy_type &&
    form.product_name &&
    form.start_date &&
    form.end_date &&
    form.premium_amount > 0;

  const uploadPdf = async (): Promise<string | undefined> => {
    if (!pdfFile) return undefined;
    setUploading(true);
    // Upload to Supabase Storage bucket 'policy-pdfs'
    const { createBrowserClient } = await import('@supabase/ssr');
    const { getSupabaseConfig } = await import('@/lib/env');
    const { url, anonKey } = getSupabaseConfig();
    const supabase = createBrowserClient(url, anonKey);
    const filePath = `${Date.now()}_${pdfFile.name}`;
    const { error } = await supabase.storage
      .from('policy-pdfs')
      .upload(filePath, pdfFile);
    if (error) throw error;
    const { data } = await supabase.storage
      .from('policy-pdfs')
      .getPublicUrl(filePath);
    setUploading(false);
    return data?.publicUrl;
  };

  const finish = async () => {
    try {
      const pdfUrl = await uploadPdf();
      onComplete({ ...form, pdf_url: pdfUrl });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // --- render helpers
  const StepIndicator = () => {
    const steps: Step[] = ['customer', 'vehicle', 'details', 'pdf'];
    const labels: Record<Step, string> = {
      customer: 'Customer',
      vehicle: 'Vehicle',
      details: 'Details',
      pdf: 'PDF',
    };
    return (
      <div className="d-flex gap-2 mb-3">
        {steps.map(s => (
          <div
            key={s}
            className="d-flex flex-column align-items-center"
            style={{ flex: 1 }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 32,
                height: 32,
                background: s === step ? colors.gold : colors.gray[300],
              }}
            >
              {steps.indexOf(s) + 1}
            </div>
            <small>{labels[s]}</small>
          </div>
        ))}
      </div>
    );
  };

  const CustomerStep = () => (
    <div>
      <label className="form-label fw-bold">Choose Customer</label>
      <select
        className="form-select mb-3"
        value={form.customer_id}
        onChange={e => setForm({ ...form, customer_id: e.target.value })}
      >
        <option value="">— Select —</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <BrandButton
        disabled={!form.customer_id}
        onClick={() => setStep('vehicle')}
      >
        Next
      </BrandButton>
    </div>
  );

  const VehicleStep = () => (
    <div>
      <label className="form-label fw-bold">Choose Vehicle</label>
      <select
        className="form-select mb-3"
        value={form.vehicle_id}
        onChange={e => setForm({ ...form, vehicle_id: e.target.value })}
      >
        <option value="">— Select —</option>
        {vehicles.map(v => (
          <option key={v.id} value={v.id}>
            {v.plate_no}
          </option>
        ))}
      </select>
      <BrandButton variant="secondary" onClick={() => setStep('customer')}>
        Back
      </BrandButton>{' '}
      <BrandButton
        disabled={!form.vehicle_id}
        onClick={() => setStep('details')}
      >
        Next
      </BrandButton>
    </div>
  );

  const DetailsStep = () => (
    <div>
      <div className="mb-2">
        <label className="form-label">Policy Type</label>
        <input
          className="form-control"
          value={form.policy_type}
          onChange={e => setForm({ ...form, policy_type: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Product Name</label>
        <input
          className="form-control"
          value={form.product_name}
          onChange={e => setForm({ ...form, product_name: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          className="form-control"
          value={form.start_date}
          onChange={e => setForm({ ...form, start_date: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">End Date</label>
        <input
          type="date"
          className="form-control"
          value={form.end_date}
          onChange={e => setForm({ ...form, end_date: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Premium Amount</label>
        <input
          type="number"
          className="form-control"
          value={form.premium_amount}
          onChange={e =>
            setForm({ ...form, premium_amount: Number(e.target.value) })
          }
        />
      </div>
      <div className="mb-2">
        <label className="form-label">Coverage Amount</label>
        <input
          type="number"
          className="form-control"
          value={form.coverage_amount}
          onChange={e =>
            setForm({ ...form, coverage_amount: Number(e.target.value) })
          }
        />
      </div>
      <BrandButton variant="secondary" onClick={() => setStep('vehicle')}>
        Back
      </BrandButton>{' '}
      <BrandButton disabled={!isDetailsValid()} onClick={() => setStep('pdf')}>
        Next
      </BrandButton>
    </div>
  );

  const PdfStep = () => (
    <div>
      <div className="mb-3">
        <label className="form-label fw-bold">Upload Policy PDF</label>
        <input
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={e => setPdfFile(e.target.files?.[0] || null)}
        />
      </div>
      <BrandButton variant="secondary" onClick={() => setStep('details')}>
        Back
      </BrandButton>{' '}
      <BrandButton onClick={finish} disabled={uploading || pdfFile == null}>
        {uploading ? 'Uploading…' : 'Finish'}
      </BrandButton>
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <StepIndicator />
      {step === 'customer' && <CustomerStep />}
      {step === 'vehicle' && <VehicleStep />}
      {step === 'details' && <DetailsStep />}
      {step === 'pdf' && <PdfStep />}
    </div>
  );
}
