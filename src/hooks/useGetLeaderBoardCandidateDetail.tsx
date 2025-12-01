import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetLeaderBoardCandidateDetail(stage:string,level:string,candidate_id:string) {
  const {isPending,data}=useQuery({
    queryKey:['leaderboard-candidate-detail'],
    queryFn:()=>CandidateMgtService.getLeaderBoardCandidateDetail(stage,level,candidate_id)
  })
  return {isPending,data}
}
