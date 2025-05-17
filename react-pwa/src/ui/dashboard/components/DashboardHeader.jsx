import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';

const DashboardHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Toggle functions
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  const toggleMessages = () => setMessagesOpen(!messagesOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);
  
  // Sample notification data
  const notifications = [
    {
      type: 'alert-primary',
      icon: 'bi bi-calendar3',
      title: 'New Appointment',
      text: 'Dr. Smith has scheduled a new appointment',
      time: '5 min ago'
    },
    {
      type: 'alert-success',
      icon: 'bi bi-check-circle',
      title: 'Completed Task',
      text: 'Patient record update completed',
      time: '1 hour ago'
    },
    {
      type: 'alert-warning',
      icon: 'bi bi-exclamation-triangle',
      title: 'System Warning',
      text: 'Storage space is running low',
      time: 'Yesterday'
    },
    {
      type: 'alert-danger',
      icon: 'bi bi-x-circle',
      title: 'Failed Operation',
      text: 'Database backup failed',
      time: '2 days ago'
    }
  ];
  
  // Sample messages data
  const messages = [
    {
      sender: 'Maria Hudson',
      image: '/assets/dashboard/img/messages-1.jpg',
      message: 'Can you please update my appointment?',
      time: '4 hrs. ago'
    },
    {
      sender: 'Anna Nelson',
      image: '/assets/dashboard/img/messages-2.jpg',
      message: 'I need to reschedule my consultation',
      time: '6 hrs. ago'
    },
    {
      sender: 'David Muldon',
      image: '/assets/dashboard/img/messages-3.jpg',
      message: 'Where can I find my medical records?',
      time: '8 hrs. ago'
    }
  ];
  
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="logo d-flex align-items-center">
          <img src="/assets/dashboard/img/logo.png" alt="Logo" />
          <span className="d-none d-lg-block">Mahardika</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
      </div>

      <div className="search-bar">
        <form className={`search-form d-flex align-items-center ${isSearchOpen ? 'search-shown' : ''}`}>
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle" onClick={toggleSearch}>
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className={`nav-item dropdown ${notificationsOpen ? 'show' : ''}`}>
            <a className="nav-link nav-icon" onClick={toggleNotifications}>
              <i className="bi bi-bell"></i>
              <span className="badge bg-primary badge-number">4</span>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications ${notificationsOpen ? 'show' : ''}`}>
              <li className="dropdown-header">
                You have 4 new notifications
                <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
              </li>
              
              <li><hr className="dropdown-divider" /></li>

              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <li className="notification-item">
                    <i className={`${notification.icon} ${notification.type}`}></i>
                    <div>
                      <h4>{notification.title}</h4>
                      <p>{notification.text}</p>
                      <p>{notification.time}</p>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                </React.Fragment>
              ))}

              <li className="dropdown-footer">
                <a href="#">Show all notifications</a>
              </li>
            </ul>
          </li>

          <li className={`nav-item dropdown ${messagesOpen ? 'show' : ''}`}>
            <a className="nav-link nav-icon" onClick={toggleMessages}>
              <i className="bi bi-chat-left-text"></i>
              <span className="badge bg-success badge-number">3</span>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow messages ${messagesOpen ? 'show' : ''}`}>
              <li className="dropdown-header">
                You have 3 new messages
                <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
              </li>
              
              <li><hr className="dropdown-divider" /></li>

              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <li className="message-item">
                    <a href="#">
                      <img src={message.image} alt="" className="rounded-circle" />
                      <div>
                        <h4>{message.sender}</h4>
                        <p>{message.message}</p>
                        <p>{message.time}</p>
                      </div>
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                </React.Fragment>
              ))}

              <li className="dropdown-footer">
                <a href="#">Show all messages</a>
              </li>
            </ul>
          </li>

          <li className={`nav-item dropdown pe-3 ${profileOpen ? 'show' : ''}`}>
            <a className="nav-link nav-profile d-flex align-items-center pe-0" onClick={toggleProfile}>
              <img 
                src={currentUser?.photoURL || "/assets/dashboard/img/profile-img.jpg"} 
                alt="Profile" 
                className="rounded-circle" 
              />
              <span className="d-none d-md-block dropdown-toggle ps-2">
                {currentUser?.displayName || 'User'}
              </span>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${profileOpen ? 'show' : ''}`}>
              <li className="dropdown-header">
                <h6>{currentUser?.displayName || 'User'}</h6>
                <span>{isAdmin ? 'Administrator' : 'Staff'}</span>
              </li>
              
              <li><hr className="dropdown-divider" /></li>

              <li>
                <Link className="dropdown-item d-flex align-items-center" to="/dashboard/profile">
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </Link>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <Link className="dropdown-item d-flex align-items-center" to="/dashboard/settings">
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </Link>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <Link className="dropdown-item d-flex align-items-center" to="/dashboard/help">
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </Link>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <a className="dropdown-item d-flex align-items-center" onClick={handleSignOut}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardHeader;
