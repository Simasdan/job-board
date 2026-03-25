import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { type JobPost } from '@/types/JobPost'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/enums/Role'
import { NavLinks } from '@/enums/NavLinks'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './JobPostPage.module.scss'
import MapPinIcon from '@/assets/icons/map-pin.svg?react'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'

const JobPostPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()

    const [jobPost, setJobPost] = useState<JobPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')
    const [resumeUrl, setResumeUrl] = useState('')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchJobPost()
    }, [id])

    useEffect(() => {
        if (isAuthenticated && user?.role === Role.Candidate) {
            checkIfApplied()
        }
    }, [isAuthenticated, id])

    const fetchJobPost = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/jobposts/${id}`)
            setJobPost(response.data)
        } catch {
            toast.error('Job post not found.')
            navigate(NavLinks.Jobs)
        } finally {
            setLoading(false)
        }
    }

    const checkIfApplied = async () => {
        try {
            const response = await axiosInstance.get('/jobapplications/my-applications')
            const applied = response.data.some((app: { jobPostId: number }) => app.jobPostId === Number(id))
            setHasApplied(applied)
        } catch {
            console.error('Failed to check application status')
        }
    }

    const handleApply = async () => {
        try {
            setApplying(true)
            await axiosInstance.post(`/jobapplications/${id}`, {
                coverLetter,
                resumeUrl
            })
            setHasApplied(true)
            setShowForm(false)
            toast.success('Application submitted successfully!')
        } catch {
            toast.error('Failed to submit application.')
        } finally {
            setApplying(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Spinner className={styles.spinner} />
                <span>Loading job post...</span>
            </div>
        )
    }

    if (!jobPost) return null

    const isClosed = jobPost.status === 'Closed'

    const renderApplySection = () => {
        if (user?.role === Role.Employer) return null

        if (!isAuthenticated) {
            return (
                <div className={styles.applyCard}>
                    <h3>Apply for this job</h3>
                    <p className={styles.applyHint}>Sign in as a candidate to apply for this position.</p>
                </div>
            )
        }

        if (isClosed) {
            return (
                <div className={styles.applyCard}>
                    <h3>Applications closed</h3>
                    <p className={styles.applyHint}>This job is no longer accepting applications.</p>
                </div>
            )
        }

        if (hasApplied) {
            return (
                <div className={styles.applyCard}>
                    <h3>Already applied</h3>
                    <p className={styles.applyHint}>You have already applied for this position.</p>
                    <button
                        className={styles.appliedButton}
                        disabled
                    >
                        Application submitted
                    </button>
                </div>
            )
        }

        return (
            <div className={styles.applyCard}>
                <h3>Apply for this job</h3>
                {!showForm ? (
                    <button
                        className={styles.applyButton}
                        onClick={() => setShowForm(true)}
                    >
                        Apply now
                    </button>
                ) : (
                    <div className={styles.applyForm}>
                        <div className={styles.field}>
                            <label>Cover letter</label>
                            <textarea
                                placeholder='Tell us why you are a great fit...'
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={6}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Resume URL</label>
                            <input
                                type='text'
                                placeholder='https://yourresume.com'
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                            />
                        </div>
                        <div className={styles.formButtons}>
                            <button
                                className={styles.applyButton}
                                onClick={handleApply}
                                disabled={applying}
                            >
                                {applying ? <><Spinner className={styles.buttonSpinner} /> Submitting...</> : 'Submit application'}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={styles.jobPostPage}>
            <div className={styles.hero}>
                <div className={styles.breadcrumb}>
                    <span onClick={() => navigate(NavLinks.Home)}>Browse Jobs</span>
                    <span>/</span>
                    <span>{jobPost.title}</span>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <div className={styles.titleRow}>
                            <h1>{jobPost.title}</h1>
                            <span className={styles.statusBadge}>{jobPost.status}</span>
                        </div>
                        <div className={styles.metaRow}>
                            <div className={styles.metaItem}>
                                <BriefcaseIcon />
                                <span>{jobPost.companyName}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <MapPinIcon />
                                <span>{jobPost.location}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <CalendarIcon />
                                <span>Posted {formatDate(jobPost.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.salary}>
                        <span className={styles.salaryAmount}>€{jobPost.salaryMin.toLocaleString()} – €{jobPost.salaryMax.toLocaleString()}</span>
                        <span className={styles.salaryPeriod}>per month</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.descriptionCard}>
                    <h2>Job description</h2>
                    <p>{jobPost.description}</p>
                </div>

                <div className={styles.sidebar}>
                    {renderApplySection()}

                    <div className={styles.companyCard}>
                        <h3>About the company</h3>
                        <div className={styles.companyHeader}>
                            <div className={styles.companyAvatar}>
                                {jobPost.companyName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className={styles.companyName}>{jobPost.companyName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobPostPage