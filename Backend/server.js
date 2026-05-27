import 'dotenv/config';
import app from './src/app.js';
import http from "http"
import connectDB from './src/config/database.js';
import { initSocket } from './src/sockets/server.socket.js';

const httpServer = http.createServer(app); //creating an http server using the express app

initSocket(httpServer)

connectDB().catch((error)=>{
    console.log("MongoDB connection failed", error)
    process.exit(1)
})

httpServer.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})