import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    employeeFirstName: "",
    employeeLastName: "",
    employeePhoneNumber: "",
    employeeRole: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation
    if (
      !formData.employeeFirstName ||
      !formData.employeeLastName ||
      !formData.employeePhoneNumber ||
      !formData.employeeRole ||
      !formData.username ||
      !formData.password
    ) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://pulse-293050141084.asia-south1.run.app/employee", {
        ...formData,
        employeeSalary: 0,
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
      });
      if (response.status === 200) {
        setSuccess("Employee registered successfully!");
        // Clear form
        setFormData({
          employeeFirstName: "",
          employeeLastName: "",
          employeePhoneNumber: "",
          employeeRole: "",
          username: "",
          password: "",
        });
        // Redirect after 1.5 seconds
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err?.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-box" onSubmit={handleSubmit}>
        <h2>Employee Registration</h2>
        <div className="registration-input">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="employeeFirstName"
            placeholder="Enter first name"
            value={formData.employeeFirstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-input">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="employeeLastName"
            placeholder="Enter last name"
            value={formData.employeeLastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-input">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="employeePhoneNumber"
            placeholder="Enter phone number"
            value={formData.employeePhoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-input">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="employeeRole"
            placeholder="Enter role"
            value={formData.employeeRole}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-input">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="registration-input password-input">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
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
        <button type="submit" className="registration-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <div className="auth-links">
          <div className="login-row">
            <span>Already have an account?</span>
            <a href="/login">Login</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
