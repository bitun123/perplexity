import axios from 'axios';

// Create an Axios instance with default configuration
const api  = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, 
})



// API functions for chat operations
export const sendMessage = async ({message, chatId}) => {
    const response = await api.post("/api/chats/message", { message, chatId });
    return response.data;
}



// API function to fetch all chats for the authenticated user
export const getChats = async ()=>{
    const response = await api.get("/api/chats/getChats");
    return response.data;
}



// API function to fetch messages for a specific chat
export const getMessages = async (chatId)=>{
    const response = await api.get(`/api/chats/getMessages/${chatId}`);
    return response.data;
}



// API function to delete a specific chat
export const deleteChat = async (chatId)=>{
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
}