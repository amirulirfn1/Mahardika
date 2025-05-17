import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'boxicons/css/boxicons.min.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'remixicon/fonts/remixicon.css';
import 'simple-datatables/dist/style.css';
import '../../../../../src/assets/portal/css/niceadmin-style.css';

function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    document.body.classList.toggle('toggle-sidebar');
  };

  // Initialize tooltips
  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize AOS
    const loadAOS = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    };
    
    loadAOS();
  }, []);

  return (
    <>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/dashboard" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt="Mahardika Logo" />
            <span className="d-none d-lg-block">Mahardika</span>
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
        </div>

        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i className="bi bi-search"></i></button>
          </form>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle" href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>New Appointment</h4>
                    <p>You have a new appointment request</p>
                    <p>30 min. ago</p>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li className="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">Admin User</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Admin User</h6>
                  <span>Administrator</span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link to="/profile" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link to="/logout" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      {/* ======= Sidebar ======= */}
      <aside id="sidebar" className={sidebarCollapsed ? "sidebar collapsed" : "sidebar"}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#appointments-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-calendar-check"></i><span>Appointments</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="appointments-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li><Link to="/appointments"><i className="bi bi-circle"></i><span>View All</span></Link></li>
              <li><Link to="/appointments/new"><i className="bi bi-circle"></i><span>New Appointment</span></Link></li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="/patients" className="nav-link collapsed">
              <i className="bi bi-people"></i>
              <span>Patients</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#doctors-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-person-badge"></i><span>Doctors</span><i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="doctors-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li><Link to="/doctors"><i className="bi bi-circle"></i><span>All Doctors</span></Link></li>
              <li><Link to="/doctors/schedule"><i className="bi bi-circle"></i><span>Schedule</span></Link></li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="/reports" className="nav-link collapsed">
              <i className="bi bi-file-earmark-bar-graph"></i>
              <span>Reports</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link collapsed">
              <i className="bi bi-gear"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </aside>

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
          <div className="row">
            {/* Left side columns */}
            <div className="col-lg-8">
              <div className="row">
                {/* Sales Card */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">Appointments <span>| Today</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-calendar-check"></i>
                        </div>
                        <div className="ps-3">
                          <h6>24</h6>
                          <span className="text-success small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">increase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">Revenue <span>| This Month</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-currency-dollar"></i>
                        </div>
                        <div className="ps-3">
                          <h6>$3,264</h6>
                          <span className="text-success small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">increase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patients Card */}
                <div className="col-xxl-4 col-xl-12">
                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title">Patients <span>| This Year</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-people"></i>
                        </div>
                        <div className="ps-3">
                          <h6>1,254</h6>
                          <span className="text-danger small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">decrease</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Recent Activity</h5>
                      <div className="activity">
                        <div className="activity-item d-flex">
                          <div className="activite-label">32 min</div>
                          <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                          <div className="activity-content">
                            New patient registration: <a href="#" className="fw-bold text-dark">John Doe</a>
                          </div>
                        </div>
                        <div className="activity-item d-flex">
                          <div className="activite-label">56 min</div>
                          <i className='bi bi-circle-fill activity-badge text-danger align-self-start'></i>
                          <div className="activity-content">
                            Appointment with <a href="#" className="fw-bold text-dark">Dr. Smith</a> has been confirmed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side columns */}
            <div className="col-lg-4">
              {/* Recent Sales */}
              <div className="card">
                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>
                    <li><a className="dropdown-item" href="#">Today</a></li>
                    <li><a className="dropdown-item" href="#">This Month</a></li>
                    <li><a className="dropdown-item" href="#">This Year</a></li>
                  </ul>
                </div>
                <div className="card-body pb-0">
                  <h5 className="card-title">Recent Sales <span>| Today</span></h5>
                  <div className="recent-sales">
                    <table className="table table-borderless datatable">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Patient</th>
                          <th scope="col">Service</th>
                          <th scope="col">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row"><a href="#">#2457</a></th>
                          <td>Brandon Jacob</td>
                          <td>Dental Checkup</td>
                          <td><span className="text-primary">$64</span></td>
                        </tr>
                        <tr>
                          <th scope="row"><a href="#">#2456</a></th>
                          <td>Bridie Kessler</td>
                          <td>Eye Exam</td>
                          <td><span className="text-primary">$47</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div className="copyright">
          &copy; Copyright <strong><span>Mahardika</span></strong>. All Rights Reserved
        </div>
        <div className="credits">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </footer>
    </>
  );
}

export default Dashboard;
