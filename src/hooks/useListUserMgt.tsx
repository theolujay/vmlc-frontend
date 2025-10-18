import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useListUserMgt() {
  const {isPending,data}=useQuery({
    queryKey:['user-management'],
    queryFn:UserMgtService.getUserList
  })
  return {isPending,data}
}
