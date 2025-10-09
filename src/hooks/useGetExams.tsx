import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetLeaderBoard() {
  const {isPending,data}=useQuery({
    queryKey:['leaderboard'],
    queryFn:ExamPortal.getLeaderBoard,
    
  })
  return {isPending,data}
}
