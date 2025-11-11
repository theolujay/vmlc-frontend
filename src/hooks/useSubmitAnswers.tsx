import { ExamPortal } from '@/services/examPortal.service'
import { CandidateSubmitAnswerType } from '@/types/Index'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function useSubmitAnswers(exam_id: string) {
    const router=useRouter()
    const { isPending, mutate } = useMutation({
        mutationKey: ['submit-exam', exam_id],
        mutationFn: (payload: CandidateSubmitAnswerType) => ExamPortal.candidateSubmitAnswers(exam_id, payload),
        onSuccess: () => {
            toast.success('Exam submitted successfully')
            router.back()
        },
        onError:()=>{
            toast.error('Error submitting exam')
        }
    })


    function onSubmit(payload: CandidateSubmitAnswerType) {
        mutate(payload)
    }
    return { onSubmit, isPending }
}
