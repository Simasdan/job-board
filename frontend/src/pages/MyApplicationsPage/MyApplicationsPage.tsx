import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type JobApplication } from '@/types/JobPost'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './MyApplicationsPage.module.scss'
import WithdrawApplicationDialog from '@/components/WithdrawApplicationDialog/WithdrawApplicationDialog'
import { NavLinks } from '@/enums/NavLinks'


const MyApplicationsPage = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawId, setWithdrawId] = useState<number | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/jobapplications/my-applications')
      setApplications(response.data)
    } catch {
      toast.error('Failed to fetch applications.')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawId) return
    try {
      await axiosInstance.delete(`/jobapplications/${withdrawId}`)
      setApplications(applications.filter(app => app.id !== withdrawId))
      toast.success('Application withdrawn successfully.')
    } catch {
      toast.error('Failed to withdraw application.')
    } finally {
      setWithdrawId(null)
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

  const getLeftBorderStyle = (status: string) => {
    switch (status) {
      case 'Accepted': return styles.borderAccepted
      case 'Rejected': return styles.borderRejected
      case 'Reviewed': return styles.borderReviewed
      default: return styles.borderPending
    }
  }

  const totalCount = applications.length
  const pendingCount = applications.filter(a => a.status === 'Pending').length
  const reviewedCount = applications.filter(a => a.status === 'Reviewed').length
  const acceptedCount = applications.filter(a => a.status === 'Accepted').length
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length

  return (
    <div className={styles.myApplicationsPage}>
      <div className={styles.hero}>
        <h1>My Applications</h1>
        <p>{totalCount} applications · {acceptedCount} accepted</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{totalCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending</span>
          <span className={`${styles.statValue} ${styles.statPending}`}>{pendingCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reviewed</span>
          <span className={`${styles.statValue} ${styles.statReviewed}`}>{reviewedCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Accepted</span>
          <span className={`${styles.statValue} ${styles.statAccepted}`}>{acceptedCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Rejected</span>
          <span className={`${styles.statValue} ${styles.statRejected}`}>{rejectedCount}</span>
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
            <span>You haven't applied to any jobs yet.</span>
          </div>
        ) : (
          <div className={styles.applicationList}>
            {applications.map((application) => (
              <div
                key={application.id}
                className={`${styles.applicationCard} ${getLeftBorderStyle(application.status)} ${application.status === 'Rejected' ? styles.rejectedCard : ''}`}
              >
                <div className={styles.cardContent}>
                  <div className={styles.jobInfo}>
                    <p
                      className={styles.jobTitle}
                      onClick={() => navigate(`${NavLinks.Jobs}/${application.jobPostId}`)}
                    >
                      {application.jobTitle}
                    </p>
                    <div className={styles.metaRow}>
                      <span>{application.candidateName}</span>
                      <span>Applied {formatDate(application.createdAt)}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <span className={`${styles.badge} ${getStatusBadgeStyle(application.status)}`}>
                      {application.status}
                    </span>
                    <button
                      className={styles.withdrawButton}
                      onClick={() => setWithdrawId(application.id)}
                      disabled={application.status === 'Rejected'}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <WithdrawApplicationDialog
        isOpen={withdrawId !== null}
        onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdraw}
      />
    </div>
  )
}

export default MyApplicationsPage