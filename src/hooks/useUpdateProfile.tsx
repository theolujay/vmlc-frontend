import { UserMgtService } from '@/services/UserMgt.service'
import { ApiError } from '@/types/Index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FormData | Record<string, unknown>) => UserMgtService.updateOwnProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['account-details'] })
      queryClient.invalidateQueries({ queryKey: ['candidate-details'] })
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || (error as Error).message || 'Failed to update profile'
      toast.error(message)
    }
  })
}