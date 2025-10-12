import { ExamPortal } from '@/services/examPortal.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {z} from 'zod'




const createExamSchema=z.object({
   stage: z.enum(['screening', 'league', 'final', 'winner']).refine(val => !!val, {
    message: "Stage is required",
  }),
    // stage:z.string({message:'Please pick a stage'}),
    title:z.string().min(3,{message:'Title must be at least 3 characters'}),
    description:z.string(),
})


const defaultValues={
    stage:'screening' as const,
    title:'',
    description:''
}



type ValueType=z.infer<typeof createExamSchema>;



export default function useCreateExamSession() {

    const form=useForm<ValueType>({
        resolver:zodResolver(createExamSchema),
        defaultValues
    })
  const {isPending,mutate}=useMutation({
    mutationFn:ExamPortal.createExamSession,
    onSuccess:(value)=>console.log(value)
  })


  function onSubmit(payload:ValueType){
    mutate(payload)
  }



  return {isPending,onSubmit,form}
}
