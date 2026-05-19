import { useAuth } from '@/contexts/AuthProvider'
import { AuthService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'

export default function useLogout(onSuccessCallback: () => void) {
  const { dispatch } = useAuth()
  const { mutate } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      onSuccessCallback()
      dispatch({ type: 'logout' })
    }
  })

  function onLogout() {
    // The refresh token is sent via HttpOnly cookie automatically
    mutate({});
  }

  return { onLogout }
}
