import { CandidateMgtService } from '@/services/candidateMgt.service'
import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetAccountDetails(id: string) {
  const { isPending, data } = useQuery({
    queryKey: ['account-details', id],
    queryFn: () => UserMgtService.getAccountDetails(id)
  })
  return { isPending, data }
}
