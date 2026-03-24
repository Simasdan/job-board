import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type JobPost } from '@/types/JobPost'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import axiosInstance from '@/api/axiosInstance'
import styles from './MyJobsPage.module.scss'
import MapPinIcon from '@/assets/icons/map-pin.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import UsersIcon from '@/assets/icons/users.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import PencilIcon from '@/assets/icons/pencil.svg?react'
import Trash2Icon from '@/assets/icons/trash-2.svg?react'
import DeleteJobPostDialog from '@/components/DeleteJobPostDialog/DeleteJobPostDialog'
import CreateJobPostModal from '@/components/CreateJobPostModal/CreateJobPostModal'
import EditJobPostModal from '@/components/EditJobPostModal/EditJobPostModal'

const MyJobsPage = () => {
    const navigate = useNavigate()
    const [jobPosts, setJobPosts] = useState<JobPost[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editJobPost, setEditJobPost] = useState<JobPost | null>(null)

    useEffect(() => {
        fetchMyJobPosts()
    }, [])

    const fetchMyJobPosts = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/jobposts/my-posts')
            setJobPosts(response.data)
        } catch {
            toast.error('Failed to fetch job posts.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await axiosInstance.delete(`/jobposts/${deleteId}`)
            setJobPosts(jobPosts.filter(jp => jp.id !== deleteId))
            toast.success('Job post deleted successfully.')
        } catch {
            toast.error('Failed to delete job post.')
        } finally {
            setDeleteId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Published': return styles.badgePublished
            case 'Draft': return styles.badgeDraft
            case 'Closed': return styles.badgeClosed
            default: return styles.badgeDraft
        }
    }

    const publishedCount = jobPosts.filter(jp => jp.status === 'Published').length

    return (
        <div className={styles.myJobsPage}>
            <div className={styles.hero}>
                <div className={styles.heroLeft}>
                    <h1>My Job Posts</h1>
                    <p>{jobPosts.length} job posts · {publishedCount} published</p>
                </div>
                <button className={styles.createButton} onClick={() => setCreateModalOpen(true)}>
                    <PlusIcon />
                    Create job post
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <Spinner className={styles.spinner} />
                        <span>Loading job posts...</span>
                    </div>
                ) : jobPosts.length === 0 ? (
                    <div className={styles.empty}>
                        <span>You haven't created any job posts yet.</span>
                    </div>
                ) : (
                    <div className={styles.jobList}>
                        {jobPosts.map((jobPost) => (
                            <div
                                key={jobPost.id}
                                className={`${styles.jobCard} ${jobPost.status === 'Closed' ? styles.closedCard : ''}`}
                            >
                                <div className={styles.cardLeft}>
                                    <div className={styles.titleRow}>
                                        <span className={styles.title}>{jobPost.title}</span>
                                        <span className={`${styles.badge} ${getStatusStyle(jobPost.status)}`}>
                                            {jobPost.status}
                                        </span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <div className={styles.metaItem}>
                                            <MapPinIcon />
                                            <span>{jobPost.location}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <span>€{jobPost.salaryMin.toLocaleString()} – €{jobPost.salaryMax.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <CalendarIcon />
                                            <span>{formatDate(jobPost.createdAt)}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <UsersIcon />
                                            <span>{jobPost.applicationCount} applications</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.applicationsButton}
                                        onClick={() => navigate(`/my-jobs/${jobPost.id}/applications`)}
                                        disabled={jobPost.applicationCount === 0}
                                    >
                                        <UsersIcon />
                                        Applications
                                    </button>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => setEditJobPost(jobPost)}
                                    >
                                        <PencilIcon />
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => setDeleteId(jobPost.id)}
                                    >
                                        <Trash2Icon />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteJobPostDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />

            <CreateJobPostModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreated={(jobPost) => setJobPosts([jobPost, ...jobPosts])}
            />

            <EditJobPostModal
                isOpen={editJobPost !== null}
                onClose={() => setEditJobPost(null)}
                onUpdated={(updated) => setJobPosts(jobPosts.map(jp => jp.id === updated.id ? updated : jp))}
                jobPost={editJobPost}
            />
        </div>
    )
}

export default MyJobsPage