import { CompetitionService } from '@/services/Competition.service';
import { useQuery } from '@tanstack/react-query';

export default function useGetStandings(exam_id: string) {
  return useQuery({
    queryKey: ['competition-standings', exam_id],
    queryFn: () => CompetitionService.getStandings(exam_id),
    enabled: !!exam_id,
  });
}
