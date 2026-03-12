import { ExamPortal } from '@/services/examPortal.service'
import { BulkPayloadType } from '@/types/Index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useBulkAddQuestionsToSession(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()
    const { isPending, mutate, isSuccess } = useMutation({
        mutationFn: ExamPortal.bulkAddQuestionToSession,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['list-questions'] })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            
            if (variables.exam_ids) {
                variables.exam_ids.forEach(id => {
                    queryClient.invalidateQueries({ queryKey: ['exam-questions', id.toString()] })
                })
            }

            toast.success('Session added successfully')
            onSuccessCallback()
        },
        onError:(error)=>{
            console.error(error,'error from bulk add')
            toast.error('Error uploading question to sessions')}
    })


    function onSubmit(payload: BulkPayloadType) {
        mutate(payload)
        
    }
    return { onSubmit, isPending, isSuccess }
}
