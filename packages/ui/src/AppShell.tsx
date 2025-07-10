import { ReactNode } from "react";

export interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
    <header className="backdrop-blur sticky top-0 z-50 border-b border-gray-200 bg-white/95">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <span className="font-display text-xl font-semibold text-navy-600">
          Mahardika
        </span>
        {/* TODO: Add navigation menu here */}
      </div>
    </header>

    <main className="flex-1">{children}</main>

    <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} Mahardika. All rights reserved.
    </footer>
  </div>
); 