import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar'; // ✅ Correct import

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session or token logic here if needed
    navigate('/');
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
