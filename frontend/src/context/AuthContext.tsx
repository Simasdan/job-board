import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Role } from '@/enums/Role';

interface User {
    email: string;
    role: Role;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, token: string, role: Role) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('token')
        const email = localStorage.getItem('email')
        const role = localStorage.getItem('role')

        if (token && email && role) {
            return { token, email, role: role as Role}
        }
        return null
    });

    const login = (email: string, token: string, role: Role) => {
        localStorage.setItem('token', token)
        localStorage.setItem('email', email)
        localStorage.setItem('role', role)
        setUser({ email, token, role })
    };

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('role')
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: user !== null
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}