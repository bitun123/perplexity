import dotenv from "dotenv";
dotenv.config();
import server from "./src/app.js";
import connectDb from "./src/config/database.js";

// import { createServer } from "http";
// import { Server } from "socket.io";


// const httpServer = createServer();
// const io = new Server(httpServer, { /* options */ });
// io.on("connection", (socket) => {
//   socket.on("message",(msg)=>{
//     console.log("Message received from client");
//     console.log(msg);
//     io.emit("sms")
//   })
// });


// httpServer.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// });


connectDb()

server.listen(3000,()=>{
  console.log("server is running on port 3000")
})