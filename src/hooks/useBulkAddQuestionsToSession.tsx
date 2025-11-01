import { ExamPortal } from '@/services/examPortal.service'
import { BulkPayloadType } from '@/types/Index'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useBulkAddQuestionsToSession(onSuccessCallback: () => void) {
    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.bulkAddQuestionToSession,
        onSuccess: () => {
            toast.success('Session added successfully')
            onSuccessCallback()
        },
        onError:()=>toast.error('Error uploading question to sessions')
    })


    function onSubmit(payload: BulkPayloadType) {
        mutate(payload)
        // console.log(payload,'gtest payload for now')
    }
    return { onSubmit, isPending }
}
