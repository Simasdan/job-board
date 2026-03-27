import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/enums/Role'
import { NavLinks } from '@/enums/NavLinks'
import styles from './Sidebar.module.scss'
import HouseIcon from '@/assets/icons/house.svg?react'
import InfoIcon from '@/assets/icons/info.svg?react'
import FileTextIcon from '@/assets/icons/file-text.svg?react'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'
import UserIcon from '@/assets/icons/user.svg?react'
import LogOutIcon from '@/assets/icons/log-out.svg?react'
import LogoutDialog from '../LogoutDialog/LogoutDialog'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import { Spinner } from '@/components/ui/spinner'

interface SidebarProps {
    isTablet?: boolean
    sidebarExpanded?: boolean
    onToggle?: () => void
    onNavigate?: () => void
}

const Sidebar = ({ isTablet = false, sidebarExpanded = false, onToggle, onNavigate }: SidebarProps) => {
    const isCollapsed = isTablet && !sidebarExpanded;
    const { user, isAuthenticated, logout, openAuthModal, login } = useAuth()
    const [demoLoading, setDemoLoading] = useState<'candidate' | 'employer' | null>(null)

    const handleDemoLogin = async (type: 'candidate' | 'employer') => {
        try {
            setDemoLoading(type)
            const credentials = type === 'candidate'
                ? { email: 'candidate@demo.com', password: 'Demo123!' }
                : { email: 'employer@demo.com', password: 'Demo123!' }
            const response = await axiosInstance.post('/auth/login', credentials)
            login(response.data.email, response.data.token, response.data.role as Role)
            toast.success(`Logged in as demo ${type}!`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            onNavigate?.()
        } catch {
            toast.error('Demo login failed.')
        } finally {
            setDemoLoading(null)
        }
    }

    return (
        <aside className={`
            ${styles.sidebar} 
            ${isCollapsed ? styles.collapsed : ''} 
            ${isTablet && sidebarExpanded ? styles.tabletExpanded : ''}
        `}>

            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <BriefcaseIcon />
                </div>
                {!isCollapsed && <span>Job Board</span>}
            </div>

            {/* Tablet toggle button */}
            {isTablet && (
                <button className={styles.toggleButton} onClick={onToggle}>
                    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </button>
            )}

            {/* Nav */}
            <nav className={styles.nav}>
                <NavLink
                    to={NavLinks.Home}
                    end
                    className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        onNavigate?.()
                    }}
                >
                    <HouseIcon />
                    {!isCollapsed && <span>Home</span>}
                </NavLink>

                {!isAuthenticated && (
                    <a
                        className={styles.navLink}
                        onClick={() => {
                            const section = document.getElementById('how-it-works')
                            section?.scrollIntoView({ behavior: 'smooth' })
                            onNavigate?.()
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <InfoIcon />
                        {!isCollapsed && <span>How it works</span>}
                    </a>
                )}

                {isAuthenticated && user?.role === Role.Candidate && (
                    <NavLink
                        to={NavLinks.MyApplications}
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            onNavigate?.()
                        }}
                    >
                        <FileTextIcon />
                        {!isCollapsed && <span>My Applications</span>}
                    </NavLink>
                )}

                {isAuthenticated && user?.role === Role.Employer && (
                    <NavLink
                        to={NavLinks.MyJobs}
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            onNavigate?.()
                        }}
                    >
                        <BriefcaseIcon />
                        {!isCollapsed && <span>My Jobs</span>}
                    </NavLink>
                )}

                {isAuthenticated && (
                    <NavLink
                        to={NavLinks.Profile}
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            onNavigate?.()
                        }}
                    >
                        <UserIcon />
                        {!isCollapsed && <span>Profile</span>}
                    </NavLink>
                )}
            </nav>

            {/* Bottom */}
            <div className={styles.bottom}>
                {isAuthenticated ? (
                    <>
                        <div className={styles.userCard}>
                            <div className={styles.userAvatar}>
                                {user?.email.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userEmail}>{user?.email}</span>
                                <span className={styles.userRole}>{user?.role}</span>
                            </div>
                        </div>
                        <LogoutDialog
                            onConfirm={() => {
                                logout()
                                onNavigate?.()
                            }}
                            trigger={
                                <button className={styles.logoutButton}>
                                    <LogOutIcon />
                                    {!isCollapsed && <span>Logout</span>}
                                </button>
                            }
                        />
                    </>
                ) : (
                    <>
                        {!isCollapsed && (
                            <>
                                <button className={styles.signInButton} onClick={() => { openAuthModal('login'); onNavigate?.() }}>
                                    Sign in
                                </button>
                                <button className={styles.registerButton} onClick={() => { openAuthModal('register'); onNavigate?.() }}>
                                    Create account
                                </button>
                                <div className={styles.demoDivider}>
                                    <span>or try a demo</span>
                                </div>
                            </>
                        )}
                        <button
                            className={styles.demoButton}
                            onClick={() => handleDemoLogin('candidate')}
                            disabled={demoLoading !== null}
                        >
                            {demoLoading === 'candidate' ? (
                                <Spinner className={styles.demoSpinner} />
                            ) : (
                                <UserIcon />
                            )}
                            {!isCollapsed && 'Try as Candidate'}
                        </button>
                        <button
                            className={styles.demoButton}
                            onClick={() => handleDemoLogin('employer')}
                            disabled={demoLoading !== null}
                        >
                            {demoLoading === 'employer' ? (
                                <Spinner className={styles.demoSpinner} />
                            ) : (
                                <BriefcaseIcon />
                            )}
                            {!isCollapsed && 'Try as Employer'}
                        </button>
                    </>
                )}
            </div>

        </aside>
    )
}

export default Sidebar