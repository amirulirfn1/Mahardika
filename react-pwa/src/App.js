import React, { useEffect } from 'react';
import { useAuth } from './lib/auth-context';
import { AppRouter } from './router';

function App() {
  const { currentUser, loading, userRole } = useAuth();
  
  useEffect(() => {
    console.log('[DEBUG] App - Auth state changed:', { 
      currentUser: currentUser ? 'Logged in' : 'Not logged in',
      loading,
      userRole
    });
  }, [currentUser, loading, userRole]);

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        <div>Loading application...</div>
      </div>
    );
  }


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppRouter />
    </div>
  );
}

export default App;
