import { CompetitionService } from '@/services/Competition.service';
import { useQuery } from '@tanstack/react-query';

export default function useGetCompetitionCandidateDetail({
  candidate_id,
  exam_id,
  isLeagueCumulative = false,
}: {
  candidate_id: string;
  exam_id?: string;
  isLeagueCumulative?: boolean;
}) {
  return useQuery({
    queryKey: ['competition-candidate-detail', candidate_id, exam_id, isLeagueCumulative],
    queryFn: () => {
      if (isLeagueCumulative) {
        return CompetitionService.getCandidateLeagueDetail(candidate_id);
      }
      if (exam_id) {
        return CompetitionService.getCandidateStandingDetail(exam_id, candidate_id);
      }
      throw new Error('Either exam_id or isLeagueCumulative must be provided');
    },
    enabled: !!candidate_id && (!!exam_id || isLeagueCumulative),
  });
}
