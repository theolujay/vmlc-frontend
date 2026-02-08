import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetExamPortal() {
  const {isPending,data, refetch}=useQuery({
    queryKey:['exam-dashboard'],
    queryFn:ExamPortal.examInfo,
    
  })
  return {isPending,data, refetch}
}
