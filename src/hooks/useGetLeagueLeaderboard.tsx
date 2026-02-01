import { CompetitionService } from '@/services/Competition.service';
import { useQuery } from '@tanstack/react-query';

export default function useGetLeagueLeaderboard() {
  return useQuery({
    queryKey: ['competition-league-leaderboard'],
    queryFn: CompetitionService.getLeagueLeaderboard,
  });
}
