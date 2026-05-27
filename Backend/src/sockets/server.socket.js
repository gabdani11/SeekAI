import {Server} from 'socket.io'

let io;
export function initSocket(httpServer)
{
io= new Server(httpServer,{ //creaing a instance of socket io 
 cors:{
    origin:"http://localhost:5173",//allowing cross origin access with the client
    credentials:true,
 }
})
console.log("Socket io server is running")
io.on("connection",(socket)=>{ //when a user connected, socket.id is a user id 
    console.log("A user conneted:" + socket.id)

})
 
}
export function getIO(){
    if(!io)
    {
        throw new Error("Socket.io not initialized")
    }
    return io
}