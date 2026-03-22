import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/enums/Role';
import { NavLinks } from '@/enums/NavLinks';
import styles from './Sidebar.module.scss';
import HouseIcon from '@/assets/icons/house.svg?react';
import SearchIcon from '@/assets/icons/search.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import FileTextIcon from '@/assets/icons/file-text.svg?react';
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react';
import UserIcon from '@/assets/icons/user.svg?react';
import LogOutIcon from '@/assets/icons/log-out.svg?react';
import { useState } from 'react';
import AuthModal from '@/components/AuthModal/AuthModal';

const Sidebar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTab, setModalTab] = useState<'login' | 'register'>('login')

    const openLogin = () => {
        setModalTab('login')
        setModalOpen(true)
    }

    const openRegister = () => {
        setModalTab('register')
        setModalOpen(true)
    }

    return (
        <>
            <aside className={styles.sidebar}>

                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <BriefcaseIcon />
                    </div>
                    <span>Job Board</span>
                </div>

                {/* Nav */}
                <nav className={styles.nav}>

                    <NavLink to={NavLinks.Home} end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                        <HouseIcon />
                        <span>Home</span>
                    </NavLink>

                    <NavLink to={NavLinks.BrowseJobs} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                        <SearchIcon />
                        <span>Browse Jobs</span>
                    </NavLink>

                    {!isAuthenticated && (
                        <a href={NavLinks.HowItWorks} className={styles.navLink}>
                            <InfoIcon />
                            <span>How it works</span>
                        </a>
                    )}

                    {isAuthenticated && user?.role === Role.Candidate && (
                        <NavLink to={NavLinks.MyApplications} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FileTextIcon />
                            <span>My Applications</span>
                        </NavLink>
                    )}

                    {isAuthenticated && user?.role === Role.Employer && (
                        <NavLink to={NavLinks.MyJobs} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <BriefcaseIcon />
                            <span>My Jobs</span>
                        </NavLink>
                    )}

                    {isAuthenticated && (
                        <NavLink to={NavLinks.Profile} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <UserIcon />
                            <span>Profile</span>
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
                            <button className={styles.logoutButton} onClick={logout}>
                                <LogOutIcon />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.signInButton} onClick={openLogin}>
                                Sign in
                            </button>
                            <button className={styles.registerButton} onClick={openRegister}>
                                Create account
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <AuthModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                defaultTab={modalTab}
            />
        </>

    )
}

export default Sidebar