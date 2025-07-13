

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrandButton, colors } from '@mahardika/ui';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

const policySchema = z.object({
  id: z.string().uuid(),
  policy_number: z.string(),
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'EXPIRED']),
  start_date: z.string(),
  end_date: z.string(),
});

type Policy = z.infer<typeof policySchema>;

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [archived, setArchived] = useState(false);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/policies?archived=${archived}`);
    const data = await res.json();
    setPolicies(z.array(policySchema).parse(data));
    setLoading(false);
  }, [archived]);

  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archived, fetchPolicies]);

  const archivePolicy = useCallback(async (id: string) => {
    await fetch(`/api/policies?id=${id}`, { method: 'DELETE' });
    fetchPolicies();
  }, [fetchPolicies]);

  const columns = useMemo<ColumnDef<Policy>[]>(() => [
    { accessorKey: 'policy_number', header: 'Policy #' },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => {
        const v = getValue<string>();
        const statusColors = {
          EXPIRED: 'secondary',
          ACTIVE: 'success',
          DRAFT: 'warning'
        };
        const cls = statusColors[v as keyof typeof statusColors] || 'warning';
        return <span className={`badge bg-${cls}`}>{v}</span>;
      } },
    { accessorKey: 'start_date', header: 'Start' },
    { accessorKey: 'end_date', header: 'End' },
    { id: 'actions', header: '', cell: ({ row }) => (
      <div className="d-flex gap-1">
        <BrandButton as="a" href={`/dashboard/policies/${row.original.id}/edit`} variant="link" size="sm">Edit</BrandButton>
        {row.original.status !== 'EXPIRED' && (
          <BrandButton variant="outline-danger" size="sm" onClick={() => archivePolicy(row.original.id)}>Archive</BrandButton>
        )}
      </div>
    ) }
  ], [archivePolicy]);

  const table = useReactTable({ data: policies, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: colors.navy }}>Policies</h2>
        <div className="d-flex mb-3">
          <BrandButton as="a" href="/dashboard/policies/new" variant="primary" className="me-2">New Policy</BrandButton>
          {archived ? (
            <BrandButton variant="secondary" onClick={() => setArchived(false)}>Back to Active</BrandButton>
          ) : (
            <BrandButton variant="secondary" onClick={() => setArchived(true)}>View Archived</BrandButton>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${!archived ? 'active' : ''}`} onClick={() => setArchived(false)}>Active</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${archived ? 'active' : ''}`} onClick={() => setArchived(true)}>Archived</button>
        </li>
      </ul>

      {loading ? 'Loading…' : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>{hg.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(r => (
                <tr key={r.id}>
                  {r.getVisibleCells().map(c => <td key={c.id}>{flexRender(c.column.columnDef.cell ?? c.column.columnDef.header, c.getContext())}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
