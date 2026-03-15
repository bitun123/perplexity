import axios from 'axios';


const api = axios.create({
    baseURL:import.meta.env.VITE_URL,
    withCredentials: true,
})



export const register = async ({username,email,password})=>{
    const response  = await api.post('/api/auth/register', { username, email, password });
    return response.data;
}


export const login = async ({email,password})=>{
    const response  = await api.post('/api/auth/login', { email, password });
    return response.data;
}



export const logout = async ()=>{
    const response  = await api.post('/api/auth/logout');
    return response.data;
}


export const recentVerifiedEmail = async ()=>{
    const response = await api.get("/api/auth/recent-email")
    return response.data;
}



export const getMe = async ()=>{
    const response = await api.get("/api/auth/get-me");
    return response.data;
}







