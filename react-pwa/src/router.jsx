import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './lib/auth-context';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PortalLayout } from './layouts/PortalLayout';

// Protected Route component for role-based access
function ProtectedRoute({ roles, redirectTo = '/unauthorized' }) {
  const { currentUser, loading, userRole, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('[DEBUG] ProtectedRoute - Auth State:', {
      currentUser: !!currentUser,
      loading,
      userRole,
      isAdmin,
      isStaff,
      requiredRoles: roles,
      path: window.location.pathname
    });
  }, [currentUser, loading, userRole, isAdmin, isStaff, roles]);

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
        <div>Verifying authentication...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = !roles || roles.some(role => {
    if (role === 'admin') return isAdmin;
    if (role === 'staff') return isStaff;
    return userRole === role;
  });

  if (!hasRequiredRole) {
    console.warn(`Access denied. Required roles: ${roles}, User role: ${userRole}`);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Access granted');
  // Render the child routes if authorized
  return <Outlet />;
}

// Public route component (for login, etc.)
function PublicRoute({ restricted = false }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // If user is logged in and tries to access a restricted route (like login)
  if (currentUser && restricted) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

// Simplified lazy load function for default exports
const lazyLoad = (path) => {
  return React.lazy(() => import(`./${path}`));
};

// Paths relative to src directory
const paths = {
  login: 'ui/shared/pages/LoginPage',
  unauthorized: 'ui/shared/pages/UnauthorizedPage',
  notFound: 'ui/shared/pages/NotFoundPage',
  dashboardHome: 'ui/dashboard/pages/DashboardHome',
  portalHome: 'ui/portal/pages/PortalHome',
  dashboard: 'ui/portal/pages/Dashboard', // Points to the index.js in Dashboard folder
};

// Lazy load pages for better performance
const LoginPage = lazyLoad(paths.login);
const UnauthorizedPage = lazyLoad(paths.unauthorized);
const NotFoundPage = lazyLoad(paths.notFound);

// Dashboard pages
const DashboardHome = lazyLoad(paths.dashboardHome);
const Dashboard = lazyLoad(paths.dashboard);
// Import other dashboard pages as needed

// Portal pages
const PortalHome = lazyLoad(paths.portalHome);
// Import other portal pages as needed

// Auth redirect component
function AuthRedirect() {
  const { currentUser, loading, userRole, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  // Debug logging
  console.log('AuthRedirect - User:', {
    currentUser: !!currentUser,
    loading,
    userRole,
    isAdmin,
    isStaff,
    email: currentUser?.email,
    pathname: location.pathname
  });

  // Show loading state while auth is being checked
  if (loading) {
    console.log('AuthRedirect - Auth state loading...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#4a5568'
      }}>
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!currentUser) {
    console.log('AuthRedirect - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Get the redirect path from location state or default to dashboard/portal
  let redirectPath = location.state?.from?.pathname || '/';
  
  // If coming from root path, determine where to redirect based on role
  if (redirectPath === '/') {
    redirectPath = isAdmin || isStaff ? '/dashboard' : '/portal';
  }
  
  console.log('AuthRedirect - Redirecting to:', redirectPath);
  return <Navigate to={redirectPath} replace />;
}

export function AppRouter() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes - Only accessible when not logged in */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Root route - Redirect based on authentication and role */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AuthRedirect />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin/Staff Routes - Only accessible to admin and staff */}
        <Route element={<ProtectedRoute roles={['admin', 'staff']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<DashboardHome />} />
            {/* Add more dashboard routes here */}
          </Route>
        </Route>
        
        {/* Portal Routes - Accessible to all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalHome />} />
            {/* Add more portal routes here */}
          </Route>
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
}
