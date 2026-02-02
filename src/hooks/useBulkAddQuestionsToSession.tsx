import { ExamPortal } from '@/services/examPortal.service'
import { BulkPayloadType } from '@/types/Index'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useBulkAddQuestionsToSession(onSuccessCallback: () => void) {
    const { isPending, mutate, isSuccess } = useMutation({
        mutationFn: ExamPortal.bulkAddQuestionToSession,
        onSuccess: () => {
           
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
