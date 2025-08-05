import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar onLogout={handleLogout} />
        <div className="dashboard-content">
          <Outlet />
        </div>
    </div>
  );
};

export default DashboardLayout;
