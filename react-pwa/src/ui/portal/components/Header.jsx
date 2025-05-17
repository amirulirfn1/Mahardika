import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header" className={`fixed-top ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container d-flex align-items-center">
        <h1 className="logo me-auto">
          <Link to="/portal">Mahardika</Link>
        </h1>

        {/* Mobile menu toggle button */}
        <i 
          className={`mobile-nav-toggle d-lg-none ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`}
          onClick={toggleMobileMenu}
        ></i>

        {/* Desktop Navigation */}
        <nav id="navbar" className="navbar order-last order-lg-0">
          <ul>
            <li><Link className="nav-link scrollto active" to="/portal">Home</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#about">About</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#services">Services</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#doctors">Doctors</Link></li>
            <li><Link className="nav-link scrollto" to="/portal#contact">Contact</Link></li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-show' : ''}`}>
          <div className="mobile-nav-inner">
            <ul>
              <li><Link to="/portal" onClick={toggleMobileMenu}>Home</Link></li>
              <li><Link to="/portal#about" onClick={toggleMobileMenu}>About</Link></li>
              <li><Link to="/portal#services" onClick={toggleMobileMenu}>Services</Link></li>
              <li><Link to="/portal#doctors" onClick={toggleMobileMenu}>Doctors</Link></li>
              <li><Link to="/portal#contact" onClick={toggleMobileMenu}>Contact</Link></li>
              <li>
                <button 
                  className="btn btn-link text-danger p-0" 
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Sign Out Button */}
        <div className="d-none d-lg-block ms-auto">
          <button 
            onClick={handleSignOut}
            className="appointment-btn"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
