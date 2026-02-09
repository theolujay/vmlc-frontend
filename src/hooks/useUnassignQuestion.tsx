import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useUnassignQuestion(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: ({ question_id, exam_id }: { question_id: number, exam_id: string | number }) => 
            ExamPortal.bulkActionQuestions({
                action: 'unassign',
                question_ids: [question_id],
                exam_ids: [exam_id]
            }),
        onSuccess: () => {
            onSuccessCallback()
            toast.success('Question removed from session successfully')
            queryClient.invalidateQueries({ queryKey: ['list-questions'] })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            queryClient.invalidateQueries({ queryKey: ['exam-questions'] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to remove question from session')
        }
    })

    function onSubmit(question_id: number, exam_id: string | number) {
        mutate({ question_id, exam_id })
    }

    return { onSubmit, isPending }
}
