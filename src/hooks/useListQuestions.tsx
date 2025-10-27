import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useListQuestions(page:number=1) {
const {isPending,data}=useQuery({
    queryKey:['list-questions',page],
    queryFn:()=>ExamPortal.listQuestions(page)
})
return {isPending,data}
}
