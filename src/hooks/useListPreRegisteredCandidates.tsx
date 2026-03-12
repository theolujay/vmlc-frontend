
import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useListPreRegisteredCandidates(page:number,filters:Record<string,string>, enabled: boolean = true) {
  const {isPending,data}=useQuery({
    queryKey:['pre_registered_candidates',page,filters],
    queryFn:()=>{
      // Exclude profile from filters as it is hardcoded in the service
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { profile, ...restFilters } = filters;
      return UserMgtService.getPreRegisteredCandidateList(page,restFilters)
    },
    enabled
  })
  return {isPending,data}
}
