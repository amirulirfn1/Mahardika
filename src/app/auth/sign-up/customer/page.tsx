'use client';
import React, { useState } from 'react';
import { z } from 'zod';

const CustomerSignUpSchema = z.object({
  email: z.string().email('Valid email required'),
  name: z.string().min(2, 'Name required'),
});

type CustomerSignUpData = z.infer<typeof CustomerSignUpSchema>;

export default function CustomerSignUpPage() {
  const [form, setForm] = useState<CustomerSignUpData>({ email: '', name: '' });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = CustomerSignUpSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);
    // TODO: Advance wizard or call API
    alert('Customer info valid!');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Customer Sign Up – Step 1</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      {error && <div className="text-danger mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary">
        Next
      </button>
    </form>
  );
}
