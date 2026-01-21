import { UserMgtService } from '@/services/UserMgt.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: any) => UserMgtService.updateOwnProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['account-details'] })
      queryClient.invalidateQueries({ queryKey: ['candidate-details'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    }
  })
}