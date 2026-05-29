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
      <div className="leftContainer">
        <img src="https://cdn.cosmos.so/cd846f3f-42a1-41a6-b2c7-d7b5eac6475e?format=jpeg" alt="" />
      </div>
      <div className="rightContainer">
        <div className="header">
         <h2>Get Started Now</h2>
         <p>Please sign up to your account</p>
        </div>
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
        <p>Already have an account? <Link className="link" to="/login">Login</Link></p>
    </div>
    </div>
  )
}

export default Register