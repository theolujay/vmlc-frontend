import { CompetitionService } from '@/services/Competition.service';
import { useQuery } from '@tanstack/react-query';

export default function useListRankings(page: number = 1) {
  return useQuery({
    queryKey: ['competition-rankings-list', page],
    queryFn: () => CompetitionService.listRankings(page),
  });
}
