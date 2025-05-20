import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, isStaff, userRole } = useAuth();
  
  // State for nested menu items
  const [openSubMenu, setOpenSubMenu] = useState({
    patients: false,
    appointments: false,
    billing: false,
    reports: false,
    settings: false
  });
  
  // Toggle submenu
  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  // Enhanced check if a route is active - includes partial matches for better UX
  const isRouteActive = (route) => {
    // Exact match
    if (location.pathname === route) return true;
    
    // Parent route match (e.g., /dashboard/patients/new should activate the /dashboard/patients route)
    if (route !== '/dashboard' && location.pathname.startsWith(`${route}/`)) return true;
    
    // Dashboard home should only be active on exact match
    if (route === '/dashboard' && location.pathname !== '/dashboard') return false;
    
    return false;
  };

  // Set active menu based on current route - automatically expands relevant submenus
  useEffect(() => {
    // Extract the main section from the path (e.g. /dashboard/patients/new -> patients)
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length > 2) {
      const mainSection = pathSegments[2];
      // Open the submenu for the active section
      if (mainSection && openSubMenu.hasOwnProperty(mainSection)) {
        // Close all menus first, then open only the active one
        const newOpenState = Object.keys(openSubMenu).reduce((acc, key) => {
          acc[key] = key === mainSection;
          return acc;
        }, {});
        
        setOpenSubMenu(newOpenState);
      }
    }
  }, [location.pathname]);

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {/* Dashboard Logo for Mobile */}
        <div className="sidebar-logo d-md-none text-center mb-3">
          <Link to="/dashboard">
            <img src="/assets/dashboard/img/logo.png" alt="Mahardika" className="img-fluid" style={{ maxHeight: '60px' }} />
          </Link>
        </div>
        
        {/* Dashboard */}
        <li className="nav-item">
          <Link 
            className={`nav-link ${!isRouteActive('/dashboard') ? 'collapsed' : ''}`}
            to="/dashboard"
          >
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Patients */}
        <li className="nav-item">
          <a 
            className={`nav-link ${!isRouteActive('/dashboard/patients') ? 'collapsed' : ''}`} 
            onClick={() => handleSubMenuToggle('patients')}
            data-bs-target="#patients-nav" 
            data-bs-toggle="collapse" 
            href="#"
          >
            <i className="bi bi-people"></i>
            <span>Patients</span>
            <i className={`bi bi-chevron-${openSubMenu.patients ? 'up' : 'down'} ms-auto`}></i>
          </a>
          <ul 
            id="patients-nav" 
            className={`nav-content collapse ${openSubMenu.patients ? 'show' : ''}`} 
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/dashboard/patients" className={isRouteActive('/dashboard/patients') && location.pathname === '/dashboard/patients' ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>All Patients</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/patients/new" className={isRouteActive('/dashboard/patients/new') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Add Patient</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/patients/groups" className={isRouteActive('/dashboard/patients/groups') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Patient Groups</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Appointments */}
        <li className="nav-item">
          <a 
            className={`nav-link ${!isRouteActive('/dashboard/appointments') ? 'collapsed' : ''}`} 
            onClick={() => handleSubMenuToggle('appointments')}
            data-bs-target="#appointments-nav" 
            data-bs-toggle="collapse" 
            href="#"
          >
            <i className="bi bi-calendar-check"></i>
            <span>Appointments</span>
            <i className={`bi bi-chevron-${openSubMenu.appointments ? 'up' : 'down'} ms-auto`}></i>
          </a>
          <ul 
            id="appointments-nav" 
            className={`nav-content collapse ${openSubMenu.appointments ? 'show' : ''}`} 
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/dashboard/appointments" className={isRouteActive('/dashboard/appointments') && location.pathname === '/dashboard/appointments' ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Appointment List</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/appointments/calendar" className={isRouteActive('/dashboard/appointments/calendar') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Calendar</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/appointments/new" className={isRouteActive('/dashboard/appointments/new') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Create Appointment</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Medical Records */}
        <li className="nav-item">
          <Link 
            className={`nav-link ${!isRouteActive('/dashboard/medical-records') ? 'collapsed' : ''}`}
            to="/dashboard/medical-records"
          >
            <i className="bi bi-file-medical"></i>
            <span>Medical Records</span>
          </Link>
        </li>

        {/* Billing Management */}
        <li className="nav-item">
          <a 
            className={`nav-link ${!isRouteActive('/dashboard/billing') ? 'collapsed' : ''}`} 
            onClick={() => handleSubMenuToggle('billing')}
            data-bs-target="#billing-nav" 
            data-bs-toggle="collapse" 
            href="#"
          >
            <i className="bi bi-cash-coin"></i>
            <span>Billing</span>
            <i className={`bi bi-chevron-${openSubMenu.billing ? 'up' : 'down'} ms-auto`}></i>
          </a>
          <ul 
            id="billing-nav" 
            className={`nav-content collapse ${openSubMenu.billing ? 'show' : ''}`} 
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/dashboard/billing/invoices" className={isRouteActive('/dashboard/billing/invoices') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Invoices</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/billing/payments" className={isRouteActive('/dashboard/billing/payments') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Payments</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/billing/insurance" className={isRouteActive('/dashboard/billing/insurance') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Insurance</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Reports and Analytics */}
        <li className="nav-item">
          <a 
            className={`nav-link ${!isRouteActive('/dashboard/reports') ? 'collapsed' : ''}`} 
            onClick={() => handleSubMenuToggle('reports')}
            data-bs-target="#reports-nav" 
            data-bs-toggle="collapse" 
            href="#"
          >
            <i className="bi bi-bar-chart"></i>
            <span>Reports</span>
            <i className={`bi bi-chevron-${openSubMenu.reports ? 'up' : 'down'} ms-auto`}></i>
          </a>
          <ul 
            id="reports-nav" 
            className={`nav-content collapse ${openSubMenu.reports ? 'show' : ''}`} 
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/dashboard/reports/patient-stats" className={isRouteActive('/dashboard/reports/patient-stats') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Patient Statistics</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reports/financial" className={isRouteActive('/dashboard/reports/financial') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Financial Reports</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reports/operational" className={isRouteActive('/dashboard/reports/operational') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Operational Data</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Staff Management (Admin only) */}
        {(isAdmin || userRole === 'admin') && (
          <li className="nav-item">
            <Link 
              className={`nav-link ${!isRouteActive('/dashboard/staff') ? 'collapsed' : ''}`}
              to="/dashboard/staff"
            >
              <i className="bi bi-person-badge"></i>
              <span>Staff Management</span>
            </Link>
          </li>
        )}

        {/* Inventory Management (Admin and Staff) */}
        {(isAdmin || isStaff || userRole === 'admin' || userRole === 'staff') && (
          <li className="nav-item">
            <Link 
              className={`nav-link ${!isRouteActive('/dashboard/inventory') ? 'collapsed' : ''}`}
              to="/dashboard/inventory"
            >
              <i className="bi bi-box"></i>
              <span>Inventory</span>
            </Link>
          </li>
        )}

        {/* Divider */}
        <li className="nav-heading">User</li>

        {/* Profile */}
        <li className="nav-item">
          <Link 
            className={`nav-link ${!isRouteActive('/dashboard/profile') ? 'collapsed' : ''}`}
            to="/dashboard/profile"
          >
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </Link>
        </li>

        {/* Settings */}
        <li className="nav-item">
          <a 
            className={`nav-link ${!isRouteActive('/dashboard/settings') ? 'collapsed' : ''}`} 
            onClick={() => handleSubMenuToggle('settings')}
            data-bs-target="#settings-nav" 
            data-bs-toggle="collapse" 
            href="#"
          >
            <i className="bi bi-gear"></i>
            <span>Settings</span>
            <i className={`bi bi-chevron-${openSubMenu.settings ? 'up' : 'down'} ms-auto`}></i>
          </a>
          <ul 
            id="settings-nav" 
            className={`nav-content collapse ${openSubMenu.settings ? 'show' : ''}`} 
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="/dashboard/settings" className={isRouteActive('/dashboard/settings') && location.pathname === '/dashboard/settings' ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>General</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings/security" className={isRouteActive('/dashboard/settings/security') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Security</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings/notifications" className={isRouteActive('/dashboard/settings/notifications') ? 'active' : ''}>
                <i className="bi bi-circle"></i><span>Notifications</span>
              </Link>
            </li>
          </ul>
        </li>

        {/* Help */}
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/help">
            <i className="bi bi-question-circle"></i>
            <span>Help & Support</span>
          </Link>
        </li>

        {/* Portal */}
        <li className="nav-item">
          <Link className="nav-link collapsed" to="/portal">
            <i className="bi bi-house-door"></i>
            <span>Main Website</span>
          </Link>
        </li>

        {/* Version Information */}
        <li className="sidebar-footer">
          <div className="small text-muted d-flex justify-content-between" style={{ padding: '10px 15px' }}>
            <div>Version 1.0.0</div>
            <div>{new Date().getFullYear()} Mahardika</div>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
