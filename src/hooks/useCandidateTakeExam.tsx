import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useCandidateTakeExam(exam_id:string) {
  const {isPending,data}=useQuery({
    queryKey:['candidate-exam',exam_id],
    queryFn:()=>ExamPortal.candidateTakeExam(exam_id)
  })
  return {isPending,data}
}
