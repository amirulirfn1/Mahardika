import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoadingScreen = ({ message = "Loading..." }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 3,
          borderRadius: 2,
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          Welcome to Mahardika
        </Typography>
        
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          {message}
          <br />
          <Typography variant="caption" component="small">This may take a few moments</Typography>
        </Typography>
        
        <Box
          sx={{
            position: 'relative',
            height: '6px',
            bgcolor: theme.palette.grey[200],
            borderRadius: '3px',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              bgcolor: theme.palette.primary.main,
              borderRadius: '3px',
              animation: 'loading 1.5s ease-in-out infinite',
              '@keyframes loading': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
