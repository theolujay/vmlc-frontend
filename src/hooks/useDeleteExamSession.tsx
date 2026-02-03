import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'



export default function useDeleteExamSession(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.deleteExamSession,
        onSuccess: () => {
            onSuccessCallback()
            toast.success('Exam session deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            router.back()
        }
    })


    function onSubmit(session_id: string) {
        mutate(session_id)
    }
    return { onSubmit, isPending }
}
