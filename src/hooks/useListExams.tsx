import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useListExams(id:number) {
  const {isPending,data}=useQuery({
    queryKey:['list-exams',id],
    queryFn: () => ExamPortal.listExams(id),
    // queryFn:ExamPortal.listExams
    enabled:!!id
  })
  return {isPending,data}
}







