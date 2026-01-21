import { UserMgtService } from '@/services/UserMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useListUserMgt(page?:number,filters?:Record<string,string>) {
  const {isPending,data}=useQuery({
    queryKey:['user-management',page,filters],
    queryFn:()=>UserMgtService.getUserList(page,filters)
  })
  return {isPending,data}
}
