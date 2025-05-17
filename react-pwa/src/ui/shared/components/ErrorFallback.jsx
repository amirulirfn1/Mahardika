import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Something went wrong
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          We apologize for the inconvenience. An error has occurred in the application.
        </Typography>
        
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: theme.palette.grey[100], 
            borderRadius: 1,
            mb: 3,
            overflowX: 'auto'
          }}
        >
          <Typography variant="body2" component="code" sx={{ whiteSpace: 'pre-wrap' }}>
            {error?.message || 'Unknown error occurred'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          
          <Button 
            variant="outlined"
            component={Link}
            to="/"
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
