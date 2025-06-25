import React from 'react';

export function LayoutShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'admin' | 'agency' | 'staff' | 'customer';
}) {
  // You can add side-nav/top-bar logic based on variant here
  return (
    <div className={`layout-shell layout-shell-${variant}`}>{children}</div>
  );
}

export const AdminShell = (p: { children: React.ReactNode }) => (
  <LayoutShell variant="admin" {...p} />
);
export const AgencyShell = (p: { children: React.ReactNode }) => (
  <LayoutShell variant="agency" {...p} />
);
export const StaffShell = (p: { children: React.ReactNode }) => (
  <LayoutShell variant="staff" {...p} />
);
export const CustomerShell = (p: { children: React.ReactNode }) => (
  <LayoutShell variant="customer" {...p} />
);
