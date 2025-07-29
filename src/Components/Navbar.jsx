import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/dashboard/home');
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={goHome}>
        <img src="../src/assets/fos_logo.png" alt="Logo" className="navbar-logo" />
        <h2 className="navbar-title">Pulse</h2>
      </div>
      <div className="navbar-right">
        <button className="navbar-btn" onClick={goHome}>Home</button>
        <button className="navbar-btn logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
