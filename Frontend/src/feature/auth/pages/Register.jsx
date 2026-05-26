import React from 'react'
import './auth.scss'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className="register container">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register