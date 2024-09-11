import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const ProtectedRoute = () => {
    const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth()

    if (adminLoading) {
        return <div>Loading...</div>
    }

    // Assume `userAuthenticated` should be replaced by a condition for adminAuthenticated or any other logic
    const isAuthenticated = adminAuthenticated

    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute
