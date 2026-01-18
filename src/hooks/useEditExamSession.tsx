import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'


const editExamSessionSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
})
const defaultValues = {
    title: '',
    description: ''
}
type ValueType = z.infer<typeof editExamSessionSchema>;
export default function useEditExamSession(exam_id: string,onSuccessCallback:()=>void) {
    const form = useForm({
        resolver: zodResolver(editExamSessionSchema),
        defaultValues

    })
    const { isPending, mutate } = useMutation({
        mutationFn: (payload: ValueType) => ExamPortal.editExamSession(exam_id, payload),
        onSuccess:()=>{
            onSuccessCallback()
            toast.success('Exam session updated successfully')  
            form.reset()
        }
    })


    function onSubmit(payload: ValueType) {
        mutate(payload)
    }
    return { onSubmit, isPending, form }
}
