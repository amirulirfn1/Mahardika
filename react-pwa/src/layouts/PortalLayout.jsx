import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { RequireAuth } from '../lib/RequireAuth';
import { Header } from '../ui/portal/components/Header';
import { Footer } from '../ui/portal/components/Footer';

export function PortalLayout() {
  // Add page-specific classes to body
  useEffect(() => {
    document.body.classList.add('index-page');
    
    return () => {
      document.body.classList.remove('index-page');
    };
  }, []);

  return (
    <RequireAuth>
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-grow-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </RequireAuth>
  );
}
