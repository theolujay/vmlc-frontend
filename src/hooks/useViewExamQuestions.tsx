import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useViewExamQuestions(exam_id:string) {
 const {isPending,data}=useQuery({
    queryKey:['exam-questions',exam_id],
    queryFn:()=>ExamPortal.viewExamQuestions(exam_id)
 })
 return {isPending,data}
}
