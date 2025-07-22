import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBox, FaTachometerAlt, FaSignOutAlt, FaCubes,
  FaPlus, FaEdit, FaMoneyBillWave, FaUsers, FaUser, FaUserPlus,
  FaFileInvoiceDollar, FaFileAlt, FaFolderPlus, FaFolder
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
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

        {/* Product Management */}
        <div
          className="sidebar-nav-link sidebar-inventory-toggle"
          onClick={() => setInventoryOpen(!inventoryOpen)}
        >
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

        {/* Customers */}
        <div
          className="sidebar-nav-link sidebar-customers-header"
          onClick={() => setCustomersOpen(!customersOpen)}
        >
          <FaUsers className="icon" /> Customers
          <span className="toggle-icon">{customersOpen ? '−' : '+'}</span>
        </div>
        {customersOpen && (
          <div className="sidebar-sub-nav">
            <NavLink to="/dashboard/customers/view" className="sidebar-sub-link">
              <FaUser className="icon" /> View Customers
            </NavLink>
            <NavLink to="/dashboard/customers/add" className="sidebar-sub-link">
              <FaUserPlus className="icon" /> Add New Customer
            </NavLink>
          </div>
        )}

        {/* Expenses */}
        <div
          className="sidebar-nav-link sidebar-expenses-header"
          onClick={() => setExpensesOpen(!expensesOpen)}
        >
          <span><FaFileInvoiceDollar className="icon" /> Expenses</span>
          <span className="toggle-icon">{expensesOpen ? '−' : '+'}</span>
        </div>
        {expensesOpen && (
          <div className="sidebar-sub-nav">
            <NavLink to="/dashboard/expenses/view" className="sidebar-sub-link">
              <FaFileAlt className="icon" /> View Expenses
            </NavLink>
            <NavLink to="/dashboard/expenses/add" className="sidebar-sub-link">
              <FaPlus className="icon" /> Add New Expense
            </NavLink>
            <NavLink to="/dashboard/expenses/add-category" className="sidebar-sub-link">
              <FaFolderPlus className="icon" /> Add Category
            </NavLink>
          </div>
        )}

        {/* Document Store */}
        <div
          className="sidebar-nav-link sidebar-documents-header"
          onClick={() => setDocumentsOpen(!documentsOpen)}
        >
          <span><FaFolder className="icon" /> Document Store</span>
          <span className="toggle-icon">{documentsOpen ? '−' : '+'}</span>
        </div>
        {documentsOpen && (
          <div className="sidebar-sub-nav">
            <NavLink to="/dashboard/documents/view" className="sidebar-sub-link">
              <FaFileAlt className="icon" /> View Documents
            </NavLink>
            <NavLink to="/dashboard/documents/upload" className="sidebar-sub-link">
              <FaFolderPlus className="icon" /> Upload Documents
            </NavLink>
          </div>
        )}

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;
