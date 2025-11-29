import { CandidateMgtService } from '@/services/candidateMgt.service'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetCandidateList(page:number=1,filters:Record<string,string>) {
  const {isPending,data}=useQuery({
    queryKey:['list-candidates',page,filters],
    queryFn:()=>CandidateMgtService.getCandidateList(page,filters),
    placeholderData:keepPreviousData
  })
  return {isPending,data}
}



