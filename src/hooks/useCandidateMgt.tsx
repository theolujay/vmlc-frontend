import { CandidateMgtService } from '@/services/candidateMgt.service'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetCandidateList(page?:number) {
  const {isPending,data}=useQuery({
    queryKey:['list-candidates',page],
    queryFn:()=>CandidateMgtService.getCandidateList(page),
    placeholderData:keepPreviousData
  })
  return {isPending,data}
}
