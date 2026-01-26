import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthProvider'
import { useMemo } from 'react'

export default function useGetAccountDetails(id: string, enabled: boolean = true) {
  const { isPending, data } = useQuery({
    queryKey: ['account-details', id],
    queryFn: () => UserMgtService.getAccountDetails(id),
    enabled: !!id && enabled
  })
  
  return useMemo(() => ({ isPending, data }), [isPending, data])
}

export function useGetOwnAccountDetails(enabled: boolean = true) {
  const { authState } = useAuth()
  
  const data = useMemo(() => {
    return authState?.profile ? { profile: authState.profile } : null
  }, [authState?.profile])

  return useMemo(() => ({ 
    isPending: !authState?.profile && enabled, 
    data: data
  }), [authState?.profile, enabled, data])
}
