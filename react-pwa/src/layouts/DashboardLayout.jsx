import React from 'react';
import { Outlet } from 'react-router-dom';
import { RequireAuth } from '../lib/RequireAuth';

// Import your dashboard components here
// import { Sidebar } from '../ui/dashboard/components/Sidebar';
// import { Navbar } from '../ui/dashboard/components/Navbar';
// import { Footer } from '../ui/dashboard/components/Footer';

export function DashboardLayout() {
  return (
    <RequireAuth allowedRoles={['admin', 'staff']}>
      <div className="d-flex">
        {/* Sidebar */}
        {/* <Sidebar /> */}
        
        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          {/* Navbar */}
          {/* <Navbar /> */}
          
          {/* Main Content */}
          <main className="flex-grow-1 p-4">
            <Outlet />
          </main>
          
          {/* Footer */}
          {/* <Footer /> */}
        </div>
      </div>
    </RequireAuth>
  );
}
