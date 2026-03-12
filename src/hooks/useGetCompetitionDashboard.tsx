import { CompetitionService } from '@/services/Competition.service';
import { CompetitionDashboardResponse } from '@/types/LeaderBoardType';
import { useQuery } from '@tanstack/react-query';

export default function useGetCompetitionDashboard() {
  return useQuery<CompetitionDashboardResponse>({
    queryKey: ['competition-dashboard'],
    queryFn: CompetitionService.getCompetitionDashboard,
  });
}
