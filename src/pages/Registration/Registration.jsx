import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Registration.css'

const Registration = () => {
  const [formData, setFormData] = useState({
    employeeFirstName: '',
    employeeLastName: '',
    employeePhoneNumber: '',
    employeeRole: '',
    username: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate() // <-- here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      employeeSalary: 0,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0]
    }

    try {
      const response = await axios.post('api/employee', payload)
      console.log('Registered:', response.data)
      setMessage('Employee registered successfully!')
      setError('')

      // Clear form
      setFormData({
        employeeFirstName: '',
        employeeLastName: '',
        employeePhoneNumber: '',
        employeeRole: '',
        username: '',
        password: ''
      })

      // Redirect after 1 second
      setTimeout(() => {
        navigate('/login')
      }, 1000)

    } catch (err) {
      console.error('❌ Error:', err)
      setMessage('')
      setError(err?.response?.data || 'Registration failed.')
    }
  }

  return (
    <div className="registration-container">
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="employeeFirstName"
            value={formData.employeeFirstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="employeeLastName"
            value={formData.employeeLastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="employeePhoneNumber"
            value={formData.employeePhoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            name="employeeRole"
            value={formData.employeeRole}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Registration
