import React from 'react'
import { useSelector } from 'react-redux';
// import { useAuth } from '../../auth/hooks/useAuth';
// import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user } = useSelector((state) => state.auth);
console.log(user)
    return (
        <div>Dashboard</div>
    )
}

export default Dashboard
