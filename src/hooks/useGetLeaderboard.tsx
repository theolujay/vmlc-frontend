import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetLeaderBoard(page: number = 1, filters: Record<string, string | number> = {}) {
  const { isPending, data } = useQuery({
    queryKey: ['leaderboard', page, filters],
    queryFn:()=>CandidateMgtService.getLeaderBoard(page,filters)
    // queryFn: () => ExamPortal.getLeaderBoard(page, filters),

  })
  return { isPending, data }
}
