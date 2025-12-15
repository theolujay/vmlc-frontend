import { AuthService } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'

export default function useIsRegistrationAvailable() {
  const { isPending, data } = useQuery({
    queryKey: ['isRegistrationAvailable'],
    queryFn: AuthService.isRegistrationAvailable
  })
  return {isRegPending: isPending, isRegistrationAvailable: data }
}
