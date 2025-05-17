import React from 'react';

function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to the admin dashboard. This is where you can manage your application.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dashboard cards would go here */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Users</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Active Now</h3>
            <p className="text-2xl font-bold">42</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Total Revenue</h3>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
