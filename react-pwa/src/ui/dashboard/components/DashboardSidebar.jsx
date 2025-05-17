import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';

const DashboardSidebar = ({ toggleSidebar, isSidebarToggled }) => {
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();
  
  // State for nested menu items
  const [openSubMenu, setOpenSubMenu] = useState({
    patients: false,
    appointments: false,
    settings: false
  });
  
  // Toggle submenu
  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  // Check if a route is active
  const isRouteActive = (route) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  };

  // Set active menu based on current route
  useEffect(() => {
    // Extract the main section from the path (e.g. /dashboard/patients/new -> patients)
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length > 2) {
      const mainSection = pathSegments[2];
      // Open the submenu for the active section
      if (mainSection && openSubMenu.hasOwnProperty(mainSection)) {
        setOpenSubMenu(prev => ({
          ...prev,
          [mainSection]: true
        }));
      }
    }
  }, [location.pathname]);

  return (
    <aside id="sidebar" className={`sidebar ${isSidebarToggled ? 'toggle-sidebar' : ''}`}>
      <ul className="sidebar-nav" id="sidebar-nav">
        
        {/* Dashboard */}
        <li className="nav-item">
          <Link 
            className={`nav-link ${!isRouteActive('/dashboard') || location.pathname !== '/dashboard' ? 'collapsed' : ''}`}
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

        {/* Staff Management (Admin only) */}
        {isAdmin && (
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

        {/* Divider */}
        <li className="nav-heading">Pages</li>

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

        {/* Portal */}
        <li className="nav-item">
          <Link 
            className="nav-link collapsed"
            to="/portal"
          >
            <i className="bi bi-window"></i>
            <span>Go to Portal</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
