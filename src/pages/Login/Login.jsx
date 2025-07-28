import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://pulse-293050141084.asia-south1.run.app/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        navigate("/dashboard/home"); // Redirect to standalone home
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials or server error.");
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
                <FiEye size={22} color="#64748b" />
              ) : (
                <FiEyeOff size={22} color="#64748b" />
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            "Login"
          )}
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
