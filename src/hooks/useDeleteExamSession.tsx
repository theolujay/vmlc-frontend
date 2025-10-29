import { ExamPortal } from '@/services/examPortal.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'



export default function useDeleteExamSession(onSuccessCallback: () => void) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.deleteExamSession,
        onSuccess: (_, session_id) => {
            onSuccessCallback()
            toast.success('Exam session deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['list-exams', session_id] })
            router.back()
        }
    })


    function onSubmit(session_id: number) {
        mutate(session_id)
    }
    return { onSubmit, isPending }
}
