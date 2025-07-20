import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
