import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useCandidateTakeExam(exam_id:string) {
  const {isPending, data, refetch, isError, error} = useQuery({
    queryKey:['candidate-exam',exam_id],
    queryFn:()=>ExamPortal.candidateTakeExam(exam_id),
    retry: false // Don't retry on 403/404
  })
  return {isPending, data, refetch, isError, error}
}
