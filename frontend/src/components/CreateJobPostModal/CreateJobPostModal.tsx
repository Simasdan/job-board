import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { type JobPost } from '@/types/JobPost'
import axiosInstance from '@/api/axiosInstance'
import styles from './CreateJobPostModal.module.scss'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

interface CreateJobPostModalProps {
    isOpen: boolean
    onClose: () => void
    onCreated: (jobPost: JobPost) => void
}

const CreateJobPostModal = ({ isOpen, onClose, onCreated }: CreateJobPostModalProps) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salaryMin: '',
        salaryMax: ''
    })

    const handleCreate = async () => {
        if (!formData.title || !formData.description || !formData.location) {
            toast.error('Please fill in all required fields.')
            return
        }

        try {
            setLoading(true)
            const response = await axiosInstance.post('/jobposts', {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                salaryMin: Number(formData.salaryMin) || 0,
                salaryMax: Number(formData.salaryMax) || 0
            })
            onCreated(response.data)
            toast.success('Job post created successfully!')
            handleClose()
        } catch {
            toast.error('Failed to create job post.')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            salaryMin: '',
            salaryMax: ''
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={styles.dialogContent}>
                <DialogHeader className={styles.dialogHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <BriefcaseIcon />
                        </div>
                        <span>Create job post</span>
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

                        <p className={styles.hint}>
                            * Required fields. New job posts are saved as Draft — you can publish them later by editing.
                        </p>

                        <div className={styles.buttonRow}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleCreate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner className={styles.buttonSpinner} />
                                        Creating...
                                    </>
                                ) : 'Create job post'}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateJobPostModal