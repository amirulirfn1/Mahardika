

import React, { useState, useEffect, useMemo } from 'react';
import { BrandButton, colors } from '@mahardika/ui';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
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

export default function VehiclesDashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicles${search ? `?plate=${encodeURIComponent(search)}` : ''}`);
      const data = await res.json();
      const parsed = z.array(vehicleSchema).parse(data);
      setVehicles(parsed);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo<ColumnDef<Vehicle, any>[]>(
    () => [
      { accessorKey: 'plate_no', header: 'Plate No' },
      { accessorKey: 'brand', header: 'Brand' },
      { accessorKey: 'model', header: 'Model' },
      { accessorKey: 'year', header: 'Year' },
      { accessorKey: 'color', header: 'Color' },
    ],
    []
  );

  const table = useReactTable({
    data: vehicles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: colors.navy }}>Vehicles</h2>
        <BrandButton onClick={fetchVehicles}>Refresh</BrandButton>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by plate no"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') fetchVehicles();
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ whiteSpace: 'nowrap' }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                  <td>
                    <a href={`/dashboard/vehicles/${row.original.id}/edit`} className="btn btn-sm btn-link">
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
