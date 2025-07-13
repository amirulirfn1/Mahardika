import React from 'react';
import { CustomerShell } from '@/components/shells/LayoutShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
