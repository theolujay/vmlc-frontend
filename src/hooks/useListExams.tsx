import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useListExams() {
  const {isPending,data}=useQuery({
    queryKey:['list-exams'],
    queryFn:ExamPortal.listExams
  })
  return {isPending,data}
}
