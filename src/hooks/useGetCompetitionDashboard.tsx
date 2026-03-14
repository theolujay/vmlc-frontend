import { CompetitionService } from '@/services/Competition.service';
import { CompetitionDashboardResponse } from '@/types/ScoreboardType';
import { useQuery } from '@tanstack/react-query';

export default function useGetCompetitionDashboard() {
  return useQuery<CompetitionDashboardResponse>({
    queryKey: ['competition-dashboard'],
    queryFn: CompetitionService.getCompetitionDashboard,
  });
}
