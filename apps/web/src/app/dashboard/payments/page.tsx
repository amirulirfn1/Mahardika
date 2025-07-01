'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { colors } from '@mahardika/ui';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { z } from 'zod';

const orderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.string(),
  customer_id: z.string().uuid(),
  total_amount: z.number(),
  state: z.string(),
  proof_url: z.string().nullable(),
});

type Order = z.infer<typeof orderSchema>;

export default function PaymentAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    // reuse existing checkout route list or create new: we fetch /api/orders?state=pending
    const res = await fetch('/api/orders?state=pending');
    const data = await res.json();
    setOrders(z.array(orderSchema).parse(data));
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = useMemo<ColumnDef<Order>[]>(() => [
    { accessorKey: 'order_number', header: 'Order #' },
    { accessorKey: 'total_amount', header: 'Amount', cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}` },
    { accessorKey: 'state', header: 'State' },
    { 
      id: 'actions', 
      header: '', 
      cell: ({ row }) => (
        <button 
          className="btn btn-sm" 
          style={{ backgroundColor: colors.navy, color: 'white', border: 'none' }}
          onClick={() => setSelected(row.original)}
        >
          Upload Proof
        </button>
      )
    }
  ], []);

  const table = useReactTable({ data: orders, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: colors.navy }}>Pending Payments</h2>
        <button 
          className="btn" 
          style={{ backgroundColor: colors.navy, color: 'white', border: 'none' }}
          onClick={fetchOrders}
        >
          Refresh
        </button>
      </div>

      {loading ? 'Loading…' : (
        <table className="table table-striped">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(r => (
              <tr key={r.id}>
                {r.getVisibleCells().map(c => (
                  <td key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && <UploadProofModal order={selected} onClose={() => { setSelected(null); fetchOrders(); }} />}
    </div>
  );
}

function UploadProofModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('orderId', order.id);
    const res = await fetch('/api/payments/proof', { method: 'POST', body: fd });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error || 'Upload failed');
    } else {
      onClose();
    }
    setUploading(false);
  };

  return (
    <div className="modal d-block" style={{ background: '#00000066' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: colors.navy, color: 'white' }}>
            <h5 className="modal-title">Upload Payment Proof – {order.order_number}</h5>
            <button 
              className="btn btn-sm" 
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <input type="file" accept="image/*" className="form-control" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="modal-footer">
            <button 
              className="btn" 
              style={{ backgroundColor: '#6c757d', color: 'white', border: 'none' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn" 
              style={{ backgroundColor: colors.navy, color: 'white', border: 'none' }}
              onClick={submit} 
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 