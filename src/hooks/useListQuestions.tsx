import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useListQuestions(page: number = 1, filters: Record<string, string> = {}) {
    
    const { isPending, data } = useQuery({
        queryKey: ['list-questions', page, filters],
        queryFn: () => ExamPortal.listQuestions(page, filters),
        
    })
    return { isPending, data }
}
