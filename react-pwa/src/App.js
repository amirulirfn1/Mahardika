import React, { useEffect, useState } from 'react';
import { useAuth } from './lib/auth-context';
import { AppRouter } from './router';
import { ThemeProvider } from './ui/shared/providers/ThemeProvider';
import LoadingScreen from './ui/shared/components/LoadingScreen';

console.log('[DEBUG] App - Component mounting');

function App() {
  const { currentUser, loading, userRole } = useAuth();
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);
  
  useEffect(() => {
    console.log('[DEBUG] App - Auth state changed:', { 
      currentUser: currentUser ? 'Logged in' : 'Not logged in',
      loading,
      userRole
    });
  }, [currentUser, loading, userRole]);

  // Set minimum loading time to 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Effect to make the body visible once initial loading is done
  useEffect(() => {
    if (!loading && minLoadingComplete) {
      document.body.classList.add('loaded');
      console.log('[DEBUG] App - Body class "loaded" added.');
    } else {
      // Optional: Ensure it's not loaded if we revert to a loading state, though unlikely here.
      // document.body.classList.remove('loaded'); 
    }
  }, [loading, minLoadingComplete]);

  console.log('[DEBUG] App - Rendering', { loading, minLoadingComplete, currentUser: !!currentUser });
  
  // Show loading state while auth is being checked or minimum loading time not reached
  if (loading || !minLoadingComplete) {
    console.log('[DEBUG] App - Showing loading state');
    return (
      <ThemeProvider>
        <LoadingScreen message="Loading your dashboard, please wait..." />
      </ThemeProvider>
    );
  }


  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
