import { AdminShell } from '@/components/shells/LayoutShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
