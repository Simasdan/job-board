import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { type JobPost } from '@/types/JobPost'
import axiosInstance from '@/api/axiosInstance'
import styles from './EditJobPostModal.module.scss'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

interface EditJobPostModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdated: (jobPost: JobPost) => void
    jobPost: JobPost | null
}

const EditJobPostModal = ({ isOpen, onClose, onUpdated, jobPost }: EditJobPostModalProps) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        status: ''
    })

    useEffect(() => {
        if (jobPost) {
            setFormData({
                title: jobPost.title,
                description: jobPost.description,
                location: jobPost.location,
                salaryMin: jobPost.salaryMin.toString(),
                salaryMax: jobPost.salaryMax.toString(),
                status: jobPost.status
            })
        }
    }, [jobPost])

    const handleUpdate = async () => {
        if (!formData.title || !formData.description || !formData.location) {
            toast.error('Please fill in all required fields.')
            return
        }

        try {
            setLoading(true)
            const response = await axiosInstance.put(`/jobposts/${jobPost?.id}`, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                salaryMin: Number(formData.salaryMin) || 0,
                salaryMax: Number(formData.salaryMax) || 0,
                status: formData.status
            })
            onUpdated(response.data)
            toast.success('Job post updated successfully!')
            onClose()
        } catch {
            toast.error('Failed to update job post.')
        } finally {
            setLoading(false)
        }
    }

    const statusOptions = ['Draft', 'Published', 'Closed']

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={styles.dialogContent}>
                <DialogHeader className={styles.dialogHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <BriefcaseIcon />
                        </div>
                        <span>Edit job post</span>
                    </div>
                </DialogHeader>

                <div className={styles.formBody}>
                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label>Title <span className={styles.required}>*</span></label>
                            <input
                                type='text'
                                placeholder='e.g. Senior .NET Developer'
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Description <span className={styles.required}>*</span></label>
                            <textarea
                                placeholder='Describe the role, responsibilities and requirements...'
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Location <span className={styles.required}>*</span></label>
                            <input
                                type='text'
                                placeholder='e.g. Vilnius or Remote'
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className={styles.salaryRow}>
                            <div className={styles.field}>
                                <label>Min salary (€)</label>
                                <input
                                    type='number'
                                    placeholder='e.g. 3000'
                                    value={formData.salaryMin}
                                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Max salary (€)</label>
                                <input
                                    type='number'
                                    placeholder='e.g. 5000'
                                    value={formData.salaryMax}
                                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Status</label>
                            <div className={styles.statusSelector}>
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        className={formData.status === status ? `${styles.statusButton} ${styles.activeStatus}` : styles.statusButton}
                                        onClick={() => setFormData({ ...formData, status })}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.buttonRow}>
                            <button
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? (
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
    )
}

export default EditJobPostModal