import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'




const createExamSchema = z.object({
  stage_id: z.number().optional(),
  round: z.number().optional(),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
  scheduled_date: z.string().optional(),
  open_duration_hours: z.number().default(12),
  countdown_minutes: z.number().default(60),
  is_active: z.boolean().default(true),
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



type ValueType = z.infer<typeof createExamSchema>;



export default function useCreateExamSession() {
  const queryClient = useQueryClient()
  const form = useForm<ValueType>({
    resolver: zodResolver(createExamSchema),
    defaultValues
  })
  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: (payload: ValueType) => {
      // Convert scheduled_date to ISO if it exists
      const formattedPayload = {
        ...payload,
        scheduled_date: payload.scheduled_date ? new Date(payload.scheduled_date).toISOString() : undefined
      };
      return ExamPortal.createExamSession(formattedPayload as any);
    },
    onSuccess: () => {
      toast.success('Exam session created successfully')
      queryClient.invalidateQueries({ queryKey: ['list-exams'] })
      form.reset()
    },
    onError: () => {
      toast.error('Failed to create exam session. Please try again.')
    }
  })


  function onSubmit(payload: ValueType) {
    mutate(payload)
  }



  return { isPending, onSubmit, form, isSuccess }
}
