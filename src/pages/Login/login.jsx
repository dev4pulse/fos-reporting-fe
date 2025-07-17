import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

      // ✅ Example: Handle success response (adjust based on your API)
      if (response.status === 200) {
        const { token, role } = response.data;

        // Save login details
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // ✅ Redirect to dashboard
        navigate('/dashboard/home');
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
            <a href="#">Register</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
