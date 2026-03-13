import { BroadcastMgtService } from '@/services/BroadcastMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetBroadcast(params?: {
  page?: number;
  search?: string;
  status?: string;
  medium?: string;
}) {
  const { isPending, data } = useQuery({
    queryKey: ['broadcast-management', params],
    queryFn: () => BroadcastMgtService.getBroadcastList(params)
  })
  return { isPending, data }
}
