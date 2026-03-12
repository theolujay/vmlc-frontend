import { CompetitionService } from '@/services/Competition.service';
import { RankingResponse } from '@/types/LeaderBoardType';
import { useQuery } from '@tanstack/react-query';

export default function useGetRanking(exam_id: string) {
  return useQuery<RankingResponse>({
    queryKey: ['competition-ranking', exam_id],
    queryFn: () => CompetitionService.getRanking(exam_id),
    enabled: !!exam_id,
  });
}
