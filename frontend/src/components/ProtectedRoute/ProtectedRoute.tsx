import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';
import { Role } from '@/enums/Role';
import { NavLinks } from '@/enums/NavLinks';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to={NavLinks.Home} />
    }

    if (!allowedRoles.includes(user!.role)) {
        return <Navigate to={NavLinks.Home} />
    }

    return children
}

export default ProtectedRoute