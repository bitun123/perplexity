import { io } from "socket.io-client";



export const initializeSocketConnection = () => {
const socket =   io.connect("http://localhost:3000",{
    withCredentials: true,
});



socket.on("connect",()=>{
    console.log("connected socket.io successfully")
})


};