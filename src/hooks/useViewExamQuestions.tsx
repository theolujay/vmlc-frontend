import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useViewExamQuestions(exam_id:string, page: number = 1, filters: Record<string, string> = {}) {
 const {isPending,data}=useQuery({
    queryKey:['exam-questions',exam_id, page, filters],
    queryFn:()=>ExamPortal.viewExamQuestions(exam_id, page, filters)
 })
 return {isPending,data}
}
