import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '12px 16px',
    textDecoration: 'none',
    backgroundColor: isActive ? '#f0f0f0' : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    color: '#333'
  });

  return (
    <div style={{
      width: '220px',
      backgroundColor: '#fafafa',
      borderRight: '1px solid #ddd',
      paddingTop: '20px',
    }}>
      <nav>
        <NavLink to="/dashboard/employee" style={linkStyle}>Employee Dashboard</NavLink>
        <NavLink to="/dashboard/manager" style={linkStyle}>Manager Dashboard</NavLink>
        <NavLink to="/dashboard/owner" style={linkStyle}>Owner Dashboard</NavLink>
        <NavLink to="/dashboard/inventory" style={linkStyle}>Inventory Dashboard</NavLink>
        <NavLink to="/dashboard/product" style={linkStyle}>Product Management</NavLink>
        <NavLink to="/dashboard/sales-collections" style={linkStyle}>Sales & Collections</NavLink>
        <NavLink to="/dashboard/borrowers" style={linkStyle}>Borrowers Dashboard</NavLink>
        <button 
          onClick={onLogout}
          style={{
            marginTop: '20px',
            padding: '10px 16px',
            width: '100%',
            border: 'none',
            backgroundColor: '#f44336',
            color: 'white',
            cursor: 'pointer'
          }}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
