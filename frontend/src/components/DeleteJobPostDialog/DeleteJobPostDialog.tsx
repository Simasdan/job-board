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
import Trash2Icon from '@/assets/icons/trash-2.svg?react'
import styles from './DeleteJobPostDialog.module.scss'

interface DeleteJobPostDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
}

const DeleteJobPostDialog = ({ isOpen, onClose, onConfirm }: DeleteJobPostDialogProps) => {
    const [deleting, setDeleting] = useState(false)

    const handleConfirm = async () => {
        setDeleting(true)
        await onConfirm()
        setDeleting(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className={styles.content}>
                <AlertDialogHeader className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Trash2Icon />
                    </div>
                    <AlertDialogTitle className={styles.title}>
                        Delete job post?
                    </AlertDialogTitle>
                    <AlertDialogDescription className={styles.description}>
                        This action cannot be undone. All applications for this job post will also be removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={styles.footer}>
                    <AlertDialogCancel
                        className={styles.cancelButton}
                        disabled={deleting}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Spinner className={styles.buttonSpinner} />
                                Deleting...
                            </>
                        ) : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteJobPostDialog