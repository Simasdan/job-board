import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { type JobApplication } from '@/types/JobPost'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './JobApplicationsPage.module.scss'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'
import ExternalLinkIcon from '@/assets/icons/external-link.svg?react'

const statusOptions = ['Pending', 'Reviewed', 'Accepted', 'Rejected']

const JobApplicationsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [jobTitle, setJobTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    useEffect(() => {
        fetchApplications()
    }, [id])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/jobapplications/jobpost/${id}`)
            setApplications(response.data)
            if (response.data.length > 0) {
                setJobTitle(response.data[0].jobTitle)
            }
        } catch {
            toast.error('Failed to fetch applications.')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (applicationId: number, status: string) => {
        try {
            setUpdatingId(applicationId)
            const response = await axiosInstance.put(`/jobapplications/${applicationId}`, { status })
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status: response.data.status } : app
            ))
            toast.success(`Application marked as ${status}.`)
        } catch {
            toast.error('Failed to update status.')
        } finally {
            setUpdatingId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'Accepted': return styles.badgeAccepted
            case 'Rejected': return styles.badgeRejected
            case 'Reviewed': return styles.badgeReviewed
            default: return styles.badgePending
        }
    }

    const getStatusButtonStyle = (status: string, currentStatus: string) => {
        if (status !== currentStatus) return styles.statusButton
        switch (status) {
            case 'Accepted': return `${styles.statusButton} ${styles.activeAccepted}`
            case 'Rejected': return `${styles.statusButton} ${styles.activeRejected}`
            case 'Reviewed': return `${styles.statusButton} ${styles.activeReviewed}`
            default: return `${styles.statusButton} ${styles.activePending}`
        }
    }

    return (
        <div className={styles.jobApplicationsPage}>
            <div className={styles.hero}>
                <div className={styles.breadcrumb}>
                    <div className={styles.backLink} onClick={() => navigate('/my-jobs')}>
                        <ChevronLeftIcon />
                        <span>My Jobs</span>
                    </div>
                    <span>/</span>
                    <span>Applications</span>
                </div>
                <div className={styles.heroContent}>
                    <h1>{jobTitle || 'Job Applications'}</h1>
                    <p>{applications.length} applications received</p>
                </div>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <Spinner className={styles.spinner} />
                        <span>Loading applications...</span>
                    </div>
                ) : applications.length === 0 ? (
                    <div className={styles.empty}>
                        <span>No applications received yet.</span>
                    </div>
                ) : (
                    <div className={styles.applicationList}>
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className={`${styles.applicationCard} ${application.status === 'Rejected' ? styles.rejectedCard : ''}`}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.candidateInfo}>
                                        <div className={styles.avatar}>
                                            {application.candidateName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={styles.candidateName}>{application.candidateName}</p>
                                            <p className={styles.appliedDate}>Applied {formatDate(application.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`${styles.badge} ${getStatusBadgeStyle(application.status)}`}>
                                        {application.status}
                                    </span>
                                </div>

                                <div className={styles.coverLetter}>
                                    <p className={styles.coverLetterLabel}>Cover letter</p>
                                    <p className={styles.coverLetterText}>
                                        {application.coverLetter || 'No cover letter provided.'}
                                    </p>
                                </div>

                                <div className={styles.cardFooter}>
                                    {application.resumeUrl ? (
                                        <a
                                            href={application.resumeUrl}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className={styles.resumeLink}
                                        >
                                            <ExternalLinkIcon />
                                            View resume
                                        </a>
                                    ) : (
                                        <span className={styles.noResume}>No resume provided</span>
                                    )}

                                    <div className={styles.statusButtons}>
                                        {updatingId === application.id ? (
                                            <Spinner className={styles.updateSpinner} />
                                        ) : (
                                            statusOptions.map((status) => (
                                                <button
                                                    key={status}
                                                    className={getStatusButtonStyle(status, application.status)}
                                                    onClick={() => handleStatusUpdate(application.id, status)}
                                                    disabled={status === application.status}
                                                >
                                                    {status}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobApplicationsPage