import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'




const createExamSchema = z.object({
  stage: z.enum(['screening', 'league', 'final', 'winner']).refine(val => !!val, {
    message: "Stage is required",
  }),
  // stage:z.string({message:'Please pick a stage'}),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
})


const defaultValues = {
  stage: 'screening' as const,
  title: '',
  description: ''
}



type ValueType = z.infer<typeof createExamSchema>;



export default function useCreateExamSession() {
const queryClient=useQueryClient()
  const form = useForm<ValueType>({
    resolver: zodResolver(createExamSchema),
    defaultValues
  })
  const { isPending, mutate,isSuccess } = useMutation({
    mutationFn: ExamPortal.createExamSession,
    onSuccess: () => {
      toast.success('Exam session created successfully')
      

       queryClient.invalidateQueries({ queryKey: ['list-exams'] })
       form.reset()
    },
    onError:()=>{
      toast.error('Failed to create exam session. Please try again.')
    }
  })


  function onSubmit(payload: ValueType) {
    mutate(payload)
  }



  return { isPending, onSubmit, form,isSuccess }
}
