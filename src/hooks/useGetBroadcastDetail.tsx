import { BroadcastMgtService } from '@/services/BroadcastMgt.service';
import { useQuery } from '@tanstack/react-query';

export default function useGetBroadcastDetail(id: number | null) {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['broadcast-detail', id],
    queryFn: () => BroadcastMgtService.getBroadcastDetail(id!),
    enabled: !!id,
    // Cache completed/failed broadcasts
    staleTime: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return 30 * 60 * 1000;
      }
      return 60 * 1000;
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      // Only auto-refetch if status is pending
      if (data?.status === 'pending') {
        return 5000;
      }
      return false;
    },
  });
  return { isPending, data, refetch };
}
