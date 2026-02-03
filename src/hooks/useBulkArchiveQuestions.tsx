import { ExamPortal } from '@/services/examPortal.service'
import { BulkArchiveType } from '@/types/Index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useBulkArchiveQuestions(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()
    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.bulkArchiveQuestions,
        onSuccess: () => {
            toast.success("Questions deleted successfully")
            queryClient.invalidateQueries({
                queryKey: ['list-questions'],
                exact: false, 
            })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            queryClient.invalidateQueries({ queryKey: ['exam-questions'] })
            onSuccessCallback();
        },
        onError: () => {
            toast.error('Error deleting questions')
        }
    })

    function onSubmit(payload: BulkArchiveType) {
        mutate(payload)
    }
    return { onSubmit, isPending }
}