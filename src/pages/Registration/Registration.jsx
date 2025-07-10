import React, { useState } from 'react'
import axios from 'axios'

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
      const response = await axios.post('http://pulse-293050141084.asia-south1.run.app/employee', payload)
      console.log('✅ Registered:', response.data)
      setMessage('Employee registered successfully!')
      setError('')
      setFormData({
        employeeFirstName: '',
        employeeLastName: '',
        employeePhoneNumber: '',
        employeeRole: '',
        username: '',
        password: ''
      })
    } catch (err) {
      console.error('❌ Error:', err)
      setMessage('')
      setError(err?.response?.data || 'Registration failed.')
    }
  }

  return (
    <div className="registration-container">
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="employeeFirstName"
          value={formData.employeeFirstName}
          onChange={handleChange}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="employeeLastName"
          value={formData.employeeLastName}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="employeePhoneNumber"
          value={formData.employeePhoneNumber}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <input
          type="text"
          name="employeeRole"
          value={formData.employeeRole}
          onChange={handleChange}
          required
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Registration
