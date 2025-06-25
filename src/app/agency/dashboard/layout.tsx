import { AgencyShell } from '@/components/shells/LayoutShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AgencyShell>{children}</AgencyShell>;
}
