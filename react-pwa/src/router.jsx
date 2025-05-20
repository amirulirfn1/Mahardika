import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './lib/auth-context';
import DashboardLayout from './layouts/DashboardLayout';
import { PortalLayout } from './layouts/PortalLayout';
import ErrorBoundary from './components/ErrorBoundary'; // Add this import

// Protected Route component for role-based access
function ProtectedRoute({ roles, redirectTo = '/unauthorized', children }) {
  const { currentUser, loading, userRole, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('[DEBUG] ProtectedRoute - Auth State:', {
      currentUser: currentUser ? 'Authenticated' : 'Not authenticated',
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
        fontSize: '24px',
        backgroundColor: '#f8f9fa',
        color: '#2c3e50'
      }}>
        <div>Checking authentication status...</div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!currentUser) {
    console.log('[DEBUG] ProtectedRoute - No user, redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If no roles required, just render the children
  if (!roles || roles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = roles.some(role => {
    switch (role) {
      case 'admin':
        return isAdmin || userRole === 'admin';
      case 'staff':
        return isStaff || userRole === 'staff';
      default:
        return userRole === role;
    }
  });

  if (!hasRequiredRole) {
    console.warn(`[DEBUG] Access denied - User role '${userRole}' does not have required roles:`, roles);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Access granted');
  // Render the children or outlet based on how it's used
  return children || <Outlet />;
}

// Public route component (for sign-in, etc.)
function PublicRoute({ restricted = false }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // If user is signed in and tries to access a restricted route (like sign-in)
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
  signin: 'ui/shared/pages/SignInPage',
  unauthorized: 'ui/shared/pages/UnauthorizedPage',
  notFound: 'ui/shared/pages/NotFoundPage',
  dashboardHome: 'ui/dashboard/pages/DashboardHome',
  portalHome: 'ui/portal/pages/PortalHome',
  dashboard: 'ui/portal/pages/Dashboard',
};

// List of all sign-in related paths that should redirect to /signin
const signInPaths = [
  '/signin',
  '/sign-in',
  '/auth/signin',
  '/account/signin'
];

// Lazy load pages for better performance with error boundaries
const withErrorBoundary = (Component) => (props) => (
  <ErrorBoundary>
    <Component {...props} />
  </ErrorBoundary>
);

// Helper function to create lazy-loaded components with error boundaries
const createLazyComponent = (path, fallbackPath = '') => {
  try {
    return withErrorBoundary(lazyLoad(path));
  } catch (error) {
    console.warn(`Failed to load ${path}:`, error);
    if (fallbackPath) {
      return withErrorBoundary(lazyLoad(fallbackPath));
    }
    throw error;
  }
};

// Create components
const SignInPage = createLazyComponent(paths.signin);
const UnauthorizedPage = createLazyComponent(paths.unauthorized);
const NotFoundPage = createLazyComponent(paths.notFound);

// Create dashboard components
const DashboardHome = createLazyComponent(paths.dashboardHome, 'ui/dashboard/pages/DashboardHome');

// Create portal components
const PortalHome = createLazyComponent(paths.portalHome, 'ui/portal/pages/PortalHome');

// Create dashboard routes
export const dashboardRoutes = [
  { path: '', element: <DashboardHome /> },
  // Add more dashboard routes here
];

// Create portal routes
export const portalRoutes = [
  { path: '', element: <PortalHome /> },
  // Add more portal routes here
];

// Auth redirect component
function AuthRedirect() {
  const { currentUser, loading, userRole, isAdmin, isStaff } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  // Debug logging
  console.log('[DEBUG] AuthRedirect - Auth state:', {
    hasUser: !!currentUser,
    loading,
    userRole,
    isAdmin,
    isStaff,
    email: currentUser?.email,
    pathname: location.pathname,
    from: from?.pathname
  });

  // Show loading state while auth is being checked
  if (loading) {
    console.log('[DEBUG] AuthRedirect - Auth state loading...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        backgroundColor: '#f8f9fa',
        color: '#2c3e50'
      }}>
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  // If no user is signed in, redirect to sign-in
  if (!currentUser) {
    console.log('[DEBUG] AuthRedirect - No user, redirecting to sign-in');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If we're at root, determine where to redirect based on role
  if (location.pathname === '/') {
    const redirectPath = (isAdmin || isStaff) ? '/dashboard' : '/portal';
    console.log('[DEBUG] AuthRedirect - Root path detected, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }
  
  // If we have a 'from' location, go there (for example after login)
  if (from && from.pathname !== '/signin' && from.pathname !== '/') {
    console.log('[DEBUG] AuthRedirect - Redirecting to previous location:', from.pathname);
    return <Navigate to={from.pathname} replace />;
  }
  
  // Default behavior for other cases - stay where you are
  console.log('[DEBUG] AuthRedirect - No redirection needed');
  return null;
}

// Create route elements with proper error boundaries
const DashboardLayoutWithAuth = () => (
  <ProtectedRoute roles={['admin', 'staff']}>
    <DashboardLayout />
  </ProtectedRoute>
);

const PortalLayoutWithAuth = () => (
  <ProtectedRoute>
    <PortalLayout />
  </ProtectedRoute>
);

export function AppRouter() {
  console.log('[DEBUG] AppRouter - Rendering router');
  
  return (
    <React.Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        backgroundColor: '#f8f9fa',
        color: '#2c3e50'
      }}>
        <div>Loading application...</div>
      </div>
    }>
      <Routes>
        {/* Public Routes - Only accessible when not logged in */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/signin" element={<SignInPage />} />
          
          {/* Redirect any other sign-in related paths to /signin */}
          {signInPaths.filter(p => p !== '/signin').map(path => (
            <Route key={path} path={path} element={<Navigate to="/signin" replace />} />
          ))}
        </Route>
        
        {/* Root path handling */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* Special pages - no auth required */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        
        {/* Dashboard Routes - Only accessible to admin/staff */}
        <Route path="/dashboard" element={<DashboardLayoutWithAuth />}>
          {dashboardRoutes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Route>
        
        {/* Portal Routes - Accessible to all authenticated users */}
        <Route path="/portal" element={<PortalLayoutWithAuth />}>
          {portalRoutes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </React.Suspense>
  );
}
