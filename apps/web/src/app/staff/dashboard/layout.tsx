import { StaffShell } from '@/components/shells/LayoutShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>;
}
