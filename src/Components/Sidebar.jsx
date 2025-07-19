import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBox, FaTachometerAlt, FaSignOutAlt, FaCubes,
  FaPlus, FaEdit, FaMoneyBillWave, FaUsers
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav-links">
        <NavLink to="/dashboard/owner" className="sidebar-nav-link">
          <FaTachometerAlt className="icon" /> Owner Dashboard
        </NavLink>

        <div className="sidebar-nav-link sidebar-inventory-toggle" onClick={() => setInventoryOpen(!inventoryOpen)}>
          <span><FaBox className="icon" /> Product Management</span>
          <span className="toggle-icon">{inventoryOpen ? '−' : '+'}</span>
        </div>

        {inventoryOpen && (
          <div className="sidebar-sub-nav">
            <NavLink to="/dashboard/inventory/view" className="sidebar-sub-link">
              <FaCubes className="icon" /> View Inventory
            </NavLink>
            <NavLink to="/dashboard/inventory/add-product" className="sidebar-sub-link">
              <FaPlus className="icon" /> Add Product
            </NavLink>
            <NavLink to="/dashboard/inventory/update" className="sidebar-sub-link">
              <FaEdit className="icon" /> Update Inventory
            </NavLink>
            <NavLink to="/dashboard/inventory/price" className="sidebar-sub-link">
              <FaMoneyBillWave className="icon" /> Update Price
            </NavLink>
          </div>
        )}

        <NavLink to="/dashboard/sales-collections" className="sidebar-nav-link">
          <FaMoneyBillWave className="icon" /> Sales & Collections
        </NavLink>

        <NavLink to="/dashboard/borrowers" className="sidebar-nav-link">
          <FaUsers className="icon" /> Customers
        </NavLink>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
