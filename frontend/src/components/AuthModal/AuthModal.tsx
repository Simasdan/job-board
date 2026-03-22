import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/enums/Role'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './AuthModal.module.scss'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

interface AuthModalProps {
    isOpen: boolean,
    onClose: () => void,
    defaultTab?: 'login' | 'register'
}

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {

    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
    const [selectedRole, setSelectedRole] = useState<Role>(Role.Candidate);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        fullName: '',
        bio: '',
        companyName: '',
        companyDescription: '',
        website: ''
    })

    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            toast.error('Please fill in all fields.')
            return
        }

        try {
            setLoading(true)
            const response = await axiosInstance.post('/auth/login', loginData)
            login(response.data.email, response.data.token, response.data.role as Role)
            toast.success('Welcome back!')
            onClose()
        } catch {
            toast.error('Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        if (!registerData.email || !registerData.password) {
            toast.error('Please fill in all fields.')
            return
        }

        try {
            setLoading(true)
            const payload = {
                email: registerData.email,
                password: registerData.password,
                role: selectedRole,
                ...(selectedRole === 'Candidate' ? {
                    fullName: registerData.fullName,
                    bio: registerData.bio
                } : {
                    companyName: registerData.companyName,
                    companyDescription: registerData.companyDescription,
                    website: registerData.website
                })
            }
            const response = await axiosInstance.post('/auth/register', payload)
            login(response.data.email, response.data.token, response.data.role as Role)
            toast.success('Account created successfully!')
            onClose()
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={styles.dialogContent}>
                <DialogHeader className={styles.dialogHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <BriefcaseIcon />
                        </div>
                        <span>Job Board</span>
                    </div>
                    <div className={styles.tabs}>
                        <button
                            className={activeTab === 'login' ? `${styles.tab} ${styles.activeTab}` : styles.tab}
                            onClick={() => setActiveTab('login')}
                        >
                            Sign in
                        </button>
                        <button
                            className={activeTab === 'register' ? `${styles.tab} ${styles.activeTab}` : styles.tab}
                            onClick={() => setActiveTab('register')}
                        >
                            Create account
                        </button>
                    </div>
                </DialogHeader>

                <div className={styles.formBody}>
                    {activeTab === 'login' ? (
                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label>Email</label>
                                <input
                                    type='email'
                                    placeholder='candidate@demo.com'
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Password</label>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                            </div>
                            <button
                                className={styles.submitButton}
                                onClick={handleLogin}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                            <p className={styles.switchText}>
                                Don't have an account?{' '}
                                <span onClick={() => setActiveTab('register')}>Create one</span>
                            </p>
                        </div>
                    ) : (
                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label>Email</label>
                                <input
                                    type='email'
                                    placeholder='your@email.com'
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Password</label>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>I am </label>
                                <div className={styles.roleSelector}>
                                    <button
                                        className={selectedRole === Role.Candidate ? `${styles.roleButton} ${styles.activeRole}` : styles.roleButton}
                                        onClick={() => setSelectedRole(Role.Candidate)}
                                    >
                                        Candidate
                                    </button>
                                    <button
                                        className={selectedRole === Role.Employer ? `${styles.roleButton} ${styles.activeRole}` : styles.roleButton}
                                        onClick={() => setSelectedRole(Role.Employer)}
                                    >
                                        Employer
                                    </button>
                                </div>
                            </div>

                            {selectedRole === Role.Candidate ? (
                                <>
                                    <div className={styles.field}>
                                        <label>Full name</label>
                                        <input
                                            type='text'
                                            placeholder='John Doe'
                                            value={registerData.fullName}
                                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Bio</label>
                                        <input
                                            type='text'
                                            placeholder='Tell us about yourself'
                                            value={registerData.bio}
                                            onChange={(e) => setRegisterData({ ...registerData, bio: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.field}>
                                        <label>Company name</label>
                                        <input
                                            type='text'
                                            placeholder='Acme Corp'
                                            value={registerData.companyName}
                                            onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Company description</label>
                                        <input
                                            type='text'
                                            placeholder='What does your company do?'
                                            value={registerData.companyDescription}
                                            onChange={(e) => setRegisterData({ ...registerData, companyDescription: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Website</label>
                                        <input
                                            type='text'
                                            placeholder='https://yourcompany.com'
                                            value={registerData.website}
                                            onChange={(e) => setRegisterData({ ...registerData, website: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                className={styles.submitButton}
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                            <p className={styles.switchText}>
                                Already have an account?{' '}
                                <span onClick={() => setActiveTab('login')}>Sign in</span>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AuthModal