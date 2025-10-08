import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useGetExamPortal() {
  const {isPending,data}=useQuery({
    queryKey:['exam-dashboard'],
    queryFn:ExamPortal.examInfo,
    
  })
  return {isPending,data}
}
