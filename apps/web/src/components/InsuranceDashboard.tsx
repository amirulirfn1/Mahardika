'use client';

import React, { useState } from 'react';

import { MAHARDIKA_COLORS } from '../lib/env';

interface Policy {
  id: string;
  policyNumber: string;
  clientName: string;
  type: string;
  premium: number;
  status: 'Active' | 'Inactive' | 'Pending';
  expiryDate: string;
}

interface Renewal {
  id: string;
  policyNumber: string;
  clientName: string;
  type: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  policiesCount: number;
  totalPremium: number;
  status: 'Active' | 'Inactive';
}

const InsuranceDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('policies');

  // Sample data
  const policies: Policy[] = [
    {
      id: '1',
      policyNumber: 'POL-2024-001',
      clientName: 'John Smith',
      type: 'Auto Insurance',
      premium: 1200,
      status: 'Active',
      expiryDate: '2025-03-15',
    },
    {
      id: '2',
      policyNumber: 'POL-2024-002',
      clientName: 'Sarah Johnson',
      type: 'Home Insurance',
      premium: 800,
      status: 'Active',
      expiryDate: '2025-01-20',
    },
    {
      id: '3',
      policyNumber: 'POL-2024-003',
      clientName: 'Mike Davis',
      type: 'Life Insurance',
      premium: 2400,
      status: 'Pending',
      expiryDate: '2025-06-10',
    },
  ];

  const renewals: Renewal[] = [
    {
      id: '1',
      policyNumber: 'POL-2023-045',
      clientName: 'Emma Wilson',
      type: 'Auto Insurance',
      status: 'To Do',
      dueDate: '2024-12-30',
      priority: 'High',
    },
    {
      id: '2',
      policyNumber: 'POL-2023-067',
      clientName: 'Robert Brown',
      type: 'Home Insurance',
      status: 'In Progress',
      dueDate: '2025-01-15',
      priority: 'Medium',
    },
    {
      id: '3',
      policyNumber: 'POL-2023-089',
      clientName: 'Lisa Anderson',
      type: 'Life Insurance',
      status: 'Done',
      dueDate: '2024-12-01',
      priority: 'Low',
    },
  ];

  const agents: Agent[] = [
    {
      id: '1',
      name: 'David Parker',
      email: 'david.parker@mahardika.com',
      phone: '+1-555-0123',
      policiesCount: 45,
      totalPremium: 89500,
      status: 'Active',
    },
    {
      id: '2',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@mahardika.com',
      phone: '+1-555-0456',
      policiesCount: 38,
      totalPremium: 72300,
      status: 'Active',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@mahardika.com',
      phone: '+1-555-0789',
      policiesCount: 52,
      totalPremium: 105200,
      status: 'Inactive',
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Done':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
      case 'To Do':
        return 'warning';
      case 'In Progress':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const renderPolicies = () => (
    <div className="row">
      <div className="col-12">
        <div
          className="card"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
          }}
        >
          <div
            className="card-header"
            style={{ backgroundColor: MAHARDIKA_COLORS.navy, color: 'white' }}
          >
            <h5 className="mb-0">Policies Overview</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead
                  style={{ backgroundColor: `${MAHARDIKA_COLORS.gold}20` }}
                >
                  <tr>
                    <th>Policy Number</th>
                    <th>Client Name</th>
                    <th>Type</th>
                    <th>Premium</th>
                    <th>Status</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map(policy => (
                    <tr key={policy.id}>
                      <td>
                        <strong>{policy.policyNumber}</strong>
                      </td>
                      <td>{policy.clientName}</td>
                      <td>{policy.type}</td>
                      <td>${policy.premium.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge bg-${getStatusBadgeClass(policy.status)}`}
                        >
                          {policy.status}
                        </span>
                      </td>
                      <td>{policy.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRenewals = () => (
    <div className="row">
      <div className="col-md-4">
        <div
          className="card h-100"
          style={{ borderRadius: '0.5rem', border: '2px solid #dc3545' }}
        >
          <div className="card-header bg-danger text-white">
            <h6 className="mb-0">To Do</h6>
          </div>
          <div className="card-body">
            {renewals
              .filter(r => r.status === 'To Do')
              .map(renewal => (
                <div
                  key={renewal.id}
                  className="card mb-2"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <div className="card-body p-3">
                    <h6 className="card-title">{renewal.policyNumber}</h6>
                    <p className="card-text mb-1">
                      <small>{renewal.clientName}</small>
                    </p>
                    <p className="card-text mb-2">
                      <small className="text-muted">{renewal.type}</small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge bg-${getPriorityBadgeClass(renewal.priority)}`}
                      >
                        {renewal.priority}
                      </span>
                      <small className="text-muted">{renewal.dueDate}</small>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div
          className="card h-100"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: MAHARDIKA_COLORS.gold,
              color: MAHARDIKA_COLORS.navy,
            }}
          >
            <h6 className="mb-0">In Progress</h6>
          </div>
          <div className="card-body">
            {renewals
              .filter(r => r.status === 'In Progress')
              .map(renewal => (
                <div
                  key={renewal.id}
                  className="card mb-2"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <div className="card-body p-3">
                    <h6 className="card-title">{renewal.policyNumber}</h6>
                    <p className="card-text mb-1">
                      <small>{renewal.clientName}</small>
                    </p>
                    <p className="card-text mb-2">
                      <small className="text-muted">{renewal.type}</small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge bg-${getPriorityBadgeClass(renewal.priority)}`}
                      >
                        {renewal.priority}
                      </span>
                      <small className="text-muted">{renewal.dueDate}</small>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div
          className="card h-100"
          style={{ borderRadius: '0.5rem', border: '2px solid #198754' }}
        >
          <div className="card-header bg-success text-white">
            <h6 className="mb-0">Done</h6>
          </div>
          <div className="card-body">
            {renewals
              .filter(r => r.status === 'Done')
              .map(renewal => (
                <div
                  key={renewal.id}
                  className="card mb-2"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <div className="card-body p-3">
                    <h6 className="card-title">{renewal.policyNumber}</h6>
                    <p className="card-text mb-1">
                      <small>{renewal.clientName}</small>
                    </p>
                    <p className="card-text mb-2">
                      <small className="text-muted">{renewal.type}</small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge bg-${getPriorityBadgeClass(renewal.priority)}`}
                      >
                        {renewal.priority}
                      </span>
                      <small className="text-muted">{renewal.dueDate}</small>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="row">
      <div className="col-12">
        <div
          className="card"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
          }}
        >
          <div
            className="card-header"
            style={{ backgroundColor: MAHARDIKA_COLORS.navy, color: 'white' }}
          >
            <h5 className="mb-0">Agents Overview</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {agents.map(agent => (
                <div key={agent.id} className="col-md-4 mb-3">
                  <div
                    className="card h-100"
                    style={{ borderRadius: '0.5rem' }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title">{agent.name}</h6>
                        <span
                          className={`badge bg-${getStatusBadgeClass(agent.status)}`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="card-text mb-1">
                        <small className="text-muted">{agent.email}</small>
                      </p>
                      <p className="card-text mb-2">
                        <small className="text-muted">{agent.phone}</small>
                      </p>
                      <div className="row text-center">
                        <div className="col-6">
                          <div className="border-end">
                            <h4 style={{ color: MAHARDIKA_COLORS.navy }}>
                              {agent.policiesCount}
                            </h4>
                            <small className="text-muted">Policies</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <h4 style={{ color: MAHARDIKA_COLORS.gold }}>
                            ${(agent.totalPremium / 1000).toFixed(0)}K
                          </h4>
                          <small className="text-muted">Premium</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="row">
      <div className="col-md-6">
        <div
          className="card"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
          }}
        >
          <div
            className="card-header"
            style={{ backgroundColor: MAHARDIKA_COLORS.navy, color: 'white' }}
          >
            <h5 className="mb-0">General Settings</h5>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  defaultValue="Mahardika Insurance"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="companyEmail" className="form-label">
                  Company Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="companyEmail"
                  defaultValue="info@mahardika.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="companyPhone" className="form-label">
                  Company Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="companyPhone"
                  defaultValue="+1-555-MAHARDIKA"
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: MAHARDIKA_COLORS.gold,
                  color: MAHARDIKA_COLORS.navy,
                  borderRadius: '0.5rem',
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div
          className="card"
          style={{
            borderRadius: '0.5rem',
            border: `2px solid ${MAHARDIKA_COLORS.gold}`,
          }}
        >
          <div
            className="card-header"
            style={{ backgroundColor: MAHARDIKA_COLORS.navy, color: 'white' }}
          >
            <h5 className="mb-0">Notification Settings</h5>
          </div>
          <div className="card-body">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailNotifications"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Email Notifications
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="renewalAlerts"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="renewalAlerts">
                Renewal Alerts
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="agentUpdates"
              />
              <label className="form-check-label" htmlFor="agentUpdates">
                Agent Updates
              </label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="systemMaintenance"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="systemMaintenance">
                System Maintenance Alerts
              </label>
            </div>
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: MAHARDIKA_COLORS.gold,
                color: MAHARDIKA_COLORS.navy,
                borderRadius: '0.5rem',
              }}
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'policies':
        return renderPolicies();
      case 'renewals':
        return renderRenewals();
      case 'agents':
        return renderAgents();
      case 'settings':
        return renderSettings();
      default:
        return renderPolicies();
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}
    >
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <div
            className="d-flex flex-column vh-100"
            style={{ backgroundColor: MAHARDIKA_COLORS.navy }}
          >
            {/* Brand */}
            <div
              className="p-3 text-center border-bottom"
              style={{ borderColor: `${MAHARDIKA_COLORS.gold}30 !important` }}
            >
              <h4
                className="text-white mb-0"
                style={{ color: MAHARDIKA_COLORS.gold }}
              >
                <span style={{ color: MAHARDIKA_COLORS.gold }}>Mahardika</span>
              </h4>
              <small className="text-white-50">Insurance Dashboard</small>
            </div>

            {/* Navigation */}
            <nav className="flex-grow-1 p-3">
              <ul className="nav nav-pills flex-column">
                <li className="nav-item mb-2">
                  <button
                    className={`nav-link w-100 text-start ${activeSection === 'policies' ? 'active' : ''}`}
                    onClick={() => setActiveSection('policies')}
                    style={{
                      backgroundColor:
                        activeSection === 'policies'
                          ? MAHARDIKA_COLORS.gold
                          : 'transparent',
                      color:
                        activeSection === 'policies'
                          ? MAHARDIKA_COLORS.navy
                          : 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    📋 Policies
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button
                    className={`nav-link w-100 text-start ${activeSection === 'renewals' ? 'active' : ''}`}
                    onClick={() => setActiveSection('renewals')}
                    style={{
                      backgroundColor:
                        activeSection === 'renewals'
                          ? MAHARDIKA_COLORS.gold
                          : 'transparent',
                      color:
                        activeSection === 'renewals'
                          ? MAHARDIKA_COLORS.navy
                          : 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    🔄 Renewals
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button
                    className={`nav-link w-100 text-start ${activeSection === 'agents' ? 'active' : ''}`}
                    onClick={() => setActiveSection('agents')}
                    style={{
                      backgroundColor:
                        activeSection === 'agents'
                          ? MAHARDIKA_COLORS.gold
                          : 'transparent',
                      color:
                        activeSection === 'agents'
                          ? MAHARDIKA_COLORS.navy
                          : 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    👥 Agents
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button
                    className={`nav-link w-100 text-start ${activeSection === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveSection('settings')}
                    style={{
                      backgroundColor:
                        activeSection === 'settings'
                          ? MAHARDIKA_COLORS.gold
                          : 'transparent',
                      color:
                        activeSection === 'settings'
                          ? MAHARDIKA_COLORS.navy
                          : 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    ⚙️ Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10">
          <div className="p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 style={{ color: MAHARDIKA_COLORS.navy }}>
                  {activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1)}
                </h2>
                <p className="text-muted mb-0">
                  {activeSection === 'policies' &&
                    'Manage and view all insurance policies'}
                  {activeSection === 'renewals' &&
                    'Track policy renewals with kanban view'}
                  {activeSection === 'agents' &&
                    'Manage insurance agents and their performance'}
                  {activeSection === 'settings' &&
                    'Configure system and notification settings'}
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: '0.5rem' }}
                >
                  Export
                </button>
                <button
                  className="btn"
                  style={{
                    backgroundColor: MAHARDIKA_COLORS.gold,
                    color: MAHARDIKA_COLORS.navy,
                    borderRadius: '0.5rem',
                  }}
                >
                  Add New
                </button>
              </div>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
