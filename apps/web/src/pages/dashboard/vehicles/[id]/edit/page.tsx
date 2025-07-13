import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BrandButton, colors } from '@mahardika/ui';
import { z } from 'zod';

const vehicleSchema = z.object({
  id: z.string().uuid(),
  plate_no: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  year: z.number().nullable(),
  color: z.string().nullable(),
  customer_id: z.string().uuid(),
  agency_id: z.string().uuid(),
});

type Vehicle = z.infer<typeof vehicleSchema>;

export default function EditVehiclePage() {
  const router = useRouter();
  const vehicleId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchVehicle = async () => {
    const res = await fetch(`/api/vehicles?id=${vehicleId}`);
    const data = await res.json();
    setVehicle(vehicleSchema.parse(data));
  };

  useEffect(() => {
    if (vehicleId) fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  const saveChanges = async () => {
    if (!vehicle) return;
    setSaving(true);
    await fetch(`/api/vehicles?id=${vehicle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    setSaving(false);
    router.back();
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h2 style={{ color: colors.navy }}>Edit Vehicle</h2>

      <div className="mb-3">
        <label className="form-label">Plate No</label>
        <input
          className="form-control"
          value={vehicle.plate_no}
          onChange={e => setVehicle({ ...vehicle, plate_no: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Brand</label>
        <input
          className="form-control"
          value={vehicle.brand ?? ''}
          onChange={e => setVehicle({ ...vehicle, brand: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Model</label>
        <input
          className="form-control"
          value={vehicle.model ?? ''}
          onChange={e => setVehicle({ ...vehicle, model: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Year</label>
        <input
          className="form-control"
          type="number"
          value={vehicle.year ?? ''}
          onChange={e =>
            setVehicle({ ...vehicle, year: Number(e.target.value) })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Color</label>
        <input
          className="form-control"
          value={vehicle.color ?? ''}
          onChange={e => setVehicle({ ...vehicle, color: e.target.value })}
        />
      </div>

      <BrandButton onClick={saveChanges} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </BrandButton>
    </div>
  );
}
