import React from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';
// import { useAuth } from '../../auth/hooks/useAuth';
// import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const chat = useChat()


    useEffect(() => {
        chat.initializeSocketConnection()
    }, [])

    const { user } = useSelector((state) => state.auth);
    console.log(user)
    return (
        <div>Dashboard</div>
    )
}

export default Dashboard
