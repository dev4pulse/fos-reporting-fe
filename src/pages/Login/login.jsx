import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Example login logic (replace with real API call)
    if (username && password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      navigate('/dashboard/owner');
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="login-input">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="login-input">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>

        <div className="auth-links">
          <div className="forgot-row">
            <a href="#">Forgot Username?</a>
            <a href="#">Forgot Password?</a>
          </div>
          <div className="register-row">
            <span>Don't have an account?</span>
            <a href="#">Register</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
