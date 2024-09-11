import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const AdminRoutes = () => {
    const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth()
    
    if (adminLoading) {
        // Render a loading spinner or nothing while loading
        return <div>Loading...</div>
    }

    return adminAuthenticated ? <Outlet /> : <Navigate to='/admin/login' replace />
}

export default AdminRoutes
