import {useDispatch} from 'react-redux'
import {register, login, getMe} from "../services/auth.api.js"
import { setUser, setLoading, setError } from '../auth.slice.js'

export function useAuth(){
    const dispatch = useDispatch()

    async function handleRegister({email, username, password})
    {
        try{
            dispatch(setLoading(true)) //set loading to true
            const response = await register({email, username, password}) //calling register function
            dispatch(setUser(response.user)) //setting user data to redux
            return true
            
        }catch(error)
        {
            dispatch(setError(error.response?.data?.message||"Register failed"))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleLogin({email, password})
    {
        try{
            dispatch(setLoading(true))
            const response = await login({email, password})
            dispatch(setUser(response.user))
            return true

        }catch(error)
        {
            dispatch(setError(error.response?.data?.message||"Login failed"))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe(){
         try{
            dispatch(setLoading(true))
            const response = await getMe()
            dispatch(setUser(response.user))

        }catch(error)
        {
            dispatch(setError(error.response?.data?.message||"Register failed"))
        }finally{
            dispatch(setLoading(false))
        }

    }
    return{
        handleRegister,
        handleGetMe,
        handleLogin
    }
}