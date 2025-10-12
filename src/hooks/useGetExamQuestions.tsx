import { ExamPortal } from "@/services/examPortal.service"
import { useQuery } from "@tanstack/react-query"

export default function useGetExamQuestions(id: number) {
  const { isPending, data } = useQuery({
    queryKey: ['exam-questions', id],

    queryFn: () => ExamPortal.getExamQuestions(id),
    enabled: !!id
  })
  return { isPending, data }
}