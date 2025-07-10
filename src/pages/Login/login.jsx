import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const response = await axios.post("/api/login", {
      username,
      password,
    })

    console.log(response.data)

    if (response.data.status === 'success') {
      navigate('/dashboard')
    } else {
      setError(response.data.message || 'Invalid credentials')
    }
  } catch (err) {
    console.error(err)
    if (err.response?.data?.message) {
      setError(err.response.data.message)
    } else {
      setError('Login failed. Please try again.')
    }
  }
}



  return (
    <div className="login-container">
  <h2>Login</h2>
  <form onSubmit={handleLogin}>
    <label>Username</label>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
    <label>Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    {error && <p className="error">{error}</p>}
    <button type="submit">Login</button>
  </form>
</div>

  )
}

export default Login
