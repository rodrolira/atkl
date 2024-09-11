import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const PrivateRoutes = () => {
    const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth()

    if (adminLoading) {
        return <div>Loading...</div>
    }

    // If adminAuthenticated is true, redirect to the admin dashboard
    if (adminAuthenticated) {
        return <Navigate to='/admin' replace />
    }

    // Assuming non-admin users should have access to this route
    return <Outlet />
}

export default PrivateRoutes
