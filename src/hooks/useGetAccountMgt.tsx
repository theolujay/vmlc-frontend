import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetAccountMgt() {
  const {isPending,data}=useQuery({
    queryKey:['candidate-management'],
    queryFn:CandidateMgtService.getAccountDetails
  })
  return {isPending,data}
}
