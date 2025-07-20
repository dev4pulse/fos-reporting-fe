import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://pulse-293050141084.asia-south1.run.app/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/dashboard/home'); // Redirect to standalone home
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or server error.');
    } finally {
      setLoading(false);
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
        <div className="login-input password-input">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="eye-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M1 12C2.73 7.61 7.21 4.5 12 4.5s9.27 3.11 11 7.5c-1.73 4.39-6.21 7.5-11 7.5S2.73 16.39 1 12z" stroke="#64748b" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="#64748b" strokeWidth="2" fill="none"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M1 1l22 22" stroke="#64748b" strokeWidth="2"/>
                  <path d="M21.17 21.17A11.41 11.41 0 0012 19.5c-4.79 0-9.27-3.11-11-7.5a11.55 11.55 0 013.73-4.77M7.17 7.17A6.94 6.94 0 0112 6c4 0 7.36 2.4 9 6-1.04 2.5-3.01 4.56-5.49 5.74" stroke="#64748b" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="#64748b" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="auth-links">
          <div className="forgot-row">
            <a href="#">Forgot Username?</a>
            <a href="#">Forgot Password?</a>
          </div>
          <div className="register-row">
            <span>Don't have an account?</span>
            <a href="/signup">Register</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
