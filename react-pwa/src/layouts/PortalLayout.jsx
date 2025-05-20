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
    
    // Ensure body has no margin or padding and takes full width
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100vw';
    document.body.style.maxWidth = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.boxSizing = 'border-box';
    
    // Fix container widths in the entire application
    const style = document.createElement('style');
    style.id = 'portal-layout-styles';
    style.innerHTML = `
      .container {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
      }
      
      @media (min-width: 1400px) {
        .container {
          max-width: 1320px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
      
      section {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        overflow-x: hidden !important;
      }
      
      /* Fix hero section to take full width */
      #hero {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      
      /* Remove any overflow that might be causing white space */
      html, body, #root {
        overflow-x: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('portal-theme');
      const styleElement = document.getElementById('portal-layout-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  return (
    <Box 
      className="portal-layout" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        boxSizing: 'border-box'
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
          overflowX: 'hidden',
          '& > *': {
            width: '100%',
            maxWidth: '100%'
          }
        }}
      >
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}
