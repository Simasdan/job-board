import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }

    if (!allowedRoles.includes(user!.role)) {
        return <Navigate to='/' />
    }

    return children
}

export default ProtectedRoute