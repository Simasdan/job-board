import { useState, type ReactNode } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import styles from './LogoutDialog.module.scss'

interface LogoutDialogProps {
    onConfirm: () => void
    trigger: ReactNode
}

const LogoutDialog = ({ onConfirm, trigger }: LogoutDialogProps) => {
    const [signingOut, setSigningOut] = useState(false)

    const handleConfirm = async () => {
        setSigningOut(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        onConfirm()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSigningOut(false)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className={styles.content}>
                <AlertDialogHeader className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <AlertDialogTitle className={styles.title}>
                        Sign out of Job Board?
                    </AlertDialogTitle>
                    <AlertDialogDescription className={styles.description}>
                        You will need to sign in again to access your account and applications.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={styles.footer}>
                    <AlertDialogCancel className={styles.cancelButton}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={styles.logoutButton}
                        onClick={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                        disabled={signingOut}
                    >
                        {signingOut ? (
                            <>
                                <Spinner className={styles.buttonSpinner} />
                                Signing out...
                            </>
                        ) : 'Sign out'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default LogoutDialog