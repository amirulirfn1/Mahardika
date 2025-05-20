import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';

const DashboardHome = () => {
  const { currentUser, isAdmin, userRole } = useAuth();
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  
  // Create a timeout to simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format a number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Generate today's date in a nice format
  const getTodayDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  // Sample activities data
  const activities = [
    { id: 1, time: '5 min ago', description: 'Dr. Chen completed patient examination', iconColor: 'text-success' },
    { id: 2, time: '17 min ago', description: 'New appointment scheduled for tomorrow', iconColor: 'text-primary' },
    { id: 3, time: '1 hr ago', description: 'Patient records updated by staff', iconColor: 'text-info' },
    { id: 4, time: '3 hrs ago', description: 'New test results uploaded to database', iconColor: 'text-warning' },
    { id: 5, time: 'Yesterday', description: 'Monthly staff meeting reminder sent', iconColor: 'text-muted' }
  ];
  
  // Sample data for the dashboard
  const stats = [
    { 
      title: 'TOTAL PATIENTS', 
      value: '1,248', 
      icon: 'bi bi-people',
      iconClass: 'sales-icon',
      percentChange: 12,
      isIncrease: true,
      text: 'compared to last month'
    },
    { 
      title: 'TODAY\'S APPOINTMENTS', 
      value: '42', 
      icon: 'bi bi-calendar-check',
      iconClass: 'revenue-icon',
      percentChange: 8,
      isIncrease: true,
      text: 'compared to yesterday'
    },
    { 
      title: 'ACTIVE TREATMENTS', 
      value: '67', 
      icon: 'bi bi-activity',
      iconClass: 'customers-icon',
      percentChange: 3,
      isIncrease: false,
      text: 'compared to last week'
    }
  ];

  // Recent appointments
  const recentAppointments = [
    { 
      id: 1, 
      patientName: 'Sarah Johnson', 
      doctorName: 'Dr. Michael Smith', 
      department: 'Cardiology',
      date: 'May 17, 2025',
      time: '08:30 AM',
      status: 'Confirmed',
      statusClass: 'badge bg-success'
    },
    { 
      id: 2, 
      patientName: 'John Williams', 
      doctorName: 'Dr. Lisa Brown', 
      department: 'Neurology',
      date: 'May 17, 2025',
      time: '09:45 AM',
      status: 'Pending',
      statusClass: 'badge bg-warning'
    },
    { 
      id: 3, 
      patientName: 'Maria Garcia', 
      doctorName: 'Dr. James Wilson', 
      department: 'Pediatrics',
      date: 'May 17, 2025',
      time: '11:15 AM',
      status: 'Confirmed',
      statusClass: 'badge bg-success'
    },
    { 
      id: 4, 
      patientName: 'Robert Davis', 
      doctorName: 'Dr. Patricia Taylor', 
      department: 'Orthopedics',
      date: 'May 17, 2025',
      time: '02:00 PM',
      status: 'Cancelled',
      statusClass: 'badge bg-danger'
    },
    { 
      id: 5, 
      patientName: 'Jennifer Martinez', 
      doctorName: 'Dr. Thomas Anderson', 
      department: 'Dermatology',
      date: 'May 17, 2025',
      time: '04:30 PM',
      status: 'Confirmed',
      statusClass: 'badge bg-success'
    }
  ];

  // Recent patients activity
  const recentActivity = [
    {
      date: 'Today',
      activities: [
        {
          time: '09:30 AM',
          title: 'Patient Registered',
          text: 'James Wilson registered as a new patient',
          icon: 'bi bi-person-plus',
          color: 'activity-blue'
        },
        {
          time: '10:15 AM',
          title: 'Medical Record Updated',
          text: 'Dr. Emily Parker updated Sarah Johnson\'s medical record',
          icon: 'bi bi-file-medical',
          color: 'activity-green'
        },
        {
          time: '11:45 AM',
          title: 'Prescription Created',
          text: 'Dr. Michael Smith created a prescription for John Davis',
          icon: 'bi bi-capsule',
          color: 'activity-orange'
        }
      ]
    },
    {
      date: 'Yesterday',
      activities: [
        {
          time: '02:30 PM',
          title: 'Appointment Rescheduled',
          text: 'Maria Garcia rescheduled her appointment with Dr. Wilson',
          icon: 'bi bi-calendar2-x',
          color: 'activity-red'
        },
        {
          time: '04:00 PM',
          title: 'Lab Results Received',
          text: 'Lab results received for patient Robert Davis',
          icon: 'bi bi-clipboard2-data',
          color: 'activity-purple'
        }
      ]
    }
  ];

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    // Here you would typically fetch new data based on the selected period
  };

  // Render a loading state or the actual dashboard
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <section className="section dashboard">
      {/* Welcome Message */}
      <div className="row">
        <div className="col-12">
          <div className="card info-card pb-0">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>
                <li><a className="dropdown-item" href="#" onClick={() => setPeriod('today')}>Today</a></li>
                <li><a className="dropdown-item" href="#" onClick={() => setPeriod('month')}>This Month</a></li>
                <li><a className="dropdown-item" href="#" onClick={() => setPeriod('year')}>This Year</a></li>
              </ul>
            </div>
            
            <div className="card-body pb-0">
              <h5 className="card-title">Welcome back, <span>{currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</span></h5>
              <p><strong>{getTodayDate()}</strong></p>
              <p>Here's what's happening with Mahardika Healthcare today.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row">
        {stats.map((stat, index) => (
          <div className="col-md-4" key={index}>
            <div className="card info-card">
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
            
              <div className="card-body">
                <h5 className="card-title">{stat.title} <span>| {period === 'today' ? 'Today' : period === 'month' ? 'This Month' : 'This Year'}</span></h5>
                <div className="d-flex align-items-center">
                  <div className={`card-icon rounded-circle d-flex align-items-center justify-content-center ${stat.iconClass}`}>
                    <i className={stat.icon}></i>
                  </div>
                  <div className="ps-3">
                    <h6>{stat.value}</h6>
                    <span className={`text-${stat.isIncrease ? 'success' : 'danger'} small pt-1 fw-bold`}>
                      {stat.isIncrease ? '+' : '-'}{stat.percentChange}%
                    </span> 
                    <span className="text-muted small pt-2 ps-1">{stat.text}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Row - Recent Activity & Quick Actions */}
      <div className="row">
        {/* Activity Feed */}
        <div className="col-lg-8">
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

            <div className="card-body">
              <h5 className="card-title">Recent Activity <span>| Today</span></h5>

              <div className="activity">
                {activities.map((activity, index) => (
                  <div className="activity-item d-flex" key={index}>
                    <div className="activite-label">{activity.time}</div>
                    <i className={`bi bi-circle-fill activity-badge ${activity.iconColor} align-self-start`}></i>
                    <div className="activity-content">
                      {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/dashboard/patients/new" className="btn btn-primary">
                  <i className="bi bi-person-plus me-1"></i> Add New Patient
                </Link>
                <Link to="/dashboard/appointments/new" className="btn btn-success">
                  <i className="bi bi-calendar-plus me-1"></i> Schedule Appointment
                </Link>
                <Link to="/dashboard/medical-records" className="btn btn-info text-white">
                  <i className="bi bi-file-earmark-medical me-1"></i> Medical Records
                </Link>
                <Link to="/dashboard/billing/invoices/new" className="btn btn-warning text-white">
                  <i className="bi bi-receipt me-1"></i> Create Invoice
                </Link>
                {isAdmin || userRole === 'admin' ? (
                  <Link to="/dashboard/reports" className="btn btn-secondary">
                    <i className="bi bi-bar-chart me-1"></i> Generate Reports
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Staff on Duty Widget */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Staff on Duty <span>| Today</span></h5>
              <div className="d-flex align-items-center pb-2">
                <img src="/assets/dashboard/img/profile-img.jpg" alt="Profile" className="rounded-circle" width="40" />
                <div className="ms-2">
                  <h6 className="mb-0">Dr. Michael Chen</h6>
                  <small className="text-muted">Cardiology</small>
                </div>
              </div>
              <div className="d-flex align-items-center pb-2">
                <img src="/assets/dashboard/img/messages-1.jpg" alt="Profile" className="rounded-circle" width="40" />
                <div className="ms-2">
                  <h6 className="mb-0">Dr. Sarah Johnson</h6>
                  <small className="text-muted">Pediatrics</small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <img src="/assets/dashboard/img/messages-2.jpg" alt="Profile" className="rounded-circle" width="40" />
                <div className="ms-2">
                  <h6 className="mb-0">Dr. Robert Davis</h6>
                  <small className="text-muted">General Medicine</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
