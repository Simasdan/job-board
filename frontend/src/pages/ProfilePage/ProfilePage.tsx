import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/enums/Role'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './ProfilePage.module.scss'
import PencilIcon from '@/assets/icons/pencil.svg?react'
import ExternalLinkIcon from '@/assets/icons/external-link.svg?react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

interface CandidateProfile {
    id: number
    userId: number
    fullName: string
    bio: string
    resumeUrl: string
}

interface EmployerProfile {
    id: number
    userId: number
    companyName: string
    companyDescription: string
    website: string
}

const ProfilePage = () => {
    const { user } = useAuth()
    const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)
    const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        resumeUrl: '',
        companyName: '',
        companyDescription: '',
        website: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            if (user?.role === Role.Candidate) {
                const response = await axiosInstance.get('/candidates/my-profile')
                setCandidateProfile(response.data)
                setFormData(prev => ({
                    ...prev,
                    fullName: response.data.fullName,
                    bio: response.data.bio,
                    resumeUrl: response.data.resumeUrl
                }))
            } else if (user?.role === Role.Employer) {
                const response = await axiosInstance.get('/employers/my-profile')
                setEmployerProfile(response.data)
                setFormData(prev => ({
                    ...prev,
                    companyName: response.data.companyName,
                    companyDescription: response.data.companyDescription,
                    website: response.data.website
                }))
            }
        } catch {
            toast.error('Failed to fetch profile.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            if (user?.role === Role.Candidate) {
                const response = await axiosInstance.put('/candidates/my-profile', {
                    fullName: formData.fullName,
                    bio: formData.bio,
                    resumeUrl: formData.resumeUrl
                })
                setCandidateProfile(response.data)
            } else if (user?.role === Role.Employer) {
                const response = await axiosInstance.put('/employers/my-profile', {
                    companyName: formData.companyName,
                    companyDescription: formData.companyDescription,
                    website: formData.website
                })
                setEmployerProfile(response.data)
            }
            toast.success('Profile updated successfully!')
            setEditModalOpen(false)
        } catch {
            toast.error('Failed to update profile.')
        } finally {
            setSaving(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        })
    }

    const getInitial = () => {
        if (user?.role === Role.Candidate && candidateProfile?.fullName) {
            return candidateProfile.fullName.charAt(0).toUpperCase()
        }
        if (user?.role === Role.Employer && employerProfile?.companyName) {
            return employerProfile.companyName.charAt(0).toUpperCase()
        }
        return user?.email.charAt(0).toUpperCase() ?? '?'
    }

    const getDisplayName = () => {
        if (user?.role === Role.Candidate) return candidateProfile?.fullName || user?.email
        if (user?.role === Role.Employer) return employerProfile?.companyName || user?.email
        return user?.email
    }

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Spinner className={styles.spinner} />
                <span>Loading profile...</span>
            </div>
        )
    }

    return (
        <div className={styles.profilePage}>

            <div className={styles.hero}>
                <div className={styles.heroLeft}>
                    <div className={styles.avatar}>{getInitial()}</div>
                    <div>
                        <h1>{getDisplayName()}</h1>
                        <span className={styles.roleBadge}>{user?.role}</span>
                    </div>
                </div>
                <button className={styles.editButton} onClick={() => setEditModalOpen(true)}>
                    <PencilIcon />
                    Edit profile
                </button>
            </div>

            <div className={styles.content}>

                {user?.role === Role.Candidate && candidateProfile && (
                    <div className={styles.grid}>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Bio</span>
                            <p className={styles.cardValue}>{candidateProfile.bio || 'No bio provided.'}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Resume</span>
                            {candidateProfile.resumeUrl ? (
                                <a href={candidateProfile.resumeUrl} target='_blank' rel='noopener noreferrer' className={styles.link}>
                                    <ExternalLinkIcon />
                                    View resume
                                </a>
                            ) : (
                                <p className={styles.cardValue}>No resume provided.</p>
                            )}
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Email</span>
                            <p className={styles.cardValue}>{user?.email}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Member since</span>
                            <p className={styles.cardValue}>{formatDate(new Date().toISOString())}</p>
                        </div>
                    </div>
                )}

                {user?.role === Role.Employer && employerProfile && (
                    <div className={styles.grid}>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Company</span>
                            <p className={styles.cardValue}>{employerProfile.companyName}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Website</span>
                            {employerProfile.website ? (
                                <a href={employerProfile.website} target='_blank' rel='noopener noreferrer' className={styles.link}>
                                    <ExternalLinkIcon />
                                    {employerProfile.website}
                                </a>
                            ) : (
                                <p className={styles.cardValue}>No website provided.</p>
                            )}
                        </div>
                        <div className={styles.infoCard} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.cardLabel}>Company description</span>
                            <p className={styles.cardValue}>{employerProfile.companyDescription || 'No description provided.'}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Email</span>
                            <p className={styles.cardValue}>{user?.email}</p>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.cardLabel}>Member since</span>
                            <p className={styles.cardValue}>{formatDate(new Date().toISOString())}</p>
                        </div>
                    </div>
                )}

            </div>

            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className={styles.dialogContent}>
                    <DialogHeader className={styles.dialogHeader}>
                        <div className={styles.dialogLogo}>
                            <div className={styles.dialogLogoIcon}>
                                <BriefcaseIcon />
                            </div>
                            <span>Edit profile</span>
                        </div>
                    </DialogHeader>
                    <div className={styles.formBody}>
                        <div className={styles.form}>
                            {user?.role === Role.Candidate ? (
                                <>
                                    <div className={styles.field}>
                                        <label>Full name</label>
                                        <input
                                            type='text'
                                            placeholder='John Doe'
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Bio</label>
                                        <textarea
                                            placeholder='Tell us about yourself...'
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Resume URL</label>
                                        <input
                                            type='text'
                                            placeholder='https://yourresume.com'
                                            value={formData.resumeUrl}
                                            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
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
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Company description</label>
                                        <textarea
                                            placeholder='What does your company do?'
                                            value={formData.companyDescription}
                                            onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Website</label>
                                        <input
                                            type='text'
                                            placeholder='https://yourcompany.com'
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div className={styles.buttonRow}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Spinner className={styles.buttonSpinner} />
                                            Saving...
                                        </>
                                    ) : 'Save changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ProfilePage