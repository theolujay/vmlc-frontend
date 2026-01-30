import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'


const editExamSessionSchema = z.object({
    stage_id: z.number().optional(),
    round: z.number().optional(),
    description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
    scheduled_date: z.string().optional(),
    open_duration_hours: z.number().optional(),
    countdown_minutes: z.number().optional(),
    is_active: z.boolean().optional(),
})

const defaultValues = {
    stage_id: undefined,
    round: undefined,
    description: '',
    scheduled_date: '',
    open_duration_hours: 12,
    countdown_minutes: 60,
    is_active: true,
}

type ValueType = z.infer<typeof editExamSessionSchema>;

export default function useEditExamSession(exam_id: string, onSuccessCallback: () => void) {
    const form = useForm<ValueType>({
        resolver: zodResolver(editExamSessionSchema),
        defaultValues
    })
    const { isPending, mutate } = useMutation({
        mutationFn: (payload: ValueType) => {
            const formattedPayload = {
                ...payload,
                scheduled_date: payload.scheduled_date ? new Date(payload.scheduled_date).toISOString() : undefined
            };
            return ExamPortal.editExamSession(exam_id, formattedPayload as any);
        },
        onSuccess: () => {
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
