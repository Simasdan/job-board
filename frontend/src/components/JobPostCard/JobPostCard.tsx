import { useNavigate } from 'react-router-dom'
import type { JobPost } from '@/types/JobPost'
import { NavLinks } from '@/enums/NavLinks'
import styles from './JobPostCard.module.scss'
import MapPinIcon from '@/assets/icons/map-pin.svg?react'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

interface JobPostCardProps {
    jobPost: JobPost
}

const JobPostCard = ({ jobPost }: JobPostCardProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`${NavLinks.Jobs}/${jobPost.id}`)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.cardHeader}>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>{jobPost.title}</h3>
                    <span className={styles.statusBadge}>{jobPost.status}</span>
                </div>
                <div className={styles.salary}>
                    <span className={styles.salaryAmount}>€{jobPost.salaryMin.toLocaleString()} – €{jobPost.salaryMax.toLocaleString()}</span>
                    <span className={styles.salaryPeriod}>per month</span>
                </div>
            </div>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <BriefcaseIcon />
                    <span>{jobPost.companyName}</span>
                </div>
                <div className={styles.metaItem}>
                    <MapPinIcon />
                    <span>{jobPost.location}</span>
                </div>
            </div>

            <p className={styles.description}>{jobPost.description}</p>

            <div className={styles.mobileFooter}>
                <span className={styles.mobileDate}>{formatDate(jobPost.createdAt)}</span>
                <span className={styles.mobileSalary}>€{jobPost.salaryMin.toLocaleString()} – €{jobPost.salaryMax.toLocaleString()}</span>
            </div>
        </div>
    )
}

export default JobPostCard