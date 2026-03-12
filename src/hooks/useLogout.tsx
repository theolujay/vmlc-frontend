import { useAuth } from '@/contexts/AuthProvider'
import { AuthService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'

export default function useLogout(onSuccessCallback: () => void) {
  const { dispatch, authState } = useAuth()
  const { mutate } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: (value) => {
      onSuccessCallback()
      dispatch({ type: 'logout' })
    }
  })




  function onLogout() {
    if (!authState?.refreshToken) {
      return;
    }
    const payload = {
      refresh: authState?.refreshToken
    }

    mutate(payload);
  }


  return { onLogout }
}
