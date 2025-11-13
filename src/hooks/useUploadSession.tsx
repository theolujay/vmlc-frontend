import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const uploadExamSchema = z.object({


  level: z.string(),
  scheduled_date: z.string(),
  countdown_minutes: z.string(),
  //   start_time: z.date(),
  scheduled_exam_time: z.string(),
  open_duration_hours: z.string(),

})
type ValueType = z.infer<typeof uploadExamSchema>;

const defaultValues: ValueType = {
  level: '',
  scheduled_date: '',
  countdown_minutes: '',
  scheduled_exam_time: '',
  open_duration_hours: ''
}
export default function useUploadSession(exam_id: number,onSuccessCallback:()=>void) {
  const form = useForm({
    resolver: zodResolver(uploadExamSchema),
    defaultValues,
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (payload: any) => ExamPortal.updateExamSession(exam_id, payload),
    onSuccess: () => {
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
      level: Number(value.level),
      countdown_minutes: Number(value.countdown_minutes)
    }


    mutate(payload)

  }
  return { isPending, onSubmit, form }
}
