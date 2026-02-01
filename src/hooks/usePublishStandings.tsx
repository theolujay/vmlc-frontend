import { CompetitionService } from '@/services/Competition.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function usePublishStandings() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ exam_id, publish_now }: { exam_id: string; publish_now: boolean }) =>
      CompetitionService.publishStandings(exam_id, publish_now),
    onSuccess: (data, variables) => {
      toast.success(variables.publish_now ? 'Standings published successfully' : 'Standings generation started');
      queryClient.invalidateQueries({ queryKey: ['exam-questions'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process standings');
    },
  });

  return { publishStandings: mutate, isPending };
}
