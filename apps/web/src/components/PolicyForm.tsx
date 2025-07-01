'use client';

import React, { useEffect, useState } from 'react';
import { BrandButton, colors } from '@mahardika/ui';
import { z } from 'zod';

const vehicleSchema = z.object({
  id: z.string().uuid(),
  plate_no: z.string(),
});

type Vehicle = z.infer<typeof vehicleSchema>;

type PolicyFormProps = {
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
};

export default function PolicyForm({ onSubmit, defaultValues = {} }: PolicyFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ...defaultValues,
    vehicle_id: defaultValues.vehicle_id ?? '',
  });

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = (await res.json()) as Vehicle[];
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicleSuccess = (newVehicle: Vehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
    setFormData(prev => ({ ...prev, vehicle_id: newVehicle.id }));
  };

  return (
    <>
      {/* vehicle select */}
      <div className="mb-3">
        <label className="form-label" style={{ fontWeight: 600 }}>Vehicle</label>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            value={formData.vehicle_id}
            onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
          >
            <option value="">— Select Vehicle —</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.plate_no}
              </option>
            ))}
          </select>
          <BrandButton variant="navy-outline" size="sm" onClick={() => setShowModal(true)}>
            + Add vehicle
          </BrandButton>
        </div>
      </div>

      {/* other policy fields can be inserted here */}

      <BrandButton onClick={() => onSubmit(formData)}>Save Policy</BrandButton>

      {showModal && (
        <AddVehicleModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddVehicleSuccess}
        />
      )}
    </>
  );
}

// --------------------------------------------------
// Add Vehicle Modal Component
// --------------------------------------------------

const addVehicleSchema = z.object({
  plate_no: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  color: z.string().optional(),
  customer_id: z.string().uuid(),
  agency_id: z.string().uuid(),
});

type AddVehicleModalProps = {
  onClose: () => void;
  onSuccess: (v: Vehicle) => void;
};

function AddVehicleModal({ onClose, onSuccess }: AddVehicleModalProps) {
  const [data, setData] = useState<z.infer<typeof addVehicleSchema>>({
    plate_no: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    customer_id: '',
    agency_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    try {
      const parsed = addVehicleSchema.parse(data);
      setSaving(true);
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed, year: parsed.year ? Number(parsed.year) : undefined }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Failed');
      }
      const vehicle: Vehicle = await res.json();
      onSuccess(vehicle);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: '#00000080' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: colors.navy, color: 'white' }}>
            <h5 className="modal-title">Add Vehicle</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-2">
              <label className="form-label">Plate No *</label>
              <input className="form-control" value={data.plate_no} onChange={e => setData({ ...data, plate_no: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Brand</label>
              <input className="form-control" value={data.brand} onChange={e => setData({ ...data, brand: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Model</label>
              <input className="form-control" value={data.model} onChange={e => setData({ ...data, model: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Year</label>
              <input className="form-control" type="number" value={data.year} onChange={e => setData({ ...data, year: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Color</label>
              <input className="form-control" value={data.color} onChange={e => setData({ ...data, color: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Customer ID *</label>
              <input className="form-control" value={data.customer_id} onChange={e => setData({ ...data, customer_id: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Agency ID *</label>
              <input className="form-control" value={data.agency_id} onChange={e => setData({ ...data, agency_id: e.target.value })} />
            </div>
          </div>
          <div className="modal-footer">
            <BrandButton variant="secondary" onClick={onClose}>Cancel</BrandButton>
            <BrandButton onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</BrandButton>
          </div>
        </div>
      </div>
    </div>
  );
} 