import styles from './Footer.module.scss'
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'
import GithubIcon from '@/assets/icons/github.svg?react'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>

                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <BriefcaseIcon />
                        </div>
                        <span>Job Board</span>
                    </div>
                    <p className={styles.description}>
                        A full stack portfolio project built with ASP.NET Core and React TypeScript.
                    </p>
                </div>

                <div className={styles.github}>
                    <p className={styles.linksLabel}>Source code</p>
                    <a
                        href='https://github.com/Simasdan/job-board'
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.githubLink}
                    >
                        <GithubIcon />
                        View on GitHub
                    </a>
                </div>

            </div>

            <div className={styles.bottomBar}>
                <p>© 2026 Job Board. All rights reserved.</p>
                <p>Built by SIMDAN</p>
            </div>
        </footer>
    )
}

export default Footer