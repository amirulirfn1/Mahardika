import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../../lib/auth-context';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add class to body
  useEffect(() => {
    document.body.classList.add('portal-page');
    
    return () => {
      document.body.classList.remove('portal-page');
    };
  }, []);

  return (
    <header id="header" className={`fixed-top ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container d-flex align-items-center">

        <h1 className="logo me-auto">
          <Link to="/portal">Mahardika</Link>
        </h1>

        <nav id="navbar" className="navbar order-last order-lg-0">
          <ul>
            <li><Link className="nav-link scrollto active" to="/portal">Home</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#about">About</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#departments">Departments</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#doctors">Doctors</Link></li>
            <li className="dropdown">
              <a href="#"><span>My Account</span> <i className="bi bi-chevron-down"></i></a>
              <ul>
                <li><Link to="/portal/profile">My Profile</Link></li>
                <li><Link to="/portal/appointments">My Appointments</Link></li>
                <li><Link to="/portal/medical-records">Medical Records</Link></li>
                <li><Link to="/portal/billing">Billing & Payments</Link></li>
                {(isAdmin || isStaff) && (
                  <li><Link to="/dashboard">Admin Dashboard</Link></li>
                )}
                <li><a href="#" onClick={handleSignOut}>Sign Out</a></li>
              </ul>
            </li>
            <li><Link className="nav-link scrollto" to="/portal#contact">Contact</Link></li>
          </ul>
          <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'} mobile-nav-toggle`} onClick={toggleMobileMenu}></i>
        </nav>

        <Link to="/portal#appointment" className="appointment-btn scrollto"><span className="d-none d-md-inline">Make an</span> Appointment</Link>

      </div>
    </header>
  );
}
