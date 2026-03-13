import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetLeaderBoardCandidateDetail(stage:string,round:string,candidate_id:string) {
  const {isPending,data}=useQuery({
    queryKey:['leaderboard-candidate-detail'],
    queryFn:()=>CandidateMgtService.getLeaderBoardCandidateDetail(stage,round,candidate_id)
  })
  return {isPending,data}
}
