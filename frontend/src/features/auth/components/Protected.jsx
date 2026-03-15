import React from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function Protected({ children }) {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return navigate("/login");
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Protected
