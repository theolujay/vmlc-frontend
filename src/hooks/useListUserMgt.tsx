import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useListUserMgt(filters:Record<string,string>) {
  const {isPending,data}=useQuery({
    queryKey:['user-management',filters],
    queryFn:()=>UserMgtService.getUserList(filters)
  })
  return {isPending,data}
}
