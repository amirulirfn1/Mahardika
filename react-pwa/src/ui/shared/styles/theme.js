import { createTheme } from '@mui/material/styles';

// Create a consistent theme configuration to be used across the entire application
const theme = createTheme({
  palette: {
    primary: {
      main: '#1977cc',
      light: '#3291e6',
      dark: '#166ab9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2c4964',
      light: '#3e5f84',
      dark: '#1e3346',
      contrastText: '#fff',
    },
    success: {
      main: '#28a745',
      light: '#48c467',
      dark: '#1e7e34',
    },
    warning: {
      main: '#ffc107',
      light: '#ffcd39',
      dark: '#d39e00',
    },
    error: {
      main: '#dc3545',
      light: '#e25663',
      dark: '#bd2130',
    },
    info: {
      main: '#17a2b8',
      light: '#1fc8e3',
      dark: '#117a8b',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c4964',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Open Sans", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          padding: '8px 25px',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: '0 2px 15px rgba(25, 119, 204, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        },
      },
    },
  },
});

export default theme;
