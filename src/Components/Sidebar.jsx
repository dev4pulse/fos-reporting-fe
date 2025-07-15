import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <NavLink to="/dashboard/employee" className="nav-link">Employee Dashboard</NavLink>
        <NavLink to="/dashboard/manager" className="nav-link">Manager Dashboard</NavLink>
        <NavLink to="/dashboard/owner" className="nav-link">Owner Dashboard</NavLink>

        <div className="nav-link inventory-toggle" onClick={() => setInventoryOpen(!inventoryOpen)}>
          <span className="toggle-label">Inventory Dashboard</span>
          <span className="toggle-icon">{inventoryOpen ? '−' : '+'}</span>
        </div>

        {inventoryOpen && (
          <div className="sub-nav">
            <NavLink to="/dashboard/inventory/view" className="sub-link">View Inventory</NavLink>
            <NavLink to="/dashboard/inventory/add-product" className="sub-link">Add New Product</NavLink>
            <NavLink to="/dashboard/inventory/update" className="sub-link">Update Inventory</NavLink>
            <NavLink to="/dashboard/inventory/price" className="sub-link">Update Price</NavLink>
          </div>
        )}

        <NavLink to="/dashboard/product" className="nav-link">Product Management</NavLink>
        <NavLink to="/dashboard/sales-collections" className="nav-link">Sales & Collections</NavLink>
        <NavLink to="/dashboard/borrowers" className="nav-link">Borrowers Dashboard</NavLink>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
