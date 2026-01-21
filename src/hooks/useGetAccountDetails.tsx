import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetAccountDetails(id: string, enabled: boolean = true) {
  const { isPending, data } = useQuery({
    queryKey: ['account-details', id],
    queryFn: () => UserMgtService.getAccountDetails(id),
    enabled: !!id && enabled
  })
  return { isPending, data }
}

export function useGetOwnAccountDetails(enabled: boolean = true) {
  const { isPending, data } = useQuery({
    queryKey: ['own-account-details'],
    queryFn: () => UserMgtService.getOwnAccountDetails(),
    enabled: enabled
  })
  return { isPending, data }
}
