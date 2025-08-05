import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaBox, FaTachometerAlt, FaCubes,
  FaPlus, FaEdit, FaMoneyBillWave, FaUsers, FaUser, FaUserPlus,
  FaFileInvoiceDollar, FaFileAlt, FaFolderPlus, FaFolder
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({ name: '', id: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const empData = JSON.parse(localStorage.getItem('employee'));
    if (empData) {
      setEmployee({ name: empData.name, id: empData.id });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const goHome = () => {
    navigate('/dashboard/home');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={goHome}>
        <img src="../../src/assets/fos_logo.png" alt="Logo" className="navbar-logo" />
        <h2 className="navbar-title">Finest Oil Station</h2>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <NavLink to="/dashboard/home" onClick={() => setIsMenuOpen(false)}>
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <div className="navbar-dropdown">
          <span><FaBox /> Inventory ▾</span>
          <div className="dropdown-content">
            <NavLink to="/dashboard/inventory/view" onClick={() => setIsMenuOpen(false)}>
              <FaCubes /> View Inventory
            </NavLink>
            <NavLink to="/dashboard/inventory/view-products" onClick={() => setIsMenuOpen(false)}>
              <FaCubes /> View Products
            </NavLink>
            <NavLink to="/dashboard/inventory/add-product" onClick={() => setIsMenuOpen(false)}>
              <FaPlus /> Add Product
            </NavLink>
            <NavLink to="/dashboard/inventory/update" onClick={() => setIsMenuOpen(false)}>
              <FaEdit /> Update Inventory
            </NavLink>
            <NavLink to="/dashboard/inventory/price" onClick={() => setIsMenuOpen(false)}>
              <FaMoneyBillWave /> Update Price
            </NavLink>
          </div>
        </div>

        <NavLink to="/dashboard/sales-collections" onClick={() => setIsMenuOpen(false)}>
          <FaMoneyBillWave /> Sales & Collections
        </NavLink>

        <div className="navbar-dropdown">
          <span><FaUsers /> Customers ▾</span>
          <div className="dropdown-content">
            <NavLink to="/dashboard/customers/view" onClick={() => setIsMenuOpen(false)}>
              <FaUser /> View Customers
            </NavLink>
            <NavLink to="/dashboard/customers/add" onClick={() => setIsMenuOpen(false)}>
              <FaUserPlus /> Add Customer
            </NavLink>
          </div>
        </div>

        <div className="navbar-dropdown">
          <span><FaFileInvoiceDollar /> Expenses ▾</span>
          <div className="dropdown-content">
            <NavLink to="/dashboard/expenses/view" onClick={() => setIsMenuOpen(false)}>
              <FaFileAlt /> View Expenses
            </NavLink>
            <NavLink to="/dashboard/expenses/add" onClick={() => setIsMenuOpen(false)}>
              <FaPlus /> Add Expense
            </NavLink>
            <NavLink to="/dashboard/expenses/add-category" onClick={() => setIsMenuOpen(false)}>
              <FaFolderPlus /> Add Category
            </NavLink>
          </div>
        </div>

        <div className="navbar-dropdown">
          <span><FaFolder /> Documents ▾</span>
          <div className="dropdown-content">
            <NavLink to="/dashboard/documents/view" onClick={() => setIsMenuOpen(false)}>
              <FaFileAlt /> View Documents
            </NavLink>
            <NavLink to="/dashboard/documents/upload" onClick={() => setIsMenuOpen(false)}>
              <FaFolderPlus /> Upload Documents
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="navbar-right">
        <div className="employee-info">
          <span>{employee.name} (ID: {employee.id})</span>
        </div>
        <button className="navbar-btn" onClick={goHome}>Home</button>
        <button className="navbar-btn logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
