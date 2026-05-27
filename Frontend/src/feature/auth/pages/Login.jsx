import React, {useState} from 'react'
import { Link, useNavigate, Navigate  } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './auth.scss'
import {useAuth} from '../hook/useAuth.js'


const Login = () => {
  const navigate = useNavigate()

  const {handleLogin} = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const user = useSelector(state=>state.auth.user)
  
  if(user)
  {
    return <Navigate to='/'/>
  }
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