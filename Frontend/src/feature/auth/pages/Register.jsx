import React, {useState} from 'react'
import './auth.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate();
  if(user)
  {
    return <Navigate to='/'/>
  }
  const {handleRegister} = useAuth();
  async function formHandler(e){
    e.preventDefault();
    try{
    const response = await handleRegister({username,email,password});
    if(response)
      navigate('/')
  }catch(error)
  {
    console.error(error)
  }




  }
  return (
    <div className="register container">
      <h2>Register</h2>
      <form onSubmit={formHandler}>
        <input 
        type="text" 
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)} />
        <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)} />
        <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register