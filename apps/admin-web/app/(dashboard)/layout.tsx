import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <a
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/payments"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Payments
            </a>
            <a
              href="/policies"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Policies
            </a>
            <a
              href="/vehicles"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Vehicles
            </a>
            <a
              href="/admin/users"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Users
            </a>
          </nav>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
