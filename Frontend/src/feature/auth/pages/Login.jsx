import React from 'react'
import './auth.scss'
import { Link, useNavigate  } from 'react-router-dom';
import { useState } from 'react';
import {useAuth} from '../hook/useAuth.js'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {handleLogin} = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()//stop page refresh
    const payload ={
      email,
      password
    }
   try {
    const success = await handleLogin(payload)

    if (success) {
      navigate('/')
    }

  } catch (err) {
    console.log(err)
  }
}
  
  return (
    <div className="login container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login