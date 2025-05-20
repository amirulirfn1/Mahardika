import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '../ui/portal/components/Header';
import { Footer } from '../ui/portal/components/Footer';
import Topbar from '../ui/portal/components/Topbar';

export function PortalLayout() {
  // Add useEffect to ensure all Medilab styles are properly applied
  useEffect(() => {
    // Make sure the body has the proper classes for the portal theme
    document.body.classList.add('portal-theme');
    
    // Ensure body has no margin or padding
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('portal-theme');
    };
  }, []);

  return (
    <Box 
      className="portal-layout" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Topbar with contact info and social links */}
      <Topbar />
      
      {/* Main Header with navigation */}
      <Header />
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
