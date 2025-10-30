import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'



export default function useDeleteQuestion(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.deleteQuestion,
        onSuccess: (_, question_id) => {
            onSuccessCallback()
            toast.success('Question deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['exam-questions',question_id] })
            
        }
    })


    function onSubmit(question_id: number) {
        mutate(question_id)
    }
    return { onSubmit, isPending }
}
