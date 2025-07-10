import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <NavLink to="/dashboard/employee" className="nav-link">Employee Dashboard</NavLink>
        <NavLink to="/dashboard/manager" className="nav-link">Manager Dashboard</NavLink>
        <NavLink to="/dashboard/owner" className="nav-link">Owner Dashboard</NavLink>
        <NavLink to="/dashboard/inventory" className="nav-link">Inventory Dashboard</NavLink>
        <NavLink to="/dashboard/product" className="nav-link">Product Management</NavLink>
        <NavLink to="/dashboard/sales-collections" className="nav-link">Sales & Collections</NavLink>
        <NavLink to="/dashboard/borrowers" className="nav-link">Borrowers Dashboard</NavLink>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
