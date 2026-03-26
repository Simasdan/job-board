import styles from './HowItWorks.module.scss'
import UserIcon from '@/assets/icons/user.svg?react'
import SearchIcon from '@/assets/icons/search.svg?react'
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react'
import { useAuth } from '@/context/AuthContext'

const HowItWorks = () => {
    const { openAuthModal } = useAuth();

    return (
        <section id='how-it-works' className={styles.howItWorks}>
            <div className={styles.header}>
                <h2>How it works</h2>
                <p>Get started in just a few simple steps</p>
            </div>

            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepIcon}>
                        <UserIcon />
                    </div>
                    <div className={styles.stepContent}>
                        <span className={styles.stepLabel}>Step 1</span>
                        <h3>Create an account</h3>
                        <p>Sign up as a candidate looking for work or an employer looking to hire. It only takes a minute.</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepIcon}>
                        <SearchIcon />
                    </div>
                    <div className={styles.stepContent}>
                        <span className={styles.stepLabel}>Step 2</span>
                        <h3>Find or post jobs</h3>
                        <p>Candidates browse and filter listings. Employers create and publish job posts to attract the best talent.</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepIcon}>
                        <CheckCircleIcon />
                    </div>
                    <div className={styles.stepContent}>
                        <span className={styles.stepLabel}>Step 3</span>
                        <h3>Get hired or hire</h3>
                        <p>Candidates apply with a cover letter. Employers review applications and update statuses to find the right fit.</p>
                    </div>
                </div>
            </div>

            <div className={styles.cta}>
                <button className={styles.ctaButton} onClick={() => openAuthModal('register')}>
                    Get started
                </button>
            </div>
        </section>
    )
}

export default HowItWorks