import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import styles from './WithdrawApplicationDialog.module.scss'
import FileTextIcon from '@/assets/icons/file-text.svg?react'

interface WithdrawApplicationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
}

const WithdrawApplicationDialog = ({ isOpen, onClose, onConfirm }: WithdrawApplicationDialogProps) => {
    const [withdrawing, setWithdrawing] = useState(false)

    const handleConfirm = async () => {
        setWithdrawing(true)
        await onConfirm()
        setWithdrawing(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className={styles.content}>
                <AlertDialogHeader className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <FileTextIcon />
                    </div>
                    <AlertDialogTitle className={styles.title}>
                        Withdraw application?
                    </AlertDialogTitle>
                    <AlertDialogDescription className={styles.description}>
                        You will no longer be considered for this position. You can apply again if the job is still open.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={styles.footer}>
                    <AlertDialogCancel
                        className={styles.cancelButton}
                        disabled={withdrawing}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={styles.withdrawButton}
                        onClick={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                        disabled={withdrawing}
                    >
                        {withdrawing ? (
                            <>
                                <Spinner className={styles.buttonSpinner} />
                                Withdrawing...
                            </>
                        ) : 'Withdraw'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default WithdrawApplicationDialog