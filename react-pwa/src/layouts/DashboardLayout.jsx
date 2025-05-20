import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import DashboardSidebar from '../ui/dashboard/components/DashboardSidebar';
import DashboardHeader from '../ui/dashboard/components/DashboardHeader';

// Import CSS files - these help ensure core styles are available even if assets are missing
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css';
import 'remixicon/fonts/remixicon.css';

// Only import these if they're actually available in node_modules
try {
  require('quill/dist/quill.snow.css');
  require('quill/dist/quill.bubble.css');
  require('simple-datatables/dist/style.css');
} catch (e) {
  console.warn('Some style dependencies could not be loaded:', e.message);
}

// Loading component with enhanced styling
const LoadingOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }}>
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div style={{ marginTop: '1rem', fontWeight: 500 }}>Loading dashboard resources...</div>
    </div>
  </div>
);

// Error component with more helpful guidance
const ErrorMessage = ({ error }) => (
  <div className="alert alert-danger" role="alert" style={{ maxWidth: '800px', margin: '2rem auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <h4 className="alert-heading">Dashboard Resources Error</h4>
    <p><strong>Error details:</strong> {error?.message || 'Missing dashboard assets or templates'}</p>
    <hr />
    <p>This error might occur if the NiceAdmin template files are missing. Please ensure:</p>
    <ol>
      <li>You've copied the NiceAdmin template files to <code>/public/assets/dashboard/</code> directory</li>
      <li>All JS files are in <code>/public/assets/dashboard/js/</code></li>
      <li>All CSS files are in <code>/public/assets/dashboard/css/</code></li>
      <li>All vendor files are in <code>/public/assets/dashboard/vendor/</code></li>
    </ol>
    <button 
      onClick={() => window.location.reload()} 
      className="btn btn-primary"
      style={{ marginTop: '1rem' }}
    >
      Refresh Page
    </button>
  </div>
);

const DashboardLayout = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  // Check if necessary assets are loaded
  useEffect(() => {
    // Add class to body for dashboard-specific styles
    document.body.classList.add('dashboard-theme');
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    
    // Set timeout to avoid infinite loading state
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 3000);
    
    // Load NiceAdmin theme scripts to enhance dashboard functionality
    const loadDashboardEnhancements = async () => {
      try {
        // First check if the main CSS file exists before attempting to load scripts
        const cssResponse = await fetch(`${process.env.PUBLIC_URL}/assets/dashboard/css/style.css`);
        if (!cssResponse.ok) {
          throw new Error(`Failed to load dashboard CSS: ${cssResponse.status}`);
        }
        
        // Load essential dashboard scripts
        const scriptsToLoad = [
          '/assets/dashboard/js/main.js',
          '/assets/dashboard/vendor/simple-datatables/simple-datatables.js',
          '/assets/dashboard/vendor/chart.js/chart.umd.js'
        ];
        
        // Load scripts in sequence
        for (const scriptPath of scriptsToLoad) {
          try {
            const response = await fetch(`${process.env.PUBLIC_URL}${scriptPath}`);
            if (!response.ok) {
              console.warn(`Script ${scriptPath} not available, skipping`);
              continue;
            }
            
            // If script exists, load it properly
            const script = document.createElement('script');
            script.src = `${process.env.PUBLIC_URL}${scriptPath}`;
            script.async = true;
            script.defer = true;
            
            // Wait for script to load
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = reject;
              document.body.appendChild(script);
            });
            
            console.log(`Successfully loaded ${scriptPath}`);
          } catch (err) {
            console.warn(`Failed to load script ${scriptPath}:`, err);
            // Continue with other scripts if one fails
          }
        }
        
        // All scripts loaded or attempted
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard assets:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    loadDashboardEnhancements();
    
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('dashboard-theme');
    };
  }, []);

  // Show loading state while dashboard resources are loading
  if (loading) {
    return <LoadingOverlay />;
  }
  
  // Show error state if there's an error
  if (error) {
    return <ErrorMessage error={error} />;
  }

  // Check if user is authenticated
  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          You need to be logged in to access the dashboard. <Link to="/login">Login here</Link>
        </div>
      </div>
    );
  }

  // Main dashboard layout
  return (
    <div className="dashboard-layout" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
      <DashboardHeader />
      <DashboardSidebar />
      <main id="main" className="main" style={{ width: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
