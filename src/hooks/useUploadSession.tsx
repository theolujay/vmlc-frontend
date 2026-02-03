import { ExamPortal } from '@/services/examPortal.service'
import { UpdatedSessionQuestionType } from '@/types/Examtype'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const uploadExamSchema = z.object({


  scheduled_date: z.string(),
  countdown_minutes: z.string(),
  //   start_time: z.date(),
  scheduled_exam_time: z.string(),
  open_duration_hours: z.string(),
  stage_id: z.number().optional(),
  round: z.number().optional(),
})
type ValueType = z.infer<typeof uploadExamSchema>;

const defaultValues: ValueType = {
  scheduled_date: '',
  countdown_minutes: '',
  scheduled_exam_time: '',
  open_duration_hours: '',
  stage_id: undefined,
  round: undefined,
}
export default function useUploadSession(exam_id: string,onSuccessCallback:()=>void, data?: UpdatedSessionQuestionType) {
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(uploadExamSchema),
    defaultValues,
  })

  useEffect(() => {
    if (data) {
      form.reset({
        ...defaultValues,
        stage_id: data.stage_id,
        round: data.round,
        scheduled_date: data.scheduled_date ? data.scheduled_date.split('T')[0] : '',
        countdown_minutes: data.countdown_minutes?.toString() || '',
        open_duration_hours: data.open_duration_hours?.toString() || '',
      })
    }
  }, [data, form])

  const { isPending, mutate } = useMutation({
    mutationFn: (payload: any) => ExamPortal.updateExamSession(exam_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-exams'] })
      toast.success('Session uploaded successfully')
      onSuccessCallback()
      form.reset()
    }
    ,
    onError: () => {
      toast.error("Failed to upload session")
    }
  })

  function onSubmit(value: ValueType) {
    // mutate(payload)
    
    const payload = {
      scheduled_date: new Date(`${value.scheduled_date}T${value.scheduled_exam_time}`).toISOString(),
      open_duration_hours: Number(value.open_duration_hours),
      countdown_minutes: Number(value.countdown_minutes),
      stage_id: value.stage_id,
      round: value.round,
    }


    mutate(payload)

  }
  return { isPending, onSubmit, form }
}
