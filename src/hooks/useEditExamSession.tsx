import { ExamPortal } from '@/services/examPortal.service'
import { EditExamSession, UpdatedSessionQuestionType } from '@/types/Examtype'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'


const editExamSessionSchema = z.object({

    stage_id: z.number().nullable().optional(),
    round: z.number().nullable().optional(),
    description: z.string().min(7, { message: 'Description must be at least 7 characters' }).optional(),
    scheduled_date: z.string().optional(),
    open_duration_hours: z.number().optional(),
    countdown_minutes: z.number().optional(),
})

const defaultValues = {

    stage_id: undefined,
    round: undefined,
    description: '',
    scheduled_date: '',
    open_duration_hours: undefined,
    countdown_minutes: undefined,
    is_active: true,
}

type ValueType = z.infer<typeof editExamSessionSchema>;

export default function useEditExamSession(exam_id: string, onSuccessCallback: () => void, data?: UpdatedSessionQuestionType) {
    const queryClient = useQueryClient()
    const form = useForm<ValueType>({
        resolver: zodResolver(editExamSessionSchema),
        defaultValues
    })

    useEffect(() => {
        if (data) {
            form.reset({

                description: data.description,
                open_duration_hours: data.open_duration_hours,
                countdown_minutes: data.countdown_minutes,
                scheduled_date: data.scheduled_date ? data.scheduled_date.split('T')[0] : '',
                stage_id: data.stage_id,
                round: data.round,
            })
        }
    }, [data, form])

    const { isPending, mutate } = useMutation({
        mutationFn: (payload: ValueType) => {
            const formattedPayload = {
                ...payload,
                scheduled_date: payload.scheduled_date ? new Date(payload.scheduled_date).toISOString() : undefined
            };
            return ExamPortal.editExamSession(exam_id, formattedPayload as EditExamSession);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            queryClient.invalidateQueries({ queryKey: ['exam-questions', exam_id] })
            onSuccessCallback()
            toast.success('Exam session updated successfully')
        }
    })


    function onSubmit(payload: ValueType) {
        mutate(payload)
    }
    return { onSubmit, isPending, form }
}
