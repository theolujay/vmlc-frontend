import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export function useGetCandidateList() {
  const {isPending,data}=useQuery({
    queryKey:['list-candidates'],
    queryFn:CandidateMgtService.getCandidateList
  })
  return {isPending,data}
}
