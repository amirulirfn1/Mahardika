import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '../ui/portal/components/Header';
import { Footer } from '../ui/portal/components/Footer';
import Topbar from '../ui/portal/components/Topbar';

export function PortalLayout() {
  return (
    <Box className="portal-layout" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar with contact info and social links */}
      <Topbar />
      
      {/* Main Header with navigation */}
      <Header />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
