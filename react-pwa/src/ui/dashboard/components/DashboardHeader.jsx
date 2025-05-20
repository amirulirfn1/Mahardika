import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';

const DashboardHeader = () => {
  const { currentUser, signOut: signOutUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to Mahardika Healthcare Dashboard', time: '30 min ago' },
    { id: 2, type: 'warning', message: 'System update scheduled for tomorrow', time: '1 hr ago' },
    { id: 3, type: 'success', message: 'Your profile has been completed', time: '2 hrs ago' },
  ]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-link')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Toggle sidebar functionality
  const handleToggleSidebar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/profile')) return 'User Profile';
    if (path.includes('/patients')) return 'Patient Management';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/settings')) return 'Settings';
    
    // Default: capitalize the last segment of the path
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/dashboard" className="logo d-flex align-items-center">
            <img src="/assets/dashboard/img/logo.png" alt="Logo" />
            <span className="d-none d-lg-block">Mahardika</span>
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggleSidebar}></i>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <form className="search-form d-flex align-items-center" action="#">
            <input 
              type="text" 
              name="query" 
              placeholder="Search patients, appointments..." 
              title="Enter search keyword" 
            />
            <button type="submit" title="Search"><i className="bi bi-search"></i></button>
          </form>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            {/* Search Icon (Mobile) */}
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle" href="#" onClick={() => setSearchOpen(!searchOpen)}>
                <i className="bi bi-search"></i>
              </a>
            </li>

            {/* Notifications */}
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon" href="#" onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(isDropdownOpen ? false : 'notifications');
              }}>
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">{notifications.length}</span>
              </a>

              <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications ${isDropdownOpen === 'notifications' ? 'show' : ''}`}>
                <li className="dropdown-header">
                  You have {notifications.length} new notifications
                  <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                
                {notifications.map(notification => (
                  <React.Fragment key={notification.id}>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li className="notification-item">
                      <i className={`bi bi-${notification.type === 'info' ? 'info-circle' : notification.type === 'warning' ? 'exclamation-circle' : 'check-circle'} ${notification.type === 'info' ? 'text-primary' : notification.type === 'warning' ? 'text-warning' : 'text-success'}`}></i>
                      <div>
                        <p>{notification.message}</p>
                        <p>{notification.time}</p>
                      </div>
                    </li>
                  </React.Fragment>
                ))}

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>
              </ul>
            </li>

            {/* User Profile */}
            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(isDropdownOpen === 'profile' ? false : 'profile');
                }}
              >
                <img
                  src="/assets/dashboard/img/profile-img.jpg"
                  alt="Profile"
                  className="rounded-circle"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </span>
              </a>

              <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${isDropdownOpen === 'profile' ? 'show' : ''}`}>
                <li className="dropdown-header">
                  <h6>{currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</h6>
                  <span className="text-secondary">{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/dashboard/profile">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/dashboard/settings">
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to="/help">
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleSignOut}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* Page Title */}
      <div className="pagetitle">
        <h1>{getPageTitle()}</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
            <li className="breadcrumb-item active">{getPageTitle()}</li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default DashboardHeader;
