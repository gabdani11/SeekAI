import React, {useEffect} from 'react'
import { RouterProvider } from 'react-router-dom';
import router from './app.routes';
import { useAuth } from '../feature/auth/hook/useAuth';

const App = () => {
  const {handleGetMe} = useAuth();
  useEffect(()=>{
    handleGetMe();
  },[])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App