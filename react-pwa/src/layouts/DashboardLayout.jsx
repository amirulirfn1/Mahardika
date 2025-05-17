import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import DashboardSidebar from '../ui/dashboard/components/DashboardSidebar';
import DashboardHeader from '../ui/dashboard/components/DashboardHeader';

export function DashboardLayout() {
  const { currentUser, userRole } = useAuth();
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarToggled(!isSidebarToggled);
    document.body.classList.toggle('toggle-sidebar');
  };

  // Add dashboard class to body
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    
    // Initialize any NiceAdmin template scripts that need DOM interaction
    const initializeTemplateScripts = () => {
      // This will initialize any template-specific interactions with DOM
      // Most of the functionality is already in the main.js we linked in index.html
      // But we may need to trigger some behaviors manually
      
      // For example, toggle sidebar buttons and other event handlers
      const selectBoxElements = document.querySelectorAll('.toggle-sidebar-btn');
      if (selectBoxElements) {
        selectBoxElements.forEach(element => {
          element.addEventListener('click', toggleSidebar);
        });
      }
    };
    
    // Call after DOM is fully loaded
    initializeTemplateScripts();
    
    return () => {
      document.body.classList.remove('dashboard-page');
      document.body.classList.remove('toggle-sidebar');
    };
  }, []);

  return (
    <>
      {/* ======= Header ======= */}
      <DashboardHeader toggleSidebar={toggleSidebar} />
      
      {/* ======= Sidebar ======= */}
      <DashboardSidebar toggleSidebar={toggleSidebar} isSidebarToggled={isSidebarToggled} />

      {/* ======= Main Content ======= */}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
          <Outlet />
        </section>
      </main>

      {/* ======= Footer ======= */}
      <footer id="footer" className="footer">
        <div className="copyright">
          &copy; {new Date().getFullYear()} <strong><span>Mahardika</span></strong>. All Rights Reserved
        </div>
        <div className="credits">
          Healthcare Management System
        </div>
      </footer>

      {/* ======= Back to top button ======= */}
      <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}
