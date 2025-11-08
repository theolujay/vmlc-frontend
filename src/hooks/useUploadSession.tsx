import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const uploadExamSchema = z.object({



  scheduled_date: z.string(),
  countdown_minutes: z.string(),
  //   start_time: z.date(),
  start_time: z.string(),
  end_time: z.string(),

})
type ValueType = z.infer<typeof uploadExamSchema>;

const defaultValues: ValueType = {
  scheduled_date: '',
  countdown_minutes: '',
  start_time: '',
  end_time: ''
}
export default function useUploadSession(exam_id: number) {
  const form = useForm({
    resolver: zodResolver(uploadExamSchema),
    defaultValues,
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (payload: any) => ExamPortal.updateExamSession(exam_id, payload),
    onSuccess: () => {
      toast.success('Session uploaded successfully')
    }
    ,
    onError: () => {
      toast.error("Failed to upload session")
    }
  })

  function onSubmit(value: ValueType) {
    // mutate(payload)
    console.log(value, 'what is value for upload')
    const payload = {
      scheduled_date: new Date(value.scheduled_date).toISOString(),
      open_duration_hours: Number(value.countdown_minutes)
    }

    console.log('actual payload', payload)
  }
  return { isPending, onSubmit, form }
}
