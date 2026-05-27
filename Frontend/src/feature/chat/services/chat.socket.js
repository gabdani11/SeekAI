import {io} from 'socket.io-client'

export const initializedSocketConnection = (token)=>{

const socket = io('http://localhost:3000',{ //connecting to backend 
    withCredentials:true,
})

socket.on('connect',()=>{
    console.log("Connected to Socket.IO server") //creating connection instance
})
 


}