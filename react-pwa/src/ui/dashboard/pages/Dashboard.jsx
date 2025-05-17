import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';
import DashboardHome from './DashboardHome';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/dashboard" color="inherit">
            Dashboard
          </Link>
          <Typography color="text.primary">Overview</Typography>
        </Breadcrumbs>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {currentUser?.displayName || 'Admin'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with Mahardika Healthcare today.
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Dashboard main content */}
      <DashboardHome />
    </Box>
  );
};

export default Dashboard;
