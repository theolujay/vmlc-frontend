import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'



export default function useDeleteQuestion(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.deleteQuestion,
        onSuccess: () => {
            onSuccessCallback()
            toast.success('Question deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['list-questions'] })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            queryClient.invalidateQueries({ queryKey: ['exam-questions'] })
        }
    })


    function onSubmit(question_id: number) {
        mutate(question_id)
    }
    return { onSubmit, isPending }
}
