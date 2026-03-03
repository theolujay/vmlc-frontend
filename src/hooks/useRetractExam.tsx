import { ApiError } from '@/types/Index'
import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useRetractExam(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.retractExam,
        onSuccess: () => {
            onSuccessCallback?.()
            toast.success('Exam retracted successfully')
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            queryClient.invalidateQueries({ queryKey: ['exam-questions'] })
            queryClient.invalidateQueries({ queryKey: ['exam-details'] })
        },
        onError: (error: unknown) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.error || 'Failed to retract exam')
        }
    })

    function onSubmit(exam_id: string) {
        mutate(exam_id)
    }

    return { onSubmit, isPending }
}
