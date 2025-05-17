import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

export function RequireAuth({ children, allowedRoles = [] }) {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User is logged in but doesn't have the required role
    // Redirect to unauthorized or home page
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
