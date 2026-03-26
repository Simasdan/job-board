import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/enums/Role';
import { NavLinks } from '@/enums/NavLinks';
import styles from './Sidebar.module.scss';
import HouseIcon from '@/assets/icons/house.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import FileTextIcon from '@/assets/icons/file-text.svg?react';
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react';
import UserIcon from '@/assets/icons/user.svg?react';
import LogOutIcon from '@/assets/icons/log-out.svg?react';
import LogoutDialog from '../LogoutDialog/LogoutDialog';

const Sidebar = () => {
    const { user, isAuthenticated, logout, openAuthModal } = useAuth()

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

                    <NavLink
                        to={NavLinks.Home}
                        end
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <HouseIcon />
                        <span>Home</span>
                    </NavLink>

                    {!isAuthenticated && (
                        <a
                            className={styles.navLink}
                            onClick={() => {
                                const section = document.getElementById('how-it-works')
                                section?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            style={{ cursor: 'pointer' }}
                        >
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
                            <LogoutDialog
                                onConfirm={logout}
                                trigger={
                                    <button className={styles.logoutButton}>
                                        <LogOutIcon />
                                        Logout
                                    </button>
                                }
                            />
                        </>
                    ) : (
                        <>
                            <button className={styles.signInButton} onClick={() => openAuthModal('login')}>
                                Sign in
                            </button>
                            <button className={styles.registerButton} onClick={() => openAuthModal('register')}>
                                Create account
                            </button>
                        </>
                    )}
                </div>
            </aside>
        </>

    )
}

export default Sidebar