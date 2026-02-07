import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'




const createExamSchema = z.object({
  stage_id: z.number().optional(),
  round: z.number().optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
})


const defaultValues = {
  stage_id: undefined,
  round: undefined,
  description: '',
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
      return ExamPortal.createExamSession(payload as any);
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
