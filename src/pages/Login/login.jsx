import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://pulse-293050141084.asia-south1.run.app/login", {
        username,
        password,
      });

      console.log(response.data);

      if (response.data.status === 'success') {
        // Save login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username); // Optional

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-center mb-4">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* Optional: add register or forgot password links */}
      <div className="text-center mt-3">
        <a href="/signup">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default Login;
